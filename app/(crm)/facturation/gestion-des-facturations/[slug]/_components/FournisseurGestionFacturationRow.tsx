import React from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import UploadFileDialog from '@/components/dialogs/UploadFileDialog';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';
import { formatDate } from '@/utils/date';
import { checkFileExistsForDate } from '../_utils/checkFileExistsForDate';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { getFileTypeByStatusFacturation } from '../_utils/getFileTypeByStatusFacturation';
import { checkPaymentStatusForDate } from '../_utils/checkPaymentStatusForDate';

type FournisseurGestionFacturationRowProps = {
  missionData: DBMission;
  selectedYear: number;
  selectedMonth: number;
  onFileUpdate: () => Promise<void>;
};

export default function FournisseurGestionFacturationRow({
  missionData,
  selectedYear,
  selectedMonth,
  onFileUpdate,
}: Omit<FournisseurGestionFacturationRowProps, 'fileStatuses'>) {
  const { fileStatusesByMission } = useFileStatusFacturationStore();
  const fileStatuses =
    fileStatusesByMission[missionData.mission_number || ''] || {};

  const invoiceStatus = checkFileExistsForDate(
    fileStatuses[
      getFileTypeByStatusFacturation(
        'invoice',
        missionData?.xpert_associated_status || ''
      )
    ]?.fournisseurFiles || [],
    selectedYear,
    selectedMonth
  );

  const paymentStatus = checkPaymentStatusForDate(
    missionData.facturation_fournisseur_payment,
    selectedYear,
    selectedMonth
  );

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Facture</Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type={getFileTypeByStatusFacturation(
            'invoice',
            missionData?.xpert_associated_status || ''
          )}
          title="Facture"
          missionData={missionData}
          hasFile={invoiceStatus.exists}
          isFacturation
          isFournisseurSide
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
        <UploadFileDialog
          type={getFileTypeByStatusFacturation(
            'invoice',
            missionData?.xpert_associated_status || ''
          )}
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
        type={getFileTypeByStatusFacturation(
          'invoice',
          missionData?.xpert_associated_status || ''
        )}
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
      <Box
        className={`size-full ${
          paymentStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        } text-white`}
      >
        {paymentStatus.exists
          ? formatDate(paymentStatus.paymentDate!)
          : 'Non reçu'}
      </Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
    </>
  );
}
