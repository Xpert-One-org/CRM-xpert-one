import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

type SideEntry = {
  year: number;
  month: number; // 0..11
  createdAt: string;
  createdAtMs: number;
};

type TypeEntry = {
  xpertFiles: SideEntry[];
  fournisseurFiles: SideEntry[];
  noFilesFound: boolean;
};

// Normalise une date "YYYY-MM-DD HH:mm:ss+00" -> "YYYY-MM-DDTHH:mm:ss+00" (ISO-ish) puis parse en ms
const toMs = (s: string) => {
  const iso = s.includes('T') ? s : s.replace(' ', 'T');
  return Date.parse(iso);
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

    // Aucun des deux préfixes -> rien à faire pour cette mission
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
      .select('name, created_at, updated_at')
      .eq('bucket_id', bucket)
      .or(orFilter)
      // Le tri ne remplace pas la logique JS, mais il aide à limiter les surprises
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false });

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
      const name = row.name as string;
      const parts = name.split('/');

      // On cherche ".../facturation/<year>/<mm>/<type>/<...fichier...>"
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
      if (!isXpert && !isFournisseur) continue; // on ignore ce qui ne matche aucun des deux côtés

      if (!map[t]) map[t] = { xpertFiles: [], fournisseurFiles: [] };

      const ts = (row as any).updated_at ?? (row as any).created_at;
      const entry: SideEntry = {
        year,
        month: mm - 1, // 0..11
        createdAt: ts,
        createdAtMs: toMs(ts),
      };

      if (isXpert) map[t].xpertFiles.push(entry);
      else if (isFournisseur) map[t].fournisseurFiles.push(entry);
    }

    // Compactage : on garde le plus récent par (year, month) pour chaque côté et chaque type
    const compact: Record<string, TypeEntry> = {};
    const takeLatest = (arr: SideEntry[]) => {
      const byYM = new Map<string, SideEntry>();
      for (const it of arr) {
        const key = `${it.year}-${it.month}`;
        const prev = byYM.get(key);
        if (!prev || it.createdAtMs > prev.createdAtMs) {
          byYM.set(key, it);
        }
      }
      return Array.from(byYM.values());
    };

    for (const t of Object.keys(map)) {
      const xpertFiles = takeLatest(map[t].xpertFiles);
      const fournisseurFiles = takeLatest(map[t].fournisseurFiles);

      compact[t] = {
        xpertFiles,
        fournisseurFiles,
        noFilesFound: xpertFiles.length === 0 && fournisseurFiles.length === 0,
      };
    }

    out[m.mission_number] = compact;

    // Debug ciblé : vérifier la clé mentionnée
    if (
      m.mission_number === 'M 9869' &&
      compact.invoice_received_freelance_portage
    ) {
      console.log({
        out: compact.invoice_received_freelance_portage.xpertFiles.map((f) => ({
          createdAt: f.createdAt,
          createdAtMs: f.createdAtMs,
        })),
      });
    }
    if (m.mission_number === 'M 9869') {
      console.log({
        out: out[m.mission_number].invoice_validated_freelance_portage
          .xpertFiles,
      });
    }
  }

  return NextResponse.json({ data: out });
}
