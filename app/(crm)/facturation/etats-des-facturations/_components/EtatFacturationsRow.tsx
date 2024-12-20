import { Box } from '@/components/ui/box';
import { useTasksStore } from '@/store/task';
import type { DBMission } from '@/types/typesDb';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { uppercaseFirstLetter } from '@/utils/string';
import StatusBox from './_boxes/StatusBox';
import XpertStatusBox from './_boxes/XpertStatusBox';
import SalaryPaymentBox from './_boxes/SalaryPaymentBox';

export default function EtatFacturationsRow({
  missionData,
  selectedMonthYear,
}: {
  missionData: DBMission;
  selectedMonthYear: { month: number; year: number };
}) {
  const router = useRouter();
  const { setCreateTaskDialogOpen, setInitialTaskData } = useTasksStore();
  const { fileStatusesByMission } = useFileStatusFacturationStore();
  const missionStatus = missionData.xpert_associated_status;

  const fileStatuses =
    fileStatusesByMission[missionData.mission_number || ''] || {};

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
      <SalaryPaymentBox selectedMonthYear={selectedMonthYear} />
      <XpertStatusBox
        fileStatuses={fileStatuses}
        selectedMonthYear={selectedMonthYear}
        fileType={missionStatus === 'cdi' ? 'salary_sheet' : ''}
        isCdiSide
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
      />
    </>
  );
}
