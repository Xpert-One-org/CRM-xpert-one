import { Box } from '@/components/ui/box';
import { empty } from '@/data/constant';
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

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  return (
    <>
      <Box className="col-span-1">{createdAt}</Box>
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
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{mission.referent_name}</Box>
      <Box className="col-span-1 text-white" primary>
        {mission.xpert?.generated_id ?? empty}
      </Box>
      <Box className="col-span-2">{finishedAt}</Box>
      <Box className="col-span-1 text-white" primary>
        {finishedAt}
      </Box>
    </>
  );
}
