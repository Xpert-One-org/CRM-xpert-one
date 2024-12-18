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
      <Box
        className={`size-full text-white ${
          checkFileStatusForDate(
            fileStatuses,
            selectedMonthYear.year,
            selectedMonthYear.month,
            false,
            getFileTypeByStatusFacturation(
              'presence_sheet_validated',
              missionData?.xpert_associated_status || ''
            )
          ).exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        {checkFileStatusForDate(
          fileStatuses,
          selectedMonthYear.year,
          selectedMonthYear.month,
          false,
          getFileTypeByStatusFacturation(
            'presence_sheet_validated',
            missionData?.xpert_associated_status || ''
          )
        ).exists
          ? formatDate(
              checkFileStatusForDate(
                fileStatuses,
                selectedMonthYear.year,
                selectedMonthYear.month,
                false,
                getFileTypeByStatusFacturation(
                  'presence_sheet_validated',
                  missionData?.xpert_associated_status || ''
                )
              ).createdAt!
            )
          : 'NON'}
      </Box>
      <Box
        className={`size-full text-white ${
          checkFileStatusForDate(
            fileStatuses,
            selectedMonthYear.year,
            selectedMonthYear.month,
            false,
            getFileTypeByStatusFacturation(
              'salary_sheet',
              missionData?.xpert_associated_status || ''
            )
          ).exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        {checkFileStatusForDate(
          fileStatuses,
          selectedMonthYear.year,
          selectedMonthYear.month,
          false,
          getFileTypeByStatusFacturation(
            'salary_sheet',
            missionData?.xpert_associated_status || ''
          )
        ).exists
          ? formatDate(
              checkFileStatusForDate(
                fileStatuses,
                selectedMonthYear.year,
                selectedMonthYear.month,
                false,
                getFileTypeByStatusFacturation(
                  'salary_sheet',
                  missionData?.xpert_associated_status || ''
                )
              ).createdAt!
            )
          : 'NON'}
      </Box>
      <Box
        className={`size-full text-white ${
          checkFileStatusForDate(
            fileStatuses,
            selectedMonthYear.year,
            selectedMonthYear.month,
            true,
            getFileTypeByStatusFacturation(
              'invoice',
              missionData?.xpert_associated_status || ''
            )
          ).exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        {checkFileStatusForDate(
          fileStatuses,
          selectedMonthYear.year,
          selectedMonthYear.month,
          true,
          getFileTypeByStatusFacturation(
            'invoice',
            missionData?.xpert_associated_status || ''
          )
        ).exists
          ? formatDate(
              checkFileStatusForDate(
                fileStatuses,
                selectedMonthYear.year,
                selectedMonthYear.month,
                true,
                getFileTypeByStatusFacturation(
                  'invoice',
                  missionData?.xpert_associated_status || ''
                )
              ).createdAt!
            )
          : 'NON'}
      </Box>
      <Box
        className={`size-full text-white ${
          checkFileStatusForDate(
            fileStatuses,
            selectedMonthYear.year,
            selectedMonthYear.month,
            false,
            getFileTypeByStatusFacturation(
              'salary_sheet',
              missionData?.xpert_associated_status || ''
            )
          ).exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        {checkFileStatusForDate(
          fileStatuses,
          selectedMonthYear.year,
          selectedMonthYear.month,
          false,
          getFileTypeByStatusFacturation(
            'salary_sheet',
            missionData?.xpert_associated_status || ''
          )
        ).exists
          ? formatDate(
              checkFileStatusForDate(
                fileStatuses,
                selectedMonthYear.year,
                selectedMonthYear.month,
                false,
                getFileTypeByStatusFacturation(
                  'salary_sheet',
                  missionData?.xpert_associated_status || ''
                )
              ).createdAt!
            )
          : 'NON'}
      </Box>
      <Box
        className={`size-full text-white ${
          checkFileStatusForDate(
            fileStatuses,
            selectedMonthYear.year,
            selectedMonthYear.month,
            true,
            getFileTypeByStatusFacturation(
              'invoice',
              missionData?.xpert_associated_status || ''
            )
          ).exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        {checkFileStatusForDate(
          fileStatuses,
          selectedMonthYear.year,
          selectedMonthYear.month,
          true,
          getFileTypeByStatusFacturation(
            'invoice',
            missionData?.xpert_associated_status || ''
          )
        ).exists
          ? formatDate(
              checkFileStatusForDate(
                fileStatuses,
                selectedMonthYear.year,
                selectedMonthYear.month,
                true,
                getFileTypeByStatusFacturation(
                  'invoice',
                  missionData?.xpert_associated_status || ''
                )
              ).createdAt!
            )
          : 'NON'}
      </Box>
      <Box
        className={`size-full text-white ${
          checkFileStatusForDate(
            fileStatuses,
            selectedMonthYear.year,
            selectedMonthYear.month,
            true,
            getFileTypeByStatusFacturation(
              'invoice',
              missionData?.xpert_associated_status || ''
            )
          ).exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        {checkFileStatusForDate(
          fileStatuses,
          selectedMonthYear.year,
          selectedMonthYear.month,
          true,
          getFileTypeByStatusFacturation(
            'invoice',
            missionData?.xpert_associated_status || ''
          )
        ).exists
          ? formatDate(
              checkFileStatusForDate(
                fileStatuses,
                selectedMonthYear.year,
                selectedMonthYear.month,
                true,
                getFileTypeByStatusFacturation(
                  'invoice',
                  missionData?.xpert_associated_status || ''
                )
              ).createdAt!
            )
          : 'NON'}
      </Box>
      <Box
        className={`size-full text-white ${
          checkFileStatusForDate(
            fileStatuses,
            selectedMonthYear.year,
            selectedMonthYear.month,
            true,
            getFileTypeByStatusFacturation(
              'invoice',
              missionData?.xpert_associated_status || ''
            )
          ).exists
            ? 'bg-[#92C6B0]'
            : 'bg-[#D64242]'
        }`}
      >
        {checkFileStatusForDate(
          fileStatuses,
          selectedMonthYear.year,
          selectedMonthYear.month,
          true,
          getFileTypeByStatusFacturation(
            'invoice',
            missionData?.xpert_associated_status || ''
          )
        ).exists
          ? formatDate(
              checkFileStatusForDate(
                fileStatuses,
                selectedMonthYear.year,
                selectedMonthYear.month,
                true,
                getFileTypeByStatusFacturation(
                  'invoice',
                  missionData?.xpert_associated_status || ''
                )
              ).createdAt!
            )
          : 'NON REÇU'}
      </Box>
    </>
  );
}
