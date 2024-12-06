import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/date';
import { empty } from '@/data/constant';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { convertStateValue } from '@/utils/stateMissionConverter';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';

export default function MissionActivationRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const handleRedirectXpert = (xpertId: string) => {
    router.push(`/xpert?id=${xpertId}`);
  };

  return (
    <>
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{mission.referent_name ?? empty}</Box>
      <Box className="col-span-1">
        {convertStatusXpertValue(mission.xpert?.profile_status?.status ?? '')}
      </Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() =>
          handleRedirectFournisseur(mission.supplier?.generated_id ?? '')
        }
      >
        {mission.supplier?.generated_id}
      </Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() => handleRedirectXpert(mission.xpert?.generated_id ?? '')}
      >
        {mission.xpert?.generated_id ?? empty}
      </Box>
    </>
  );
}
