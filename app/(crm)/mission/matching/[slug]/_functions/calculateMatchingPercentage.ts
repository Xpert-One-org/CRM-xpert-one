import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import type { NonMatchingCriteria } from './getNonMatchingCriteria';
import { getNonMatchingCriteria } from './getNonMatchingCriteria';

export const calculateMatchingPercentage = (
  xpert: DBMatchedXpert,
  missionData: DBMission
): number => {
  //! job_title, post_type, sector, specialties, expertises, diplomas, languages for the mission
  const TOTAL_CRITERIA = 7;
  const POINTS_PER_CRITERIA = 100 / TOTAL_CRITERIA;

  // Get non-matching criteria
  const nonMatchingCriteria: NonMatchingCriteria = getNonMatchingCriteria(
    xpert,
    missionData
  );

  // Count number of non-matching criteria
  const numberOfNonMatches = Object.keys(nonMatchingCriteria).length;

  // Calculate percentage based on matching criteria
  const matchingPercentage = 100 - numberOfNonMatches * POINTS_PER_CRITERIA;

  // Round to 1 decimal place and ensure it's between 0 and 100
  return Math.max(0, Math.min(100, Math.round(matchingPercentage * 10) / 10));
};

// Example of partial matches calculation for specialties and expertises
export const calculatePartialMatches = (
  xpert: DBMatchedXpert,
  missionData: DBMission
): number => {
  const expertise = xpert.profile_expertise;
  let additionalPoints = 0;

  if (expertise && missionData.specialties && expertise.specialties) {
    // Calculate percentage of matching specialties
    const matchingSpecialties = expertise.specialties.filter((specialty) =>
      missionData.specialties?.includes(specialty)
    ).length;

    if (matchingSpecialties > 0) {
      const specialtiesMatchPercentage =
        (matchingSpecialties / missionData.specialties.length) * (100 / 7);
      additionalPoints += specialtiesMatchPercentage;
    }
  }

  if (expertise && missionData.expertises && expertise.expertises) {
    // Calculate percentage of matching expertises
    const matchingExpertises = expertise.expertises.filter((exp) =>
      missionData.expertises?.includes(exp)
    ).length;

    if (matchingExpertises > 0) {
      const expertisesMatchPercentage =
        (matchingExpertises / missionData.expertises.length) * (100 / 7);
      additionalPoints += expertisesMatchPercentage;
    }
  }

  return additionalPoints;
};

// Combined calculation with partial matches
export const calculateTotalMatchingScore = (
  xpert: DBMatchedXpert,
  missionData: DBMission
): number => {
  const baseMatchingScore = calculateMatchingPercentage(xpert, missionData);
  const partialMatchesScore = calculatePartialMatches(xpert, missionData);

  // Combine scores and ensure the total doesn't exceed 100%
  const totalScore = Math.min(100, baseMatchingScore + partialMatchesScore);

  return Math.round(totalScore * 10) / 10;
};
