import { Box } from '@/components/ui/box';
import { reasonDeleteMissionSelect } from '@/data/mocked_select';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { formatDateHour } from '@/utils/formatDates';
import { getLabel } from '@/utils/getLabel';
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
      <Box className="col-span-1">{`${mission.referent?.firstname ?? ''} ${mission.referent?.lastname ?? ''}`}</Box>
      <Box className="col-span-1">
        {mission.deleted_at ? formatDateHour(mission.deleted_at) : ''}
      </Box>
      <Box className="col-span-1">
        {getLabel({
          value: mission.reason_deletion ?? '',
          select: reasonDeleteMissionSelect,
        })}
      </Box>
      <Box className="col-span-2 gap-2">
        {mission.detail_deletion}
        <></>
      </Box>
    </>
  );
}
