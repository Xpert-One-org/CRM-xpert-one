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
  missionData: DBMission,
  excludedCriteria: Record<string, string[]>,
  additionalCriteria: Record<string, string[]>
): NonMatchingCriteria => {
  const mission = xpert.profile_mission;
  const expertise = xpert.profile_expertise;
  const experience = xpert.profile_experience;
  const nonMatching: NonMatchingCriteria = {};

  if (!mission || !expertise || !experience || !missionData) {
    return nonMatching;
  }

  if (mission.job_titles && missionData.job_title) {
    const requiredJobTitles = [
      ...(excludedCriteria?.job_title ? [] : [missionData.job_title]),
      ...(additionalCriteria?.job_title || []),
    ].filter((title) => !excludedCriteria?.job_title?.includes(title));

    const nonMatchingJobTitles = requiredJobTitles.filter(
      (title) => !mission.job_titles?.includes(title)
    );

    if (nonMatchingJobTitles.length) {
      nonMatching.job_title = nonMatchingJobTitles;
    }
  }

  if (missionData.post_type || additionalCriteria?.post_type) {
    const experiencePostTypes = experience.flatMap(
      (exp) => exp.post_type || []
    );
    const requiredPostTypes = [
      ...(excludedCriteria?.post_type ? [] : missionData.post_type || []),
      ...(additionalCriteria?.post_type || []),
    ].filter((type) => !excludedCriteria?.post_type?.includes(type));

    const nonMatchingPostTypes = requiredPostTypes.filter(
      (type) => !experiencePostTypes.includes(type)
    );

    if (nonMatchingPostTypes.length) {
      nonMatching.post_type = nonMatchingPostTypes;
    }
  }

  if (missionData.sector || additionalCriteria.sector) {
    const requiredSectors = [
      ...(excludedCriteria?.sector ? [] : [missionData.sector]),
      ...(additionalCriteria?.sector || []),
    ].filter((sector) => !excludedCriteria?.sector?.includes(sector ?? ''));

    const nonMatchingSectors = requiredSectors.filter(
      (sector) => !experience.some((exp) => exp.sector === sector)
    );

    if (nonMatchingSectors.length) {
      nonMatching.sector = nonMatchingSectors as string[];
    }
  }

  if (missionData.specialties || additionalCriteria.specialties) {
    const requiredSpecialties = [
      ...(excludedCriteria && excludedCriteria.specialties
        ? []
        : missionData.specialties || []),
      ...(additionalCriteria?.specialties || []),
    ].filter(
      (specialty) => !excludedCriteria?.specialties?.includes(specialty)
    );

    const nonMatchingSpecialties = requiredSpecialties.filter(
      (specialty) => !expertise.specialties?.includes(specialty)
    );

    if (nonMatchingSpecialties.length) {
      nonMatching.specialties = nonMatchingSpecialties;
    }
  }

  if (missionData.expertises || additionalCriteria.expertises) {
    const requiredExpertises = [
      ...(excludedCriteria?.expertises ? [] : missionData.expertises || []),
      ...(additionalCriteria?.expertises || []),
    ].filter((exp) => !excludedCriteria?.expertises?.includes(exp));

    const nonMatchingExpertises = requiredExpertises.filter(
      (exp) => !expertise.expertises?.includes(exp)
    );

    if (nonMatchingExpertises.length) {
      nonMatching.expertises = nonMatchingExpertises;
    }
  }

  if (missionData.languages || additionalCriteria.languages) {
    const requiredLanguages = [
      ...(excludedCriteria?.languages ? [] : missionData.languages || []),
      ...(additionalCriteria?.languages || []),
    ].filter((lang) => !excludedCriteria?.languages?.includes(lang));

    const nonMatchingLanguages = requiredLanguages.filter(
      (language) => !expertise.maternal_language?.includes(language)
    );

    if (nonMatchingLanguages.length) {
      nonMatching.languages = nonMatchingLanguages;
    }
  }

  if (missionData.diplomas || additionalCriteria.diplomas) {
    const requiredDiplomas = [
      ...(excludedCriteria?.diplomas ? [] : missionData.diplomas || []),
      ...(additionalCriteria?.diplomas || []),
    ].filter((diploma) => !excludedCriteria?.diplomas?.includes(diploma));

    const nonMatchingDiplomas = requiredDiplomas.filter(
      (diploma) => !expertise.diploma?.includes(diploma)
    );

    if (nonMatchingDiplomas.length) {
      nonMatching.diplomas = nonMatchingDiplomas;
    }
  }

  return nonMatching;
};
