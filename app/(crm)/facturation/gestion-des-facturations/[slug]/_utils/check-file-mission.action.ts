import type { DBMission } from '@/types/typesDb';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

type FileInfo = {
  year: number;
  month: number;
  createdAt: string;
};

type FileExistsResult = {
  disabled?: boolean;
  xpertFiles: FileInfo[];
  fournisseurFiles: FileInfo[];
  noFilesFound: boolean;
};

async function listFilesInPath(
  basePath: string,
  type: string
): Promise<FileInfo[]> {
  const supabase = createSupabaseFrontendClient();

  const { data: years, error: yearsError } = await supabase.storage
    .from('mission_files')
    .list(basePath);

  if (yearsError || !years || years.length === 0) {
    return [];
  }

  const existingFiles: FileInfo[] = [];

  // Check each year directory
  for (const yearDir of years) {
    if (!yearDir.name.match(/^\d{4}$/)) continue;
    const year = parseInt(yearDir.name);

    const { data: months, error: monthsError } = await supabase.storage
      .from('mission_files')
      .list(`${basePath}/${year}`);

    if (!monthsError && months) {
      // Check each month directory
      for (const monthDir of months) {
        if (!monthDir.name.match(/^\d{2}$/)) continue;
        const month = parseInt(monthDir.name) - 1;

        // Check if file exists in this year/month
        const { data: files, error: filesError } = await supabase.storage
          .from('mission_files')
          .list(`${basePath}/${year}/${monthDir.name}/${type}`);

        if (!filesError && files && files.length > 0) {
          // Sort files by creation date and get the most recent one
          const sortedFiles = files.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

          existingFiles.push({
            year,
            month,
            createdAt: sortedFiles[0].created_at,
          });
        }
      }
    }
  }

  return existingFiles;
}

export async function checkFileExistsFacturations(
  type: string,
  missionData: DBMission
): Promise<FileExistsResult> {
  try {
    // Check XPERT files
    const xpertPath = `${missionData.mission_number}/${missionData.xpert?.generated_id}/facturation`;
    const xpertFiles = await listFilesInPath(xpertPath, type);

    // Check Fournisseur files
    const fournisseurPath = `${missionData.mission_number}/${missionData.supplier?.generated_id}/facturation`;
    const fournisseurFiles = await listFilesInPath(fournisseurPath, type);

    const noFilesFound =
      xpertFiles.length === 0 && fournisseurFiles.length === 0;

    return {
      xpertFiles,
      fournisseurFiles,
      noFilesFound,
      disabled: false,
    };
  } catch (error) {
    console.error('Error checking file existence:', error);
    return {
      xpertFiles: [],
      fournisseurFiles: [],
      noFilesFound: true,
      disabled: false,
    };
  }
}
