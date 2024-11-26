import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import type { NonMatchingCriteria } from './getNonMatchingCriteria';
import { getNonMatchingCriteria } from './getNonMatchingCriteria';

const TOTAL_CRITERIA = 7; // job_title, post_type, sector, specialties, expertises, diplomas, languages
const POINTS_PER_CRITERIA = 100 / TOTAL_CRITERIA;

export const calculateMatchingPercentage = (
  xpert: DBMatchedXpert,
  missionData: DBMission
): number => {
  // Get non-matching criteria
  const nonMatchingCriteria: NonMatchingCriteria = getNonMatchingCriteria(
    xpert,
    missionData
  );

  // Count number of non-matching criteria that have non-empty arrays
  const numberOfNonMatches = Object.entries(nonMatchingCriteria).filter(
    ([_, value]) => value && value.length > 0
  ).length;

  // Calculate percentage based on matching criteria
  const matchingPercentage = 100 - numberOfNonMatches * POINTS_PER_CRITERIA;

  // Round to 1 decimal place and ensure it's between 0 and 100
  return Math.max(0, Math.min(100, Math.round(matchingPercentage * 10) / 10));
};

export const calculatePartialMatches = (
  xpert: DBMatchedXpert,
  missionData: DBMission,
  nonMatchingCriteria: NonMatchingCriteria
): number => {
  const mission = xpert.profile_mission;
  const expertise = xpert.profile_expertise;
  const experience = xpert.profile_experience;
  let additionalPoints = 0;

  // Only calculate partial matches for criteria that are in nonMatchingCriteria

  if (
    nonMatchingCriteria.job_title &&
    mission.job_titles &&
    missionData.job_title
  ) {
    const matchingJobTitles = mission.job_titles.filter(
      (job) => job === missionData.job_title
    ).length;
    if (matchingJobTitles > 0) {
      additionalPoints += POINTS_PER_CRITERIA / 2; // Partial match gives half points
    }
  }

  if (nonMatchingCriteria.post_type && experience && missionData.post_type) {
    const allPostTypes = experience.flatMap((exp) => exp.post_type || []);
    const matchingPostTypes = allPostTypes.filter((type) =>
      missionData.post_type?.includes(type)
    ).length;

    if (matchingPostTypes > 0) {
      const postTypePercentage =
        (matchingPostTypes / (missionData.post_type.length || 1)) *
        POINTS_PER_CRITERIA;
      additionalPoints += postTypePercentage / 2; // Partial match gives half points
    }
  }

  if (nonMatchingCriteria.sector && experience && missionData.sector) {
    const allSectors = experience.map((exp) => exp.sector).filter(Boolean);
    const matchingSectors = allSectors.filter(
      (sector) => sector === missionData.sector
    ).length;
    if (matchingSectors > 0) {
      additionalPoints += POINTS_PER_CRITERIA / 2;
    }
  }

  if (
    nonMatchingCriteria.specialties &&
    expertise.specialties &&
    missionData.specialties
  ) {
    const matchingSpecialties = expertise.specialties.filter((specialty) =>
      missionData.specialties?.includes(specialty)
    ).length;

    if (matchingSpecialties > 0) {
      const specialtiesMatchPercentage =
        (matchingSpecialties / (missionData.specialties.length || 1)) *
        POINTS_PER_CRITERIA;
      additionalPoints += specialtiesMatchPercentage / 2;
    }
  }

  if (
    nonMatchingCriteria.expertises &&
    expertise.expertises &&
    missionData.expertises
  ) {
    const matchingExpertises = expertise.expertises.filter((exp) =>
      missionData.expertises?.includes(exp)
    ).length;

    if (matchingExpertises > 0) {
      const expertisesMatchPercentage =
        (matchingExpertises / (missionData.expertises.length || 1)) *
        POINTS_PER_CRITERIA;
      additionalPoints += expertisesMatchPercentage / 2;
    }
  }

  if (
    nonMatchingCriteria.diplomas &&
    expertise.diploma &&
    missionData.diplomas
  ) {
    const matchingDiplomas = missionData.diplomas.includes(expertise.diploma)
      ? 1
      : 0;
    if (matchingDiplomas > 0) {
      additionalPoints += POINTS_PER_CRITERIA / 2;
    }
  }

  if (
    nonMatchingCriteria.languages &&
    expertise.maternal_language &&
    missionData.languages
  ) {
    const matchingLanguages = missionData.languages.includes(
      expertise.maternal_language
    )
      ? 1
      : 0;
    if (matchingLanguages > 0) {
      additionalPoints += POINTS_PER_CRITERIA / 2;
    }
  }

  return additionalPoints;
};

export const calculateTotalMatchingScore = (
  xpert: DBMatchedXpert,
  missionData: DBMission
): number => {
  const nonMatchingCriteria = getNonMatchingCriteria(xpert, missionData);
  const baseMatchingScore = calculateMatchingPercentage(xpert, missionData);
  const partialMatchesScore = calculatePartialMatches(
    xpert,
    missionData,
    nonMatchingCriteria
  );

  const totalScore = baseMatchingScore + partialMatchesScore;

  return Math.max(0, Math.min(100, Math.round(totalScore * 10) / 10));
};
