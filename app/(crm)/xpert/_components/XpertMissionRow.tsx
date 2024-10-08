import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { uppercaseFirstLetter } from '@/utils/string';
import React from 'react';

export default function XpertMissionRow({ mission }: { mission: DBMission }) {
  const startDate = formatDate(mission.start_date ?? '');
  const endDate = formatDate(mission.end_date ?? '');

  return (
    <>
      <div className="flex flex-row gap-2">
        <Box className="col-span-1 bg-lightgray-secondary">{startDate}</Box>
        <Box className="col-span-1 bg-lightgray-secondary">{endDate}</Box>
      </div>
      <Box className="col-span-1 bg-lightgray-secondary text-white" primary>
        {mission.mission_number}
      </Box>
      <Box className="col-span-1 bg-lightgray-secondary">
        {uppercaseFirstLetter(mission.job_title ?? '')}
      </Box>
      <Box className="col-span-1 bg-lightgray-secondary">
        {mission.state === 'open'
          ? 'Ouvert'
          : mission.state === 'in_review'
            ? 'En attente de validation'
            : 'Fermée'}
      </Box>
    </>
  );
}
