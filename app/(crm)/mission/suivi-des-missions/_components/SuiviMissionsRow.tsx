import React from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { convertStateValue } from '@/utils/stateMissionConverter';

export default function SuiviMissionsRow({ mission }: { mission: DBMission }) {
  const router = useRouter();

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  return (
    <>
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{''}</Box>
      <Box className="col-span-1">{mission.referent_name}</Box>
    </>
  );
}
