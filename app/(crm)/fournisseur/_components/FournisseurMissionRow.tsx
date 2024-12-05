import { Box } from '@/components/ui/box';
import { useSelect } from '@/store/select';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function FournisseurMissionRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();
  const startDate = formatDate(mission.start_date ?? '');
  const endDate = formatDate(mission.end_date ?? '');

  const handleMissionNumberClick = () => {
    const missionNumber = mission.mission_number?.replaceAll(' ', '-');
    router.push(`/mission/fiche/${missionNumber}`);
  };

  const { jobTitles, fetchJobTitles } = useSelect();

  useEffect(() => {
    fetchJobTitles();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-2">
        <Box className="col-span-1 w-full bg-lightgray-secondary">
          {startDate}
        </Box>
        <Box className="col-span-1 w-full bg-lightgray-secondary">
          {endDate}
        </Box>
      </div>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        onClick={handleMissionNumberClick}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1 bg-lightgray-secondary">
        {getLabel({ value: mission.job_title ?? '', select: jobTitles })}
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
