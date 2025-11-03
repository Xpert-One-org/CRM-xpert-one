import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import UploadFileDialog from '@/components/dialogs/UploadFileDialog';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';
import { formatDate } from '@/utils/date';
import { checkFileExistsForDate } from '../_utils/checkFileExistsForDate';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { getFileTypeByStatusFacturation } from '../_utils/getFileTypeByStatusFacturation';
import { checkPaymentStatusForDate } from '../_utils/checkPaymentStatusForDate';
import { Button } from '@/components/ui/button';
import { Check, Download, Pencil, X } from 'lucide-react';
import type { DownloadType } from '@/types/mission';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { downloadMissionFile } from '@functions/download-file-mission';
import DownloadOff from '@/components/svg/DownloadOff';
import Input from '@/components/inputs/Input';
import { updateOrderMissionNumber } from '@functions/update-order-mission-number';

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
  const [isEditingOrderNumber, setIsEditingOrderNumber] = useState(false);
  const [orderNumber, setOrderNumber] = useState(
    missionData.order_number ?? missionData.mission_number ?? ''
  );
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

  const handleDownloadFile = async ({
    type,
    isTemplate = false,
  }: DownloadType) => {
    const supabase = createSupabaseFrontendClient();
    try {
      const basePath = isTemplate
        ? `modeles_facturation/${type}`
        : `${missionData.mission_number}/${missionData.supplier?.generated_id}/facturation/${selectedYear}/${(
            selectedMonth + 1
          )
            .toString()
            .padStart(
              2,
              '0'
            )}/${getFileTypeByStatusFacturation(type, missionData?.xpert_associated_status || '')}`;

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
      const fileName = isTemplate
        ? `${type}_${missionData?.xpert_associated_status}`
        : mostRecentFile.name;

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

  const handleSaveOrderNumber = async () => {
    if (!missionData.mission_number) {
      toast.error('Numéro de mission manquant');
      return;
    }
    if (!orderNumber) {
      toast.error('Numéro de commande manquant');
      return;
    }
    await updateOrderMissionNumber(missionData.mission_number, orderNumber);
    toast.success('Numéro de commande enregistré');
    setIsEditingOrderNumber(false);
  };

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
        <Button
          className="size-full text-white"
          onClick={() => handleDownloadFile({ type: 'invoice' })}
          disabled={!invoiceStatus.exists}
        >
          {invoiceStatus.exists ? (
            <Download className="size-6" />
          ) : (
            <DownloadOff className="size-6" />
          )}
        </Button>
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
        {isEditingOrderNumber ? (
          <>
            <Input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="text-black"
            />
            <div className="flex">
              <button onClick={handleSaveOrderNumber} className="px-2">
                <Check className="size-4" />
              </button>
              <button
                onClick={() => {
                  setIsEditingOrderNumber(false),
                    setOrderNumber(
                      missionData.order_number ??
                        missionData.mission_number ??
                        ''
                    );
                }}
                className="px-2"
              >
                <X className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            <p>{orderNumber}</p>
            <Button onClick={() => setIsEditingOrderNumber(true)}>
              <Pencil className="size-4" />
            </Button>
          </>
        )}
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
