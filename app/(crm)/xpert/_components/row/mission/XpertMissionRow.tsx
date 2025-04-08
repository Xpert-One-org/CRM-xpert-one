import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { uppercaseFirstLetter } from '@/utils/string';
import { useRouter } from 'next/navigation';
import React from 'react';
import { getLabel } from '@/utils/getLabel';
import { jobTitleSelect, missionStates } from '@/data/mocked_select';

export default function XpertMissionRow({ mission }: { mission: DBMission }) {
  const startDate = formatDate(mission.start_date ?? '');
  const endDate = formatDate(mission.end_date ?? '');
  const router = useRouter();

  const replaceMissionNumber = (missionNumber: string) => {
    return missionNumber.replace(/ /g, '-');
  };

  const getMissionStateLabel = (state: string) => {
    const stateOption = missionStates.find((option) => option.value === state);
    return stateOption ? stateOption.label : 'État inconnu';
  };

  const getFormattedJobTitle = (jobTitle: string | null) => {
    if (!jobTitle) return '';

    if (mission.job_title_other) {
      return uppercaseFirstLetter(mission.job_title_other);
    }

    return (
      getLabel({ value: jobTitle, select: jobTitleSelect }) ||
      uppercaseFirstLetter(jobTitle)
    );
  };

  return (
    <>
      <div className="flex flex-row gap-2">
        <Box className="col-span-1 bg-lightgray-secondary">{startDate}</Box>
        <Box className="col-span-1 bg-lightgray-secondary">{endDate}</Box>
      </div>
      <Box
        className="col-span-1 cursor-pointer bg-lightgray-secondary text-white"
        primary
        onClick={() =>
          router.push(
            `/mission/fiche/${replaceMissionNumber(mission.mission_number ?? '')}`
          )
        }
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1 bg-lightgray-secondary">
        {getFormattedJobTitle(mission.job_title)}
      </Box>
      <Box className="col-span-1 bg-lightgray-secondary">
        {getMissionStateLabel(mission.state)}
      </Box>
    </>
  );
}
