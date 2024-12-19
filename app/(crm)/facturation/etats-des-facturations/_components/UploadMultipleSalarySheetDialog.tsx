'use client';

import React, { useState } from 'react';
import {
  Credenza,
  CredenzaContent,
  CredenzaClose,
} from '@/components/ui/credenza';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { DBMission } from '@/types/typesDb';
import { getFileTypeByStatusFacturation } from '../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';

import { DownloadIcon } from 'lucide-react';
import { uppercaseFirstLetter } from '@/utils/string';
import FileInput from '@/components/inputs/FileInput';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { generateMonthsRange } from '../_utils/generateMonthsRange';
import { checkFileStatusForDate } from '../_utils/checkFileStatusForDate';

type MissionUpload = {
  mission: DBMission;
  monthYear: { month: number; year: number };
  file: File | null;
  isError?: boolean;
  errorMessage?: string;
};

export default function UploadMultipleSalarySheetDialog({
  missions,
  onUploadSuccess,
}: {
  missions: DBMission[];
  onUploadSuccess?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [missionsToUpload, setMissionsToUpload] = useState<MissionUpload[]>([]);
  const { fileStatusesByMission } = useFileStatusFacturationStore();

  const handleOpenDialog = () => {
    const cdiMissionsWithoutSalarySheet = missions.filter(
      (mission) => mission.xpert_associated_status === 'cdi'
    );

    const uploads: MissionUpload[] = cdiMissionsWithoutSalarySheet.flatMap(
      (mission) => {
        const months: MissionUpload[] = [];
        const fileStatuses =
          fileStatusesByMission[mission.mission_number || ''] || {};

        const missionMonths = generateMonthsRange(
          mission.start_date || '',
          mission.end_date || ''
        );

        for (const monthYear of missionMonths) {
          const fileStatus = checkFileStatusForDate(
            fileStatuses,
            monthYear.year,
            monthYear.month,
            false,
            getFileTypeByStatusFacturation(
              'salary_sheet',
              mission.xpert_associated_status || ''
            )
          );

          if (!fileStatus.exists) {
            months.push({
              mission,
              monthYear: {
                month: monthYear.month,
                year: monthYear.year,
              },
              file: null,
            });
          }
        }
        return months;
      }
    );

    const sortedUploads = uploads.sort((a, b) => {
      if (a.monthYear.year !== b.monthYear.year) {
        return a.monthYear.year - b.monthYear.year;
      }
      if (a.monthYear.month !== b.monthYear.month) {
        return a.monthYear.month - b.monthYear.month;
      }
      return (
        a.mission.mission_number?.localeCompare(
          b.mission.mission_number || ''
        ) || 0
      );
    });

    setMissionsToUpload(sortedUploads);
    setIsOpen(true);
  };

  const checkFileNaming = (
    file: File,
    mission: DBMission,
    monthYear: { month: number; year: number }
  ) => {
    const expectedName = `${mission.mission_number}_${mission.xpert?.generated_id}_${monthYear.year}_${monthYear.month < 10 ? '0' : ''}${monthYear.month + 1}`;
    const fileName = file.name.split('.')[0]; // Retire l'extension

    return fileName === expectedName;
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setMissionsToUpload((prev) => {
        const newUploads = [...prev];
        const currentUpload = newUploads[index];

        const isValidNaming = checkFileNaming(
          file,
          currentUpload.mission,
          currentUpload.monthYear
        );

        newUploads[index] = {
          ...currentUpload,
          file,
          isError: !isValidNaming,
          errorMessage: !isValidNaming
            ? 'Le nom du fichier ne respecte pas la convention de nommage'
            : undefined,
        };
        return newUploads;
      });
    }
  };

  const handleUploadFiles = async () => {
    const hasNamingErrors = missionsToUpload.some(
      (upload) => upload.file && upload.isError
    );

    if (hasNamingErrors) {
      toast.error(
        'Certains fichiers ne respectent pas la convention de nommage'
      );
      return;
    }

    setIsUploading(true);
    const supabase = createSupabaseFrontendClient();
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const upload of missionsToUpload) {
        if (!upload.file) continue;

        const { mission, monthYear, file } = upload;
        const filePath = `${mission.mission_number}/${
          mission.xpert?.generated_id
        }/facturation/${getFileTypeByStatusFacturation(
          'salary_sheet',
          mission.xpert_associated_status || ''
        )}/${monthYear.year}-${(monthYear.month + 1)
          .toString()
          .padStart(2, '0')}-${file.name}`;

        const { error } = await supabase.storage
          .from('mission_files')
          .upload(filePath, file);

        console.log(filePath);

        if (error) {
          console.error('Error uploading file:', error);
          errorCount++;
        } else {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} bulletin${
            successCount > 1 ? 's' : ''
          } de salaire uploadé${successCount > 1 ? 's' : ''}`
        );
        onUploadSuccess?.();
      }
      if (errorCount > 0) {
        toast.error(
          `${errorCount} erreur${errorCount > 1 ? 's' : ''} lors de l'upload`
        );
      }
    } catch (error) {
      console.error('Error during upload:', error);
      toast.error("Une erreur s'est produite lors de l'upload");
    } finally {
      setIsUploading(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="h-spaceLarge w-full bg-primary text-white"
      >
        <DownloadIcon className="size-6 -rotate-90 text-white" />
      </Button>

      <Credenza open={isOpen} onOpenChange={setIsOpen}>
        <CredenzaContent className="max-h-[90vh] max-w-[700px] overflow-y-auto rounded-sm border-0 bg-white p-4 backdrop-blur-sm">
          <div className="grid gap-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Upload Multiple des Bulletins de Salaire
              </h2>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {missionsToUpload.map((upload, index) => (
                  <div
                    key={`${upload.mission.mission_number}-${upload.monthYear.year}-${upload.monthYear.month}`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-bold text-primary">
                        {upload.mission.mission_number}
                      </h3>
                      <h3 className="text-md font-bold">
                        {uppercaseFirstLetter(
                          new Date(
                            upload.monthYear.year,
                            upload.monthYear.month
                          ).toLocaleDateString('fr-FR', {
                            month: 'long',
                            year: 'numeric',
                          })
                        )}
                      </h3>
                    </div>
                    <FileInput
                      classNameInput="xl:max-w-full"
                      onChange={(e) => handleFileChange(e, index)}
                      accept=".pdf,.doc,.docx"
                      disabled={isUploading}
                      label={'Bulletin de salaire'}
                      placeholder={`${upload.mission.mission_number}_${upload.mission.xpert?.generated_id}_${upload.monthYear.year}_${upload.monthYear.month < 10 ? '0' : ''}${upload.monthYear.month + 1}.pdf`}
                      hasError={upload.isError}
                      errorMessageText={upload.errorMessage}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <CredenzaClose asChild>
                <Button variant="outline" disabled={isUploading}>
                  Annuler
                </Button>
              </CredenzaClose>
              <Button
                onClick={handleUploadFiles}
                disabled={
                  isUploading ||
                  !missionsToUpload.some((upload) => upload.file !== null)
                }
                className="bg-primary text-white hover:bg-primary/80"
              >
                {isUploading
                  ? 'Upload en cours...'
                  : 'Uploader tous les fichiers'}
              </Button>
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
