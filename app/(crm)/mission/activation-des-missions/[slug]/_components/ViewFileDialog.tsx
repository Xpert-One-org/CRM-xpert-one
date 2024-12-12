'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Credenza, CredenzaContent } from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { FileType } from './XpertActivationMissionRow';
import type { DBMission } from '@/types/typesDb';

type ViewFileDialogProps = {
  type: FileType;
  title: string;
  missionData: DBMission;
  onFileCheck: (hasFile: boolean, createdAt?: string) => void;
};

export default function ViewFileDialog({
  type,
  title,
  missionData,
  onFileCheck,
}: ViewFileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  const checkFile = useCallback(async () => {
    const supabase = createSupabaseFrontendClient();
    try {
      const filePath = `${missionData.mission_number}/${missionData.xpert?.generated_id}/activation/${type}`;

      const { data: files, error: listError } = await supabase.storage
        .from('mission_files')
        .list(filePath);

      if (!listError && files && files.length > 0) {
        const lastFile = files[files.length - 1];
        onFileCheck(true, lastFile.created_at);
      } else {
        onFileCheck(false);
      }
    } catch (error) {
      console.error('Error checking file:', error);
      onFileCheck(false);
    }
  }, [type, missionData, onFileCheck]);

  useEffect(() => {
    if (isInitialCheck) {
      checkFile();
      setIsInitialCheck(false);
    }
  }, [checkFile, isInitialCheck]);

  const handleViewFile = async () => {
    setIsLoading(true);
    const supabase = createSupabaseFrontendClient();

    try {
      const filePath = `${missionData.mission_number}/${missionData.xpert?.generated_id}/activation/${type}`;

      const { data: files, error: listError } = await supabase.storage
        .from('mission_files')
        .list(filePath);

      if (listError || !files || files.length === 0) {
        toast.error("Aucun fichier n'a été uploadé");
        return;
      }

      const lastFile = files[files.length - 1];
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('mission_files')
        .createSignedUrl(`${filePath}/${lastFile.name}`, 3600);

      if (downloadError || !fileData) {
        toast.error('Erreur lors de la récupération du fichier');
        return;
      }

      setFileUrl(fileData.signedUrl);
      setOpen(true);
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error('Erreur lors de la récupération du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="size-full text-white"
        onClick={handleViewFile}
        disabled={isLoading}
      >
        <Eye className="size-6" />
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
