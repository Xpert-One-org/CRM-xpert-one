import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

type SideEntry = { year: number; month: number; createdAt: string };
type TypeEntry = {
  xpertFiles: SideEntry[];
  fournisseurFiles: SideEntry[];
  noFilesFound: boolean;
};

export async function POST(req: Request) {
  const { missions, types } = (await req.json()) as {
    missions: {
      mission_number: string;
      xpert_generated_id?: string | null;
      supplier_generated_id?: string | null;
      start_date?: string | null;
    }[];
    types: string[];
  };

  const bucket = 'mission_files';
  const out: Record<string, Record<string, TypeEntry>> = {};

  for (const m of missions) {
    const xpertPrefix = m.xpert_generated_id
      ? `${m.mission_number}/${m.xpert_generated_id}/facturation/`
      : null;
    const fournisseurPrefix = m.supplier_generated_id
      ? `${m.mission_number}/${m.supplier_generated_id}/facturation/`
      : null;

    if (!xpertPrefix && !fournisseurPrefix) {
      out[m.mission_number] = {};
      continue;
    }

    const prefixes = [xpertPrefix, fournisseurPrefix].filter(
      Boolean
    ) as string[];
    const orFilter = prefixes.map((p) => `name.ilike.${p}%`).join(',');

    const { data, error } = await supabaseAdmin
      .schema('storage')
      .from('objects')
      .select('name,created_at')
      .eq('bucket_id', bucket)
      .or(orFilter);

    if (error || !data) {
      out[m.mission_number] = {};
      continue;
    }

    // map[type] -> { xpertFiles[], fournisseurFiles[] }
    const map: Record<
      string,
      { xpertFiles: SideEntry[]; fournisseurFiles: SideEntry[] }
    > = {};

    for (const row of data) {
      const name = row.name;
      const parts = name.split('/');
      const idx = parts.findIndex((p: string) => p === 'facturation');
      if (idx < 0) continue;

      const year = parseInt(parts[idx + 1] || '', 10);
      const mm = parseInt(parts[idx + 2] || '', 10);
      const t = parts[idx + 3] || '';

      if (!year || !mm || !t) continue;
      if (!types.includes(t)) continue;

      const isXpert = xpertPrefix ? name.startsWith(xpertPrefix) : false;
      const isFournisseur = fournisseurPrefix
        ? name.startsWith(fournisseurPrefix)
        : false;

      if (!map[t]) map[t] = { xpertFiles: [], fournisseurFiles: [] };

      const entry: SideEntry = {
        year,
        month: mm - 1,
        createdAt: row.created_at,
      };

      if (isXpert) map[t].xpertFiles.push(entry);
      else if (isFournisseur) map[t].fournisseurFiles.push(entry);
      // si jamais un fichier ne matche aucun des deux, on l’ignore
    }

    // Compacte: garde le plus récent par (year,month) pour chaque côté
    const compact: Record<string, TypeEntry> = {};
    for (const t of Object.keys(map)) {
      const takeLatest = (arr: SideEntry[]) => {
        const byYM = new Map<string, SideEntry>();
        for (const it of arr) {
          const key = `${it.year}-${it.month}`;
          const prev = byYM.get(key);
          if (!prev || new Date(it.createdAt) > new Date(prev.createdAt)) {
            byYM.set(key, it);
          }
        }
        return Array.from(byYM.values());
      };

      const xpertFiles = takeLatest(map[t].xpertFiles);
      const fournisseurFiles = takeLatest(map[t].fournisseurFiles);

      compact[t] = {
        xpertFiles,
        fournisseurFiles,
        noFilesFound: xpertFiles.length === 0 && fournisseurFiles.length === 0,
      };
    }

    out[m.mission_number] = compact;
  }

  return NextResponse.json({ data: out });
}
