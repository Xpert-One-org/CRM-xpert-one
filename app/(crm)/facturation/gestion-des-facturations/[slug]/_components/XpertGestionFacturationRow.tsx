import React, { useState, useCallback, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission, DBProfileStatus } from '@/types/typesDb';
import UploadFileDialog from '@/components/dialogs/UploadFileDialog';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { formatDate } from '@/utils/date';
import { toast } from 'sonner';
import DownloadOff from '@/components/svg/DownloadOff';
import type { DownloadType } from '@/types/mission';
import { checkFileExists } from '@functions/check-file-mission';
import { downloadMissionFile } from '@functions/download-file-mission';

export default function XpertGestionFacturationRow({
  status,
  missionData,
}: {
  status: DBProfileStatus['status'];
  missionData: DBMission;
}) {
  const [fileStatuses, setFileStatuses] = useState<
    Record<string, { exists: boolean; createdAt?: string }>
  >({});

  const checkAllFiles = useCallback(async () => {
    const filesToCheck = [
      'presence_sheet',
      'presence_sheet_signed',
      status === 'cdi' ? 'salary_sheet' : 'invoice_received',
      status === 'cdi' ? 'salary_payment' : 'invoice_paid',
    ];

    const newFileStatuses: Record<
      string,
      { exists: boolean; createdAt?: string }
    > = {};

    for (const fileType of filesToCheck) {
      const result = await checkFileExists(fileType, missionData, false, true);
      newFileStatuses[fileType] = result;
    }

    setFileStatuses(newFileStatuses);
  }, [missionData, status]);

  const handleDownloadFile = async ({
    type,
    isTemplate = false,
  }: DownloadType) => {
    const supabase = createSupabaseFrontendClient();

    try {
      const basePath = isTemplate
        ? `modeles_facturation/${status === 'cdi' ? 'cdi' : 'freelance-portage'}/`
        : `${missionData.mission_number}/${missionData.xpert?.generated_id}/facturation/${type}`;

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
      const fileName = isTemplate ? `${type}_${status}` : mostRecentFile.name;

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
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Feuille de présence signée
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type="presence_sheet"
          title="Feuille de présence"
          missionData={missionData}
          hasFile={fileStatuses['presence_sheet']?.exists}
          isFacturation
        />
        <Button
          className="size-full text-white"
          onClick={() => handleDownloadFile({ type: 'presence_sheet' })}
          disabled={!fileStatuses['presence_sheet']?.exists}
        >
          {fileStatuses['presence_sheet']?.exists ? (
            <Download className="size-6" />
          ) : (
            <DownloadOff className="size-6" />
          )}
        </Button>
      </div>
      <Button
        className="size-full text-white"
        onClick={() =>
          handleDownloadFile({ type: 'presence_sheet', isTemplate: true })
        }
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <UploadFileDialog
        type="presence_sheet_signed"
        title="Feuille de présence signée"
        buttonText="Loader heure signée"
        missionData={missionData}
        onUploadSuccess={checkAllFiles}
        isFacturation
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses['presence_sheet']?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>{fileStatuses['presence_sheet']?.exists ? 'Reçu' : 'Non reçu'}</p>
        <p>
          {fileStatuses['presence_sheet']?.exists
            ? formatDate(fileStatuses['presence_sheet']?.createdAt ?? '')
            : ''}
        </p>
      </Box>

      <Box className="col-span-2 h-[70px] w-full bg-[#F5F5F5]">
        {status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
      </Box>
      <div className="col-span-1 flex gap-2">
        {status !== 'cdi' ? (
          <ViewFileDialog
            type="invoice_received"
            title={status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
            missionData={missionData}
            hasFile={fileStatuses['invoice_received']?.exists}
            isFacturation
          />
        ) : null}
        {status === 'cdi' ? (
          <UploadFileDialog
            type="salary_sheet"
            title={status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
            missionData={missionData}
            onUploadSuccess={checkAllFiles}
            isFacturation
          />
        ) : (
          <Button
            className="size-full text-white"
            onClick={() => handleDownloadFile({ type: 'invoice_received' })}
            disabled={!fileStatuses['invoice_received']?.exists}
          >
            <Download className="size-6" />
          </Button>
        )}
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      {status !== 'cdi' ? (
        <UploadFileDialog
          type="invoice_received"
          title={status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
          buttonText="Loader facture reçue"
          missionData={missionData}
          onUploadSuccess={checkAllFiles}
          isFacturation
        />
      ) : (
        <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      )}
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[status === 'cdi' ? 'salary_sheet' : 'invoice_received']
            ?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[status === 'cdi' ? 'salary_sheet' : 'invoice_received']
            ?.exists
            ? 'Reçu'
            : 'Non reçu'}
        </p>
        <p>
          {fileStatuses[status === 'cdi' ? 'salary_sheet' : 'invoice_received']
            ?.exists
            ? formatDate(
                fileStatuses[
                  status === 'cdi' ? 'salary_sheet' : 'invoice_received'
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>

      <Box className="col-span-3 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi' ? 'Paiement salaire' : 'Facture payée'}
      </Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses[status === 'cdi' ? 'salary_payment' : 'invoice_paid']
            ?.exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        <p>
          {fileStatuses[status === 'cdi' ? 'salary_payment' : 'invoice_paid']
            ?.exists
            ? 'Reçu'
            : 'Non reçu'}
        </p>
        <p>
          {fileStatuses[status === 'cdi' ? 'salary_payment' : 'invoice_paid']
            ?.exists
            ? formatDate(
                fileStatuses[
                  status === 'cdi' ? 'salary_payment' : 'invoice_paid'
                ]?.createdAt ?? ''
              )
            : ''}
        </p>
      </Box>
    </>
  );
}
