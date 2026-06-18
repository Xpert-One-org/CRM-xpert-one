import { Box } from '@/components/ui/box';
import { useTasksStore } from '@/store/task';
import type { DBMission } from '@/types/typesDb';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { uppercaseFirstLetter } from '@/utils/string';
import StatusBox from './_boxes/StatusBox';
import XpertStatusBox from './_boxes/XpertStatusBox';
import SalaryPaymentBox from './_boxes/SalaryPaymentBox';
import type { PaymentStatus, PaymentType } from '@/types/mission';
import ViewFileDialog from '@/components/dialogs/ViewFileDialog';
import { getFileTypeByStatusFacturation } from '../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';
import { checkFileStatusForDate } from '../_utils/checkFileStatusForDate';

export default function EtatFacturationsRow({
  missionData,
  selectedMonthYear,
  onSalaryPaymentChange,
}: {
  missionData: DBMission;
  selectedMonthYear: { month: number; year: number };
  onSalaryPaymentChange?: (
    mission: DBMission,
    monthYear: { month: number; year: number },
    isSelected: boolean,
    isNull: boolean,
    paymentType: PaymentType,
    customDate?: string
  ) => void;
}) {
  const router = useRouter();
  const { setCreateTaskDialogOpen, setInitialTaskData } = useTasksStore();
  const { fileStatusesByMission, checkAllFiles } =
    useFileStatusFacturationStore();
  const missionStatus = missionData.xpert_associated_status;

  const fileStatuses =
    fileStatusesByMission[missionData.mission_number || ''] || {};

  // Suppression de fichier depuis la page d'aperçu (bulletin de salaire / facture)
  const salaryType = getFileTypeByStatusFacturation(
    'salary_sheet',
    missionStatus || ''
  );
  const factureType = getFileTypeByStatusFacturation(
    'invoice',
    missionStatus || ''
  );
  const salaryFileExists = checkFileStatusForDate(
    fileStatuses,
    selectedMonthYear.year,
    selectedMonthYear.month,
    false,
    salaryType
  ).exists;
  const factureFileExists = checkFileStatusForDate(
    fileStatuses,
    selectedMonthYear.year,
    selectedMonthYear.month,
    true,
    factureType
  ).exists;
  const refreshFiles = () => checkAllFiles(missionData);

  const isPaymentSelected = useMemo(() => {
    const payments = Array.isArray(missionData.facturation_fournisseur_payment)
      ? (missionData.facturation_fournisseur_payment as PaymentStatus[])
      : [];
    const key = `${selectedMonthYear.year}-${(selectedMonthYear.month + 1)
      .toString()
      .padStart(2, '0')}`;
    return payments.some((payment) => payment.period === key);
  }, [missionData.facturation_fournisseur_payment, selectedMonthYear]);

  const isSalaryPaymentSelected = useMemo(() => {
    const payments = Array.isArray(missionData.facturation_salary_payment)
      ? (missionData.facturation_salary_payment as PaymentStatus[])
      : [];
    const key = `${selectedMonthYear.year}-${(selectedMonthYear.month + 1)
      .toString()
      .padStart(2, '0')}`;
    return payments.some((payment) => payment.period === key);
  }, [missionData.facturation_salary_payment, selectedMonthYear]);

  const invoicePaidPayment = useMemo(() => {
    const payments = Array.isArray(missionData.facturation_invoice_paid)
      ? (missionData.facturation_invoice_paid as PaymentStatus[])
      : [];
    const key = `${selectedMonthYear.year}-${(selectedMonthYear.month + 1)
      .toString()
      .padStart(2, '0')}`;
    return payments.find((payment) => payment.period === key);
  }, [missionData.facturation_invoice_paid, selectedMonthYear]);

  const isInvoicePaidSelected = !!invoicePaidPayment;

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectTaskReferent = () => {
    setInitialTaskData({
      referentId: missionData.referent?.id,
      subjectType: 'supplier',
      subjectId: missionData.created_by,
    });
    setCreateTaskDialogOpen(true);
    router.push('/dashboard/todo');
  };

  const handleSalaryPaymentClick = (
    isNull: boolean,
    paymentType: PaymentType,
    payload?: { payment_date?: string; period?: string }
  ) => {
    const isCurrentlySelected = payload?.payment_date
      ? false // Force selection true if we are providing a date
      : paymentType === 'facturation_salary_payment'
        ? isSalaryPaymentSelected
        : isPaymentSelected;

    onSalaryPaymentChange?.(
      missionData,
      selectedMonthYear,
      !isCurrentlySelected,
      isNull,
      paymentType,
      payload?.payment_date
    );
  };

  const handleInvoicePaidClick = (
    isNull: boolean,
    paymentType: PaymentType
  ) => {
    const isCurrentlySelected =
      paymentType === 'facturation_invoice_paid'
        ? isInvoicePaidSelected
        : isPaymentSelected;

    onSalaryPaymentChange?.(
      missionData,
      selectedMonthYear,
      !isCurrentlySelected,
      isNull,
      paymentType
    );
  };

  return (
    <>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() =>
          handleRedirectFicheMission(missionData.mission_number ?? '')
        }
      >
        {missionData.mission_number} - {missionData.xpert?.firstname}{' '}
        {missionData.xpert?.lastname}
      </Box>
      <Box className="size-full flex-col">
        <p>{`${uppercaseFirstLetter(
          new Date(
            selectedMonthYear.year,
            selectedMonthYear.month
          ).toLocaleString('fr-FR', {
            month: 'long',
          })
        )}`}</p>
        <p>{`${uppercaseFirstLetter(
          new Date(
            selectedMonthYear.year,
            selectedMonthYear.month
          ).toLocaleString('fr-FR', {
            year: 'numeric',
          })
        )}`}</p>
      </Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={handleRedirectTaskReferent}
      >
        {`${missionData.referent?.firstname ?? ''} ${missionData.referent?.lastname ?? ''}`}
      </Box>
      {/* Feuille de présence validée */}
      <StatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType="presence_sheet_validated"
        xpertAssociatedStatus={missionStatus || ''}
      />
      {/* Paiement de salaire */}
      <SalaryPaymentBox
        selectedMonthYear={selectedMonthYear}
        xpertAssociatedStatus={missionStatus || ''}
        onSalaryPaymentClick={handleSalaryPaymentClick}
        isSelected={isSalaryPaymentSelected}
      />
      {/* Bulletin de salaire */}
      {missionStatus === 'cdi' ? (
        <div className="relative col-span-1">
          <XpertStatusBox
            fileStatuses={fileStatuses}
            selectedMonthYear={selectedMonthYear}
            fileType="salary_sheet"
            xpertAssociatedStatus={missionStatus || ''}
          />
          {salaryFileExists && (
            <div className="absolute right-0.5 top-0.5 z-10 size-6">
              <ViewFileDialog
                type={salaryType}
                title="Bulletin de salaire"
                missionData={missionData}
                hasFile={salaryFileExists}
                isFacturation
                selectedYear={selectedMonthYear.year}
                selectedMonth={selectedMonthYear.month}
                onDeleteSuccess={refreshFiles}
              />
            </div>
          )}
        </div>
      ) : (
        <XpertStatusBox
          fileStatuses={fileStatuses}
          selectedMonthYear={selectedMonthYear}
          fileType=""
          xpertAssociatedStatus={missionStatus || ''}
        />
      )}
      {/* Facture validée */}
      <XpertStatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType={missionStatus !== 'cdi' ? 'invoice_validated' : ''}
        isFreelancePortageSide
        xpertAssociatedStatus={missionStatus || ''}
      />
      {/* Facture payée */}
      <XpertStatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType={missionStatus === 'cdi' ? 'salary_sheet' : 'invoice_paid'}
        isFreelancePortageSide
        xpertAssociatedStatus={missionStatus || ''}
        onInvoicePaidClick={handleInvoicePaidClick}
        isSelected={isInvoicePaidSelected}
        paymentDate={invoicePaidPayment?.payment_date}
      />
      {/* Facture */}
      <div className="relative col-span-1">
        <StatusBox
          fileStatuses={fileStatuses}
          selectedMonthYear={selectedMonthYear}
          fileType="invoice"
          isFournisseur
          xpertAssociatedStatus={missionStatus || ''}
        />
        {factureFileExists && (
          <div className="absolute right-0.5 top-0.5 z-10 size-6">
            <ViewFileDialog
              type={factureType}
              title="Facture fournisseur"
              missionData={missionData}
              hasFile={factureFileExists}
              isFournisseurSide
              isFacturation
              selectedYear={selectedMonthYear.year}
              selectedMonth={selectedMonthYear.month}
              onDeleteSuccess={refreshFiles}
            />
          </div>
        )}
      </div>
      {/* Paiement */}
      <StatusBox
        fileStatuses={fileStatuses}
        mission_fournisseur_payment_date={
          missionData.facturation_fournisseur_payment as PaymentStatus[]
        }
        selectedMonthYear={selectedMonthYear}
        missionNumber={missionData.mission_number ?? ''}
        fileType="invoice_paid"
        isFournisseur
        xpertAssociatedStatus={missionStatus || ''}
        isSalaryPayment
        onSalaryPaymentClick={handleSalaryPaymentClick}
      />
    </>
  );
}
