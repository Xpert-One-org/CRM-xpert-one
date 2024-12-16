import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export const downloadMissionFile = async (
  filePath: string,
  fileName: string
) => {
  const supabase = createSupabaseFrontendClient();
  try {
    const { data, error } = await supabase.storage
      .from('mission_files')
      .download(filePath);

    if (error || !data) {
      toast.error('Erreur lors du téléchargement du fichier');
      return;
    }

    const blob = new Blob([data], { type: data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Erreur lors du téléchargement du fichier');
  }
};
