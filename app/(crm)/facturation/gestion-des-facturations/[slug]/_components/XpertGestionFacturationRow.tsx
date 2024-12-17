import React from 'react';
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
import type { DownloadType, FileStatuses } from '@/types/mission';
import { downloadMissionFile } from '@functions/download-file-mission';
import { checkFileExistsForDate } from '../_utils/checkFileExistsForDate';

type XpertGestionFacturationRowProps = {
  status: DBProfileStatus['status'];
  missionData: DBMission;
  selectedYear: number;
  selectedMonth: number;
  fileStatuses: FileStatuses;
  onFileUpdate: () => Promise<void>;
};

export default function XpertGestionFacturationRow({
  status,
  missionData,
  selectedYear,
  selectedMonth,
  fileStatuses,
  onFileUpdate,
}: XpertGestionFacturationRowProps) {
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
    fileStatuses['presence_sheet_signed']?.xpertFiles || [],
    selectedYear,
    selectedMonth
  );

  const salaryOrInvoiceStatus = checkFileExistsForDate(
    fileStatuses[status === 'cdi' ? 'salary_sheet' : 'invoice_received']
      ?.xpertFiles || [],
    selectedYear,
    selectedMonth
  );

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">
        Feuille de présence signée
      </Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type="presence_sheet_signed"
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
        type="presence_sheet_signed"
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
        <p>{presenceSheetStatus.exists ? 'Reçu' : 'Non reçu'}</p>
        <p>
          {presenceSheetStatus.exists
            ? formatDate(presenceSheetStatus.createdAt ?? '')
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
            hasFile={salaryOrInvoiceStatus.exists}
            isFacturation
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />
        ) : null}
        {status === 'cdi' ? (
          <UploadFileDialog
            type="salary_sheet"
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
          type="invoice_received"
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
        <p>{salaryOrInvoiceStatus.exists ? 'Reçu' : 'Non reçu'}</p>
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
      <Box
        className={`col-span-1 flex-col text-white ${
          salaryOrInvoiceStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
      >
        <p>{salaryOrInvoiceStatus.exists ? 'Payé le ' : 'Non effectuée'}</p>
        <p>
          {salaryOrInvoiceStatus.exists
            ? formatDate(salaryOrInvoiceStatus.createdAt ?? '')
            : ''}
        </p>
      </Box>
    </>
  );
}
