'use client';

import React, { useState } from 'react';
import {
  Credenza,
  CredenzaContent,
  CredenzaClose,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { DBMission } from '@/types/typesDb';
import type { FileType } from '@/types/mission';
import DownloadOff from '../svg/DownloadOff';

type UploadFileDialogProps = {
  type: FileType;
  buttonText?: string;
  title: string;
  missionData: DBMission;
  onUploadSuccess?: () => void;
  isFournisseurSide?: boolean;
  isFacturation?: boolean;
  disabled?: boolean;
  selectedYear?: number;
  selectedMonth?: number;
};

export default function UploadFileDialog({
  type,
  title,
  buttonText,
  missionData,
  onUploadSuccess,
  isFournisseurSide = false,
  isFacturation = false,
  disabled = false,
  selectedYear,
  selectedMonth,
}: UploadFileDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadFile = async () => {
    if (!selectedFile) {
      toast.error("Aucun fichier n'a été sélectionné");
      return;
    }

    setIsUploading(true);
    const supabase = createSupabaseFrontendClient();

    try {
      const dateFolder =
        isFacturation && selectedYear && selectedMonth !== undefined
          ? `${selectedYear}/${(selectedMonth + 1).toString().padStart(2, '0')}`
          : '';

      const filePath = `${missionData.mission_number}/${
        isFournisseurSide
          ? missionData.supplier?.generated_id
          : missionData.xpert?.generated_id
      }/${isFacturation ? `facturation/${dateFolder}` : 'activation'}/${type}/${
        selectedFile.name
      }`;

      const { error } = await supabase.storage
        .from('mission_files')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        toast.error("Erreur lors de l'upload du fichier");
        console.error('Error uploading file:', error);
        return;
      }

      toast.success('Fichier uploadé avec succès');
      onUploadSuccess?.();
      setOpen(false);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Erreur lors de l'upload du fichier");
      console.error('Error handling upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button
        className="size-full gap-1 text-white"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        {buttonText ?? ''}
        <div>
          {disabled ? (
            <DownloadOff className="size-8 -rotate-90" />
          ) : (
            <Download className="size-6 -rotate-90" />
          )}
        </div>
      </Button>
      <Credenza open={open} onOpenChange={setOpen}>
        <CredenzaContent className="max-w-[600px] overflow-hidden rounded-sm border-0 bg-white p-0 backdrop-blur-sm">
          <div className="flex flex-col gap-6 p-6">
            <p className="text-lg font-semibold">Upload {title}</p>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Sélectionnez un fichier à uploader (.pdf, .doc, .docx)
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
                disabled={isUploading}
                className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/80"
              />
              {isUploading && (
                <div className="text-sm text-gray-500">Upload en cours...</div>
              )}
            </div>
            <div className="flex justify-end gap-x-3">
              <CredenzaClose asChild>
                <Button
                  variant="outline"
                  className="border border-black"
                  disabled={isUploading}
                >
                  Annuler
                </Button>
              </CredenzaClose>
              <Button
                onClick={handleUploadFile}
                disabled={!selectedFile || isUploading}
                className="bg-primary text-white hover:bg-primary/80"
              >
                {isUploading ? 'Upload en cours...' : 'Uploader le fichier'}
              </Button>
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
