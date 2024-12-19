import { Box } from '@/components/ui/box';
import { useTasksStore } from '@/store/task';
import type { DBMission } from '@/types/typesDb';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { checkFileStatusForDate } from '../_utils/checkFileStatusForDate';
import { formatDate } from '@/utils/date';
import { uppercaseFirstLetter } from '@/utils/string';
import { getFileTypeByStatusFacturation } from '../../gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';

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

  const renderStatusBox = (
    fileType: string,
    isFournisseur: boolean = false
  ) => {
    const fileStatus = checkFileStatusForDate(
      fileStatuses,
      selectedMonthYear.year,
      selectedMonthYear.month,
      isFournisseur,
      getFileTypeByStatusFacturation(
        fileType,
        missionData?.xpert_associated_status || ''
      )
    );

    if (fileStatus.noFilesFound) {
      return (
        <Box className="size-full bg-[#D64242] text-white">{'Non reçu'}</Box>
      );
    }

    return (
      <Box
        className={`size-full text-white ${
          fileStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
      >
        {fileStatus.exists
          ? formatDate(fileStatus.createdAt!)
          : fileStatus.noFilesFound
            ? ''
            : 'NON'}
      </Box>
    );
  };

  const renderInvoiceStatusBox = (
    fileType: string,
    isFournisseur: boolean = false,
    isCdiSide: boolean = false,
    isFreelancePortageSide: boolean = false
  ) => {
    const fileStatus = checkFileStatusForDate(
      fileStatuses,
      selectedMonthYear.year,
      selectedMonthYear.month,
      isFournisseur,
      getFileTypeByStatusFacturation(
        fileType,
        missionData?.xpert_associated_status || ''
      )
    );

    if (isFreelancePortageSide) {
      if (fileStatus.noFilesFound) {
        if (missionData.xpert_associated_status === 'cdi') {
          return <Box className="size-full bg-[#b1b1b1]">{''}</Box>;
        } else {
          return (
            <Box className="size-full bg-[#D64242] text-white">
              {'Non reçu'}
            </Box>
          );
        }
      }
    }

    if (isCdiSide) {
      if (fileStatus.noFilesFound) {
        if (missionData.xpert_associated_status !== 'cdi') {
          return <Box className="size-full bg-[#b1b1b1]">{''}</Box>;
        } else {
          return (
            <Box className="size-full bg-[#D64242] text-white">
              {'Non reçu'}
            </Box>
          );
        }
      }
    }

    return (
      <Box
        className={`size-full text-white ${
          fileStatus.exists ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        }`}
      >
        {fileStatus.exists
          ? formatDate(fileStatus.createdAt!)
          : fileStatus.noFilesFound
            ? ''
            : 'NON'}
      </Box>
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
      {renderStatusBox('presence_sheet_validated')}
      {renderInvoiceStatusBox(
        missionStatus === 'cdi' ? 'salary_sheet' : '',
        false,
        true,
        false
      )}
      {renderInvoiceStatusBox(
        missionStatus === 'cdi' ? 'salary_sheet' : '',
        false,
        true,
        false
      )}
      {renderInvoiceStatusBox(
        missionStatus !== 'cdi' ? 'salary_sheet' : '',
        false,
        false,
        true
      )}
      {renderInvoiceStatusBox(
        missionStatus !== 'cdi' ? 'salary_sheet' : '',
        false,
        false,
        true
      )}
      {renderStatusBox('invoice', true)}
      {renderStatusBox('', true)}
    </>
  );
}
