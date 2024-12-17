import React from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import UploadFileDialog from '@/components/dialogs/UploadFileDialog';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';
import { formatDate } from '@/utils/date';
import type { FileStatuses } from '@/types/mission';
import { checkFileExistsForDate } from '../_utils/checkFileExistsForDate';

type FournisseurGestionFacturationRowProps = {
  missionData: DBMission;
  selectedYear: number;
  selectedMonth: number;
  fileStatuses: FileStatuses;
  onFileUpdate: () => Promise<void>;
};

export default function FournisseurGestionFacturationRow({
  missionData,
  selectedYear,
  selectedMonth,
  fileStatuses,
  onFileUpdate,
}: FournisseurGestionFacturationRowProps) {
  const invoiceStatus = checkFileExistsForDate(
    fileStatuses['invoice']?.fournisseurFiles || [],
    selectedYear,
    selectedMonth
  );

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Facture</Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type="invoice"
          title="Facture"
          missionData={missionData}
          hasFile={invoiceStatus.exists}
          isFacturation
          isFournisseurSide
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
        <UploadFileDialog
          type="invoice"
          title="Facture"
          missionData={missionData}
          isFacturation
          isFournisseurSide
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onUploadSuccess={onFileUpdate}
        />
      </div>
      <UploadFileDialog
        type="invoice"
        title="Facture"
        missionData={missionData}
        isFacturation
        isFournisseurSide
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        buttonText="Loader facture signée"
        onUploadSuccess={onFileUpdate}
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          invoiceStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
      >
        <p>{invoiceStatus.exists ? 'Envoyé le' : 'À envoyer'}</p>
        <p>
          {invoiceStatus.exists
            ? formatDate(invoiceStatus.createdAt ?? '')
            : ''}
        </p>
      </Box>

      <Box className="col-span-1 bg-primary text-white">
        {missionData.mission_number}
      </Box>
      <Box className="col-span-3 h-[70px] w-full bg-[#F5F5F5]">Paiement</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
    </>
  );
}
