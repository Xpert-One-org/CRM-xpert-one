import type { DBMission } from '@/types/typesDb';
import { getTimeBeforeMission } from '@/utils/string';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Box } from '@/components/ui/box';
import { empty } from '@/data/constant';
import { cn } from '@/lib/utils';

export default function MissionEtatInProgressRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();

  const createdAt = formatDate(mission.created_at);
  const endDate = formatDate(mission.end_date ?? '');
  const timeBeforeMission = getTimeBeforeMission(mission.start_date ?? '');

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

  const getBackgroundClass = (() => {
    const endDate = new Date(mission.end_date ?? '');
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - endDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 15) {
      return 'bg-accent text-white';
    }
    if (diffDays >= 10) {
      return 'bg-[#D64242] text-white';
    }

    return '';
  })();

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
      <Box className="col-span-1">{timeBeforeMission}</Box>
      <Box
        className={cn('col-span-1 text-white', {
          'cursor-pointer': mission.xpert?.id,
        })}
        primary
        onClick={() => handleRedirectXpert(mission.xpert?.generated_id ?? '')}
      >
        {mission.xpert?.generated_id ?? empty}
      </Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {getBackgroundClass === 'bg-[#D64242] text-white'
          ? 'Non reçu'
          : getBackgroundClass === 'bg-accent text-white'
            ? 'Non reçu'
            : `Reçu le ${endDate}`}
      </Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {getBackgroundClass === 'bg-[#D64242] text-white'
          ? 'Non reçu'
          : getBackgroundClass === 'bg-accent text-white'
            ? 'Non reçu'
            : `Reçu le ${endDate}`}
      </Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {getBackgroundClass === 'bg-[#D64242] text-white'
          ? 'Non reçu'
          : getBackgroundClass === 'bg-accent text-white'
            ? 'Non reçu'
            : `Reçu le ${endDate}`}
      </Box>
    </>
  );
}
