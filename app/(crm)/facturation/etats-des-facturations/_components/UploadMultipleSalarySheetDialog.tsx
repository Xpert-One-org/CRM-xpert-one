'use client';

import React, { useState, useCallback } from 'react';
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
import { DownloadIcon, UploadCloud } from 'lucide-react';
import { uppercaseFirstLetter } from '@/utils/string';
import FileInput from '@/components/inputs/FileInput';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { generateMonthsRange } from '../_utils/generateMonthsRange';
import { checkFileStatusForDate } from '../_utils/checkFileStatusForDate';
import { useDropzone } from 'react-dropzone';

type MissionUpload = {
  mission: DBMission;
  monthYear: { month: number; year: number };
  file: File | null;
  isError?: boolean;
  errorMessage?: string;
  fileName?: string;
};

export default function UploadMultipleSalarySheetDialog({
  missions,
  onUploadSuccess,
  isFournisseur = false,
}: {
  missions: DBMission[];
  onUploadSuccess?: () => void;
  isFournisseur?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [missionsToUpload, setMissionsToUpload] = useState<MissionUpload[]>([]);
  const { fileStatusesByMission } = useFileStatusFacturationStore();

  const handleOpenDialog = () => {
    const filteredMissions = isFournisseur
      ? missions
      : missions.filter((mission) => mission.xpert_associated_status === 'cdi');

    const uploads: MissionUpload[] = filteredMissions.flatMap((mission) => {
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
          isFournisseur,
          getFileTypeByStatusFacturation(
            isFournisseur ? 'invoice' : 'salary_sheet',
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
    });

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
    const monthNumber = monthYear.month + 1;
    const formattedMonth =
      monthNumber < 10 ? `0${monthNumber}` : `${monthNumber}`;

    const expectedName = `${mission.mission_number}_${
      isFournisseur
        ? mission.supplier?.generated_id
        : mission.xpert?.generated_id
    }_${monthYear.year}_${formattedMonth}`;

    const fileName = file.name.split('.')[0];
    return fileName === expectedName;
  };

  const findMatchingMission = (
    fileName: string
  ): {
    mission: DBMission;
    monthYear: { month: number; year: number };
  } | null => {
    const parts = fileName.split('_');
    if (parts.length !== 4) return null;

    const [missionNumber, generatedId, year, monthStr] = parts;
    const month = parseInt(monthStr, 10) - 1; // Convert to 0-based month

    const mission = missions.find(
      (m) =>
        m.mission_number === missionNumber &&
        (isFournisseur
          ? m.supplier?.generated_id === generatedId
          : m.xpert?.generated_id === generatedId)
    );

    if (!mission) return null;

    return {
      mission,
      monthYear: { month, year: parseInt(year, 10) },
    };
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newUploads = [...missionsToUpload];
      let hasNamingError = false;
      const invalidFiles: string[] = [];

      acceptedFiles.forEach((file) => {
        const fileNameWithoutExt = file.name.split('.')[0];
        const match = findMatchingMission(fileNameWithoutExt);

        if (match) {
          const existingIndex = newUploads.findIndex(
            (upload) =>
              upload.mission.mission_number === match.mission.mission_number &&
              upload.monthYear.month === match.monthYear.month &&
              upload.monthYear.year === match.monthYear.year
          );

          if (existingIndex !== -1) {
            const isValidNaming = checkFileNaming(
              file,
              match.mission,
              match.monthYear
            );
            if (!isValidNaming) {
              hasNamingError = true;
              invalidFiles.push(file.name);
            }
            newUploads[existingIndex] = {
              ...newUploads[existingIndex],
              file,
              fileName: file.name,
              isError: !isValidNaming,
              errorMessage: !isValidNaming
                ? 'Le nom du fichier ne respecte pas la convention de nommage'
                : undefined,
            };
          }
        } else {
          hasNamingError = true;
          invalidFiles.push(file.name);
        }
      });

      if (hasNamingError) {
        toast.error(
          <div>
            <p>Les fichiers suivants ne respectent pas la nomenclature :</p>
            <ul className="mt-2 list-disc pl-4">
              {invalidFiles.map((fileName, index) => (
                <li key={index} className="text-sm">
                  {fileName}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      setMissionsToUpload(newUploads);
    },
    [missionsToUpload, missions, isFournisseur]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    multiple: true,
  });

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
        const formattedMonth = (monthYear.month + 1)
          .toString()
          .padStart(2, '0');

        const filePath = `${mission.mission_number}/${
          isFournisseur
            ? mission.supplier?.generated_id
            : mission.xpert?.generated_id
        }/facturation/${monthYear.year}/${formattedMonth}/${getFileTypeByStatusFacturation(
          isFournisseur ? 'invoice' : 'salary_sheet',
          mission.xpert_associated_status || ''
        )}/${file.name}`;

        const { error } = await supabase.storage
          .from('mission_files')
          .upload(filePath, file);

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
                Upload plusieurs{' '}
                {isFournisseur
                  ? 'Factures - FOURNISSEUR'
                  : 'Bulletins de Salaires - XPERT'}
              </h2>

              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-300'
                }`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto size-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Glissez et déposez vos fichiers ici, ou cliquez pour
                  sélectionner
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Format accepté : PDF, DOC, DOCX
                </p>
              </div>

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
                    <div className="relative">
                      <div className="flex items-center gap-2 rounded-md border p-2">
                        <div className="flex-1">
                          {upload.file ? (
                            <p
                              className={`text-sm ${upload.isError ? 'text-red-500' : 'text-gray-600'}`}
                            >
                              {upload.fileName}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400">
                              {`${upload.mission.mission_number}_${
                                isFournisseur
                                  ? upload.mission.supplier?.generated_id
                                  : upload.mission.xpert?.generated_id
                              }_${upload.monthYear.year}_${
                                upload.monthYear.month + 1 < 10
                                  ? `0${upload.monthYear.month + 1}`
                                  : upload.monthYear.month + 1
                              }.pdf`}
                            </p>
                          )}
                        </div>
                        {upload.isError && (
                          <p className="text-xs text-red-500">
                            {upload.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
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
                  !missionsToUpload.some(
                    (upload) => upload.file && !upload.isError
                  )
                }
                className="bg-primary text-white hover:bg-primary/80"
              >
                {isUploading
                  ? 'Upload en cours...'
                  : `Uploader tous les fichiers ${
                      missionsToUpload.filter((upload) => !upload.file).length >
                      0
                        ? `(${
                            missionsToUpload.filter((upload) => !upload.file)
                              .length
                          } restant${
                            missionsToUpload.filter((upload) => !upload.file)
                              .length > 1
                              ? 's'
                              : ''
                          })`
                        : ''
                    }`}
              </Button>
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
