import React from 'react';
import { Download, Check, X } from 'lucide-react';
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
import { downloadMissionFile } from '@functions/download-file-mission';
import { checkFileExistsForDate } from '../_utils/checkFileExistsForDate';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { getFileTypeByStatusFacturation } from '../_utils/getFileTypeByStatusFacturation';

type XpertGestionFacturationRowProps = {
  status: DBProfileStatus['status'];
  missionData: DBMission;
  selectedYear: number;
  selectedMonth: number;
  onFileUpdate: () => Promise<void>;
  onPendingChange?: (
    type: 'validation' | 'deletion',
    key: string,
    value: boolean
  ) => void;
};

export default function XpertGestionFacturationRow({
  status,
  missionData,
  selectedYear,
  selectedMonth,
  onFileUpdate,
  onPendingChange,
}: Omit<XpertGestionFacturationRowProps, 'fileStatuses'>) {
  const { fileStatusesByMission } = useFileStatusFacturationStore();
  const fileStatuses =
    fileStatusesByMission[missionData.mission_number || ''] || {};

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

  const presenceSheetStatus = checkFileExistsForDate(
    fileStatuses[
      getFileTypeByStatusFacturation(
        'presence_sheet_signed',
        missionData?.xpert_associated_status || ''
      )
    ]?.xpertFiles || [],
    selectedYear,
    selectedMonth
  );

  const presenceSheetValidatedStatus = checkFileExistsForDate(
    fileStatuses[
      getFileTypeByStatusFacturation(
        'presence_sheet_validated',
        missionData?.xpert_associated_status || ''
      )
    ]?.xpertFiles || [],
    selectedYear,
    selectedMonth
  );

  const salaryOrInvoiceStatus = checkFileExistsForDate(
    fileStatuses[
      getFileTypeByStatusFacturation(
        status === 'cdi' ? 'salary_sheet' : 'invoice_received',
        missionData?.xpert_associated_status || ''
      )
    ]?.xpertFiles || [],
    selectedYear,
    selectedMonth
  );

  const handleValidatePresenceSheet = () => {
    if (presenceSheetValidatedStatus.exists) {
      toast.info('La feuille de présence a déjà été validée');
      return;
    }
    const key = `${missionData.mission_number}|${missionData.xpert?.generated_id}|${selectedYear}|${(selectedMonth + 1).toString().padStart(2, '0')}`;
    onPendingChange?.('validation', key, true);
    onPendingChange?.('deletion', key, false);
  };

  const handleDeletePresenceSheet = () => {
    const key = `${missionData.mission_number}|${missionData.xpert?.generated_id}|${selectedYear}|${(selectedMonth + 1).toString().padStart(2, '0')}`;
    onPendingChange?.('deletion', key, true);
    onPendingChange?.('validation', key, false);
  };

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Feuille de présence signée
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatusFacturation(
            'presence_sheet_signed',
            missionData?.xpert_associated_status || ''
          )}
          title="Feuille de présence"
          missionData={missionData}
          hasFile={presenceSheetStatus.exists}
          isFacturation
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
        <Button
          className="size-full text-white"
          onClick={() => handleDownloadFile({ type: 'presence_sheet_signed' })}
          disabled={!presenceSheetStatus.exists}
        >
          {presenceSheetStatus.exists ? (
            <Download className="size-6" />
          ) : (
            <DownloadOff className="size-6" />
          )}
        </Button>
      </div>
      <Button
        className="size-full text-white"
        onClick={() =>
          handleDownloadFile({
            type: 'presence_sheet_signed',
            isTemplate: true,
          })
        }
      >
        Modèle
        <Download className="ml-2 size-6" />
      </Button>
      <UploadFileDialog
        type={getFileTypeByStatusFacturation(
          'presence_sheet_signed',
          missionData?.xpert_associated_status || ''
        )}
        title="Feuille de présence signée"
        buttonText="Loader heure signée"
        missionData={missionData}
        onUploadSuccess={onFileUpdate}
        isFacturation
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          presenceSheetStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
      >
        <p>
          {presenceSheetStatus.exists
            ? presenceSheetValidatedStatus.exists
              ? 'Validé le'
              : 'Reçu le'
            : 'Non reçu'}
        </p>
        <p>
          {presenceSheetStatus.exists
            ? formatDate(presenceSheetStatus.createdAt ?? '')
            : ''}
        </p>
      </Box>
      <div className="col-span-1 flex gap-2">
        <Button
          className="flex size-full w-1/2 bg-[#92C6B0] text-white hover:bg-[#92C6B0]/80"
          onClick={handleValidatePresenceSheet}
          disabled={!presenceSheetStatus.exists}
        >
          <Check className="size-6" />
        </Button>
        <Button
          className="flex size-full w-1/2 bg-[#D64242] text-white hover:bg-[#D64242]/80"
          onClick={handleDeletePresenceSheet}
          disabled={
            !presenceSheetStatus.exists || presenceSheetValidatedStatus.exists
          }
        >
          <X className="size-6" />
        </Button>
      </div>

      <Box className="col-span-2 h-[70px] w-full bg-[#F5F5F5]">
        {status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
      </Box>
      <div className="col-span-1 flex gap-2">
        {status !== 'cdi' ? (
          <ViewFileDialog
            type={getFileTypeByStatusFacturation(
              'invoice_received',
              missionData?.xpert_associated_status || ''
            )}
            title={status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
            missionData={missionData}
            hasFile={salaryOrInvoiceStatus.exists}
            isFacturation
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />
        ) : null}
        {status === 'cdi' ? (
          <UploadFileDialog
            type={getFileTypeByStatusFacturation(
              'salary_sheet',
              missionData?.xpert_associated_status || ''
            )}
            title={status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
            missionData={missionData}
            onUploadSuccess={onFileUpdate}
            isFacturation
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />
        ) : (
          <Button
            className="size-full text-white"
            onClick={() => handleDownloadFile({ type: 'invoice_received' })}
            disabled={!salaryOrInvoiceStatus.exists}
          >
            <Download className="size-6" />
          </Button>
        )}
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      {status !== 'cdi' ? (
        <UploadFileDialog
          type={getFileTypeByStatusFacturation(
            'invoice_received',
            missionData?.xpert_associated_status || ''
          )}
          title={status === 'cdi' ? 'Feuille de salaire' : 'Facture reçue'}
          buttonText="Loader facture reçue"
          missionData={missionData}
          onUploadSuccess={onFileUpdate}
          isFacturation
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      ) : (
        <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      )}
      <Box
        className={`col-span-1 flex-col text-white ${
          salaryOrInvoiceStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
      >
        <p>{salaryOrInvoiceStatus.exists ? 'Reçu le' : 'Non reçu'}</p>
        <p>
          {salaryOrInvoiceStatus.exists
            ? formatDate(salaryOrInvoiceStatus.createdAt ?? '')
            : ''}
        </p>
      </Box>

      <Box className="col-span-3 h-[70px] bg-[#F5F5F5]">
        {status === 'cdi' ? 'Paiement salaire' : 'Facture payée'}
      </Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      {/* TODO: manag logic later with etat facturations  */}
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
    </>
  );
}
