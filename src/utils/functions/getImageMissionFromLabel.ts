import type { DBJobTitles, DBMission } from '@/types/types_db';

export const getImageMissionFromValue = (
  mission: DBMission,
  jobTitleSelect: DBJobTitles[]
) => {
  const image = jobTitleSelect.find(
    (worker) => worker.value === mission.job_title
  )?.image;

  return image;
};
