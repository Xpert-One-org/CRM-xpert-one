import React, { useState, useCallback, useEffect } from 'react';
import { Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import UploadFileDialog from '@/components/dialogs/UploadFileDialog';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';
import { formatDate } from '@/utils/date';
import { checkFileExists } from '@functions/check-file-mission';

export default function FournisseurGestionFacturationRow({
  missionData,
}: {
  missionData: DBMission;
}) {
  const missionXpertStatus = missionData.xpert_associated_status;
  const [fileStatuses, setFileStatuses] = useState<
    Record<string, { exists: boolean; createdAt?: string }>
  >({});

  const checkAllFiles = useCallback(async () => {
    const filesToCheck = ['invoice'];

    const newFileStatuses: Record<
      string,
      { exists: boolean; createdAt?: string }
    > = {};

    for (const fileType of filesToCheck) {
      const result = await checkFileExists(fileType, missionData, true, true);
      newFileStatuses[fileType] = result;
    }

    setFileStatuses(newFileStatuses);
  }, [missionData]);

  useEffect(() => {
    checkAllFiles();
  }, [checkAllFiles]);

  return (
    <>
      <Box className="col-span-2 h-[70px] bg-[#F5F5F5]">Facture</Box>
      <div className="col-span-1 flex w-full gap-2">
        <ViewFileDialog
          type="invoice"
          title="Facture"
          missionData={missionData}
          hasFile={fileStatuses['invoice']?.exists}
          isFacturation
          isFournisseurSide
        />
        <UploadFileDialog
          type="invoice"
          title="Facture"
          missionData={missionData}
          onUploadSuccess={checkAllFiles}
          isFacturation
          isFournisseurSide
        />
      </div>
      <UploadFileDialog
        type="invoice"
        title="Facture"
        missionData={missionData}
        onUploadSuccess={checkAllFiles}
        isFacturation
        isFournisseurSide
        buttonText="Loader facture signée"
      />
      <Box
        className={`col-span-1 flex-col text-white ${
          fileStatuses['invoice']?.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
      >
        <p>{fileStatuses['invoice']?.exists ? 'Envoyé le' : 'À envoyer'}</p>
        <p>
          {fileStatuses['invoice']?.exists
            ? formatDate(fileStatuses['invoice']?.createdAt ?? '')
            : ''}
        </p>
      </Box>

      <Box className="col-span-1 bg-primary text-white">
        {missionData.mission_number}
      </Box>
      <Box className="col-span-2 h-[70px] w-full bg-[#F5F5F5]">Paiement</Box>
      <div className="col-span-1 flex gap-2">
        <ViewFileDialog
          type="invoice_paid"
          title="Fournisseur - Paiement"
          missionData={missionData}
          hasFile={fileStatuses['invoice_paid']?.exists}
          isFacturation
          isFournisseurSide
        />
        <UploadFileDialog
          type="invoice_paid"
          title="Fournisseur - Paiement"
          missionData={missionData}
          disabled
          isFacturation
          isFournisseurSide
        />
      </div>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
      <Box className="size-full bg-[#b1b1b1]">{''}</Box>
    </>
  );
}
