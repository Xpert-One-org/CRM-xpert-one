import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { DBMission } from '@/types/typesDb';

export async function checkFileExists(type: string, missionData: DBMission) {
  const supabase = createSupabaseFrontendClient();
  const filePath = `${missionData.mission_number}/${missionData.xpert?.generated_id}/activation/${type}`;

  try {
    const { data: files, error } = await supabase.storage
      .from('mission_files')
      .list(filePath);

    if (error || !files || files.length === 0) {
      return { exists: false };
    }

    const sortedFiles = files.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const mostRecentFile = sortedFiles[0];
    return { exists: true, createdAt: mostRecentFile.created_at };
  } catch (error) {
    console.error('Error checking file existence:', error);
    return { exists: false };
  }
}
