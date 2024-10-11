import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function MissionEtatFinishedRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();

  const createdAt = formatDate(mission.created_at);
  const finishedAt = formatDate(mission.end_date ?? '');

  const handleNumberClick = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  return (
    <>
      <Box className="col-span-1">{createdAt}</Box>
      <Box className="col-span-1 cursor-pointer bg-primary text-white" primary>
        {mission.created_by}
      </Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() => handleNumberClick(mission.mission_number ?? '')}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{mission.referent_name}</Box>
      <Box className="col-span-1 text-white" primary>
        {mission.created_by}
      </Box>
      <Box className="col-span-2">{finishedAt}</Box>
      <Box className="col-span-1 text-white" primary>
        {finishedAt}
      </Box>
    </>
  );
}
