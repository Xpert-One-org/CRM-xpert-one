import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { uppercaseFirstLetter } from '@/utils/string';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function XpertMissionRow({ mission }: { mission: DBMission }) {
  const startDate = formatDate(mission.start_date ?? '');
  const endDate = formatDate(mission.end_date ?? '');
  const router = useRouter();

  const replaceMissionNumber = (missionNumber: string) => {
    return missionNumber.replace(/ /g, '-');
  };
  return (
    <>
      <div className="flex flex-row gap-2">
        <Box className="col-span-1 bg-lightgray-secondary">{startDate}</Box>
        <Box className="col-span-1 bg-lightgray-secondary">{endDate}</Box>
      </div>
      <Box
        className="col-span-1 cursor-pointer bg-lightgray-secondary text-white"
        primary
        onClick={() =>
          router.push(
            `/mission/fiche/${replaceMissionNumber(mission.mission_number ?? '')}`
          )
        }
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1 bg-lightgray-secondary">
        {uppercaseFirstLetter(mission.job_title ?? '')}
      </Box>
      <Box className="col-span-1 bg-lightgray-secondary">
        {mission.state === 'open'
          ? 'Ouvert'
          : mission.state === 'in_progress'
            ? 'En attente de validation'
            : 'Fermée'}
      </Box>
    </>
  );
}
