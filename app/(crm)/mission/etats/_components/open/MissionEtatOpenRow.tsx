import React from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { getTimeBeforeMission } from '@/utils/string';
import { empty } from '@/data/constant';
import { getLabel } from '@/utils/getLabel';
import { useSelect } from '@/store/select';

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

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const { jobTitles } = useSelect();

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
        onClick={() =>
          handleRedirectFicheMission(mission.mission_number ?? empty)
        }
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{mission.referent_name ?? empty}</Box>
      <Box className="col-span-1">{timeBeforeMission}</Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {timeBeforeDeadlineApplication}
      </Box>
      <Box className="col-span-1">
        {getLabel({ value: mission.job_title ?? empty, select: jobTitles }) ??
          empty}
      </Box>
      <Box className="col-span-1">{'0'}</Box>
      <Box className="col-span-1">{'0'}</Box>
      <Box className="col-span-1">{'0'}</Box>
      <Box className="col-span-1">{'0'}</Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box className="col-span-1">{formatDate(mission.end_date ?? '')}</Box>
    </>
  );
}
