import React, { useState, useCallback, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { formatDate } from '@/utils/date';
import { toast } from 'sonner';
import { downloadMissionFile } from '@functions/download-file-mission';
import { checkFileExists } from '@functions/check-file-mission';
import DownloadOff from '@/components/svg/DownloadOff';
import { getFileTypeByStatus } from '../_utils/getFileTypeByStatus';
import UploadFileDialog from '@/components/dialogs/UploadFileDialog';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';

export default function FournisseurActivationMissionRow({
  missionData,
  onFileUpload,
}: {
  missionData: DBMission;
  onFileUpload: () => Promise<void>;
}) {
  const missionXpertStatus = missionData.xpert_associated_status;
  const [fileStatuses, setFileStatuses] = useState<
    Record<string, { exists: boolean; createdAt?: string }>
  >({});

  const checkAllFiles = useCallback(async () => {
    const filesToCheck = [
      getFileTypeByStatus('devis', missionXpertStatus ?? ''),
      getFileTypeByStatus('devis_signed', missionXpertStatus ?? ''),
      getFileTypeByStatus('contrat_commande', missionXpertStatus ?? ''),
    ];

    const newFileStatuses: Record<
      string,
      { exists: boolean; createdAt?: string }
    > = {};

    for (const fileType of filesToCheck) {
      const result = await checkFileExists(fileType, missionData, true);
      newFileStatuses[fileType] = result;
    }

    setFileStatuses(newFileStatuses);
    await onFileUpload();
  }, [missionData, missionXpertStatus, onFileUpload]);

  const handleDownloadFile = async ({
    type,
    isTemplate = false,
  }: {
    type: string;
    isTemplate?: boolean;
  }) => {
    const supabase = createSupabaseFrontendClient();

    try {
      const basePath = isTemplate
        ? `modeles/fournisseur/${type}`
        : `${missionData.mission_number}/${missionData.supplier?.generated_id}/activation/${type}`;

      const { data: files, error: listError } = await supabase.storage
        .from('mission_files')
        .list(basePath);

      if (listError || !files || files.length === 0) {
        toast.error(
          isTemplate
            ? 'Aucun modèle disponible'
            : "Aucun fichier n'a été uploadé"
        );
        return;
      }

      const sortedFiles = files.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const mostRecentFile = sortedFiles[0];
      const filePath = `${basePath}/${mostRecentFile.name}`;
      const fileName = isTemplate ? `${type}_fournisseur` : mostRecentFile.name;

      await downloadMissionFile(filePath, fileName);
    } catch (error) {
      console.error('Error handling file download:', error);
      toast.error(
        isTemplate
          ? 'Erreur lors du téléchargement du modèle'
          : 'Erreur lors du téléchargement du fichier'
      );
    }
  };

  useEffect(() => {
    checkAllFiles();
  }, [checkAllFiles]);

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Devis</Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus('devis', missionXpertStatus ?? '')}
          title="Fournisseur - Devis"
          missionData={missionData}
          hasFile={
            fileStatuses[getFileTypeByStatus('devis', missionXpertStatus ?? '')]
              ?.exists
          }
          isFournisseurSide
        />
        <UploadFileDialog
          type={getFileTypeByStatus('devis', missionXpertStatus ?? '')}
          title="Fournisseur - Devis"
          missionData={missionData}
          onUploadSuccess={checkAllFiles}
          isFournisseurSide
        />
      </div>
      <Button
        className="size-full text-white"
        onClick={() => handleDownloadFile({ type: 'devis', isTemplate: true })}
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[getFileTypeByStatus('devis', missionXpertStatus ?? '')]
            ?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[getFileTypeByStatus('devis', missionXpertStatus ?? '')]
            ?.exists
            ? 'Envoyé'
            : 'Non envoyé'}
        </p>
        <p>
          {fileStatuses[getFileTypeByStatus('devis', missionXpertStatus ?? '')]
            ?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus('devis', missionXpertStatus ?? '')
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>

      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Devis signé</Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')}
          title="Fournisseur - Devis signé"
          missionData={missionData}
          hasFile={
            fileStatuses[
              getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')
            ]?.exists
          }
          isFournisseurSide
        />
        <Button
          className="size-full text-white"
          onClick={() => handleDownloadFile({ type: 'devis_signed' })}
          disabled={
            !fileStatuses[
              getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')
            ]?.exists
          }
        >
          {fileStatuses[
            getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')
          ]?.exists ? (
            <Download className="size-6" />
          ) : (
            <DownloadOff className="size-6" />
          )}
        </Button>
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <UploadFileDialog
        type={getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')}
        title="Fournisseur - Devis signé"
        buttonText="Loader devis signé"
        missionData={missionData}
        onUploadSuccess={checkAllFiles}
        isFournisseurSide
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[
            getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')
          ]?.exists
            ? 'Reçu'
            : 'Non reçu'}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus('devis_signed', missionXpertStatus ?? '')
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>

      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Contrat de mission / Commande
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatus(
            'contrat_commande',
            missionXpertStatus ?? ''
          )}
          title="Fournisseur - Contrat de mission / Commande"
          missionData={missionData}
          hasFile={
            fileStatuses[
              getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
            ]?.exists
          }
          isFournisseurSide
        />
        <Button
          className="size-full text-white"
          onClick={() => handleDownloadFile({ type: 'contrat_commande' })}
          disabled={
            !fileStatuses[
              getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
            ]?.exists
          }
        >
          {fileStatuses[
            getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
          ]?.exists ? (
            <Download className="size-6" />
          ) : (
            <DownloadOff className="size-6" />
          )}
        </Button>
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <UploadFileDialog
        type={getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')}
        title="Fournisseur - Contrat de mission / Commande"
        buttonText="Loader contrat signé"
        missionData={missionData}
        onUploadSuccess={checkAllFiles}
        isFournisseurSide
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[
            getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
          ]?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[
            getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
          ]?.exists
            ? 'Reçu'
            : 'Non reçu'}
        </p>
        <p>
          {fileStatuses[
            getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
          ]?.exists
            ? formatDate(
                fileStatuses[
                  getFileTypeByStatus(
                    'contrat_commande',
                    missionXpertStatus ?? ''
                  )
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
    </>
  );
}
