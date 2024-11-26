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

  if (!mission || !expertise || !experience || !missionData) {
    return nonMatching;
  }

  if (mission.job_titles && missionData.job_title) {
    if (!mission.job_titles.includes(missionData.job_title)) {
      nonMatching.job_title = [missionData.job_title];
    }
  }

  if (missionData.post_type) {
    const experiencePostTypes = experience.flatMap(
      (exp) => exp.post_type || []
    );

    const nonMatchingPostTypes = missionData.post_type.filter(
      (type) => !experiencePostTypes.includes(type)
    );
    if (nonMatchingPostTypes.length) {
      nonMatching.post_type = nonMatchingPostTypes;
    }
  }

  if (missionData.sector) {
    const hasMatchingSector = experience.some(
      (exp) => exp.sector === missionData.sector
    );
    if (!hasMatchingSector) {
      nonMatching.sector = [missionData.sector];
    }
  }

  if (missionData.specialties) {
    const nonMatchingSpecialties = missionData.specialties.filter(
      (specialty) => !expertise.specialties?.includes(specialty)
    );
    if (nonMatchingSpecialties.length) {
      nonMatching.specialties = nonMatchingSpecialties;
    }
  }

  if (missionData.expertises) {
    const nonMatchingExpertises = missionData.expertises.filter(
      (exp) => !expertise.expertises?.includes(exp)
    );
    if (nonMatchingExpertises.length) {
      nonMatching.expertises = nonMatchingExpertises;
    }
  }

  if (missionData.languages) {
    const nonMatchingLanguages = missionData.languages.filter(
      (language) => !expertise.maternal_language?.includes(language)
    );
    if (nonMatchingLanguages.length) {
      nonMatching.languages = nonMatchingLanguages;
    }
  }

  if (missionData.diplomas) {
    const nonMatchingDiplomas = missionData.diplomas.filter(
      (diploma) => !expertise.diploma?.includes(diploma)
    );
    if (nonMatchingDiplomas.length) {
      nonMatching.diplomas = nonMatchingDiplomas;
    }
  }

  return nonMatching;
};
