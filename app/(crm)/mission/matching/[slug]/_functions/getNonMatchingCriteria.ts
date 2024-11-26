import type { DBMatchedXpert, DBMission } from '@/types/typesDb';

export type NonMatchingCriteria = {
  job_title?: string[];
  post_type?: string[];
  sector?: string[];
  specialties?: string[];
  expertises?: string[];
  diplomas?: string[];
  languages?: string[];
};

export const getNonMatchingCriteria = (
  xpert: DBMatchedXpert,
  missionData: DBMission
): NonMatchingCriteria => {
  const mission = xpert.profile_mission;
  const expertise = xpert.profile_expertise;
  const experience = xpert.profile_experience;
  const nonMatching: NonMatchingCriteria = {};

  if (mission && expertise && experience && missionData) {
    if (!mission.job_titles?.some((job) => missionData.job_title === job)) {
      nonMatching.job_title = mission.job_titles || [];
    }

    if (!experience.some((exp) => exp.sector === missionData.sector)) {
      nonMatching.sector = experience
        .map((exp) => exp.sector || '')
        .filter(Boolean);
    }
    if (!experience.some((exp) => exp.post_type === missionData.post_type)) {
      nonMatching.post_type = experience
        .map((exp) => exp.post_type || '')
        .filter((postType) => postType !== '')
        .flat();
    }
    if (
      !expertise.specialties?.some((specialty) =>
        missionData.specialties?.includes(specialty)
      )
    ) {
      nonMatching.specialties = expertise.specialties || [];
    }

    if (
      !expertise.expertises?.some((expertise) =>
        missionData.expertises?.includes(expertise)
      )
    ) {
      nonMatching.expertises = expertise.expertises || [];
    }

    if (
      !expertise.diploma ||
      !missionData.diplomas?.includes(expertise.diploma)
    ) {
      nonMatching.diplomas = [expertise.diploma || ''];
    }

    if (
      !expertise.maternal_language ||
      !missionData.languages?.includes(expertise.maternal_language)
    ) {
      nonMatching.languages = [expertise.maternal_language || ''];
    }
  }

  return nonMatching;
};
