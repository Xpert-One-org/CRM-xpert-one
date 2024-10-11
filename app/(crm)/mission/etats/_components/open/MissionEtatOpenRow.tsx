import React from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { getTimeBeforeMission, uppercaseFirstLetter } from '@/utils/string';

export default function MissionEtatOpenRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();

  const createdAt = formatDate(mission.created_at);
  const timeBeforeMission = getTimeBeforeMission(mission.start_date ?? '');
  const timeBeforeDeadlineApplication = getTimeBeforeMission(
    mission.deadline_application ?? ''
  );

  const getBackgroundClass = (() => {
    const submissionDate = new Date(mission.deadline_application ?? '');
    const currentDate = new Date();

    const diffTime = Math.abs(currentDate.getTime() - submissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 10) {
      return 'bg-[#D64242] text-white';
    } else if (diffDays >= 30) {
      return 'bg-accent text-white';
    }

    return '';
  })();

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
      <Box className="col-span-1">{timeBeforeMission}</Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {timeBeforeDeadlineApplication}
      </Box>
      <Box className="col-span-1">
        {uppercaseFirstLetter(mission.job_title?.replaceAll('_', ' ') ?? '')}
      </Box>
      <Box className="col-span-1">{'0'}</Box>
      <Box className="col-span-1">{'8'}</Box>
      <Box className="col-span-1">{'12'}</Box>
      <Box className="col-span-1">{'4'}</Box>
    </>
  );
}
