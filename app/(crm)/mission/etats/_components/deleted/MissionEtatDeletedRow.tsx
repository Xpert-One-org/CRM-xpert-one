import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function MissionEtatDeletedRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();
  const createdAt = formatDate(mission.created_at);

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
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() => handleRedirectFournisseur(mission.created_by)}
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
      <Box className="col-span-1">{mission.referent_name}</Box>
      <Box className="col-span-1">{mission.referent_name}</Box>
      <Box className="col-span-2 gap-2 text-white" primary>
        Ceci est un commentaire <EyeIcon />
      </Box>
    </>
  );
}
