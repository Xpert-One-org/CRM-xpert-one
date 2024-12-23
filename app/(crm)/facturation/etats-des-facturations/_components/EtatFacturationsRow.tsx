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
import type { PaymentStatus } from '@/types/mission';

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
    isNull: boolean
  ) => void;
}) {
  const router = useRouter();
  const { setCreateTaskDialogOpen, setInitialTaskData } = useTasksStore();
  const { fileStatusesByMission } = useFileStatusFacturationStore();
  const missionStatus = missionData.xpert_associated_status;

  const fileStatuses =
    fileStatusesByMission[missionData.mission_number || ''] || {};

  const isPaymentSelected = useMemo(() => {
    const payments = Array.isArray(missionData.facturation_fournisseur_payment)
      ? (missionData.facturation_fournisseur_payment as PaymentStatus[])
      : [];
    const key = `${selectedMonthYear.year}-${(selectedMonthYear.month + 1)
      .toString()
      .padStart(2, '0')}`;
    return payments.some((payment) => payment.period === key);
  }, [missionData.facturation_fournisseur_payment, selectedMonthYear]);

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectTaskReferent = () => {
    setInitialTaskData({
      subjectType: 'supplier',
      subjectId: missionData.created_by,
    });
    setCreateTaskDialogOpen(true);
    router.push('/dashboard/todo');
  };

  const handleSalaryPaymentClick = (isNull: boolean) => {
    onSalaryPaymentChange?.(
      missionData,
      selectedMonthYear,
      !isPaymentSelected,
      isNull
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
        {missionData.mission_number}
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
        {missionData.referent_name}
      </Box>
      <StatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType="presence_sheet_validated"
        xpertAssociatedStatus={missionStatus || ''}
      />
      <SalaryPaymentBox
        selectedMonthYear={selectedMonthYear}
        xpertAssociatedStatus={missionStatus || ''}
      />
      <XpertStatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType={missionStatus === 'cdi' ? 'salary_sheet' : ''}
        xpertAssociatedStatus={missionStatus || ''}
      />
      <XpertStatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType={missionStatus !== 'cdi' ? 'salary_sheet' : ''}
        isFreelancePortageSide
        xpertAssociatedStatus={missionStatus || ''}
      />
      <XpertStatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType={missionStatus !== 'cdi' ? 'salary_sheet' : ''}
        isFreelancePortageSide
        xpertAssociatedStatus={missionStatus || ''}
      />
      <StatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType="invoice"
        isFournisseur
        xpertAssociatedStatus={missionStatus || ''}
      />
      <StatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType=""
        isFournisseur
        xpertAssociatedStatus={missionStatus || ''}
        isSalaryPayment
        onSalaryPaymentClick={handleSalaryPaymentClick}
        isSelected={isPaymentSelected}
      />
    </>
  );
}
