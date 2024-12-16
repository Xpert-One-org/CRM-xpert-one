'use client';

import React, { useState } from 'react';
import { Credenza, CredenzaContent } from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { FileType } from './XpertActivationMissionRow';
import type { DBMission } from '@/types/typesDb';

type ViewFileDialogProps = {
  type: FileType;
  title: string;
  missionData: DBMission;
  hasFile?: boolean;
  isFournisseurSide?: boolean;
};

export default function ViewFileDialog({
  type,
  title,
  missionData,
  hasFile = false,
  isFournisseurSide = false,
}: ViewFileDialogProps) {
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleViewFile = async () => {
    const supabase = createSupabaseFrontendClient();

    try {
      const filePath = `${missionData.mission_number}/${
        isFournisseurSide
          ? missionData.supplier?.generated_id
          : missionData.xpert?.generated_id
      }/activation/${type}`;

      console.log('filePath', filePath);

      const { data: files } = await supabase.storage
        .from('mission_files')
        .list(filePath);

      const sortedFiles = files?.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const mostRecentFile = sortedFiles?.[0];
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('mission_files')
        .createSignedUrl(`${filePath}/${mostRecentFile?.name}`, 3600);

      if (downloadError || !fileData) {
        toast.error('Erreur lors de la récupération du fichier');
        return;
      }

      setFileUrl(fileData.signedUrl);
      setOpen(true);
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error('Erreur lors de la récupération du fichier');
    }
  };

  return (
    <>
      <Button
        className="size-full text-white"
        onClick={handleViewFile}
        disabled={!hasFile}
      >
        {hasFile ? <Eye className="size-6" /> : <EyeOff className="size-6" />}
      </Button>

      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent className="my-2 h-[90vh] max-w-[90vw] overflow-hidden rounded-sm border-0 bg-white p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="min-h-0 flex-1">
              {fileUrl && (
                <iframe
                  src={fileUrl}
                  className="size-full border-0"
                  title="Document preview"
                />
              )}
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
