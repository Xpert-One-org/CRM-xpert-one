import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import type { NonMatchingCriteria } from './getNonMatchingCriteria';
import { getNonMatchingCriteria } from './getNonMatchingCriteria';

const getTotalCriteriaCount = (
  missionData: DBMission,
  excludedCriteria: Record<string, string[]>,
  additionalCriteria: Record<string, string[]>
): number => {
  let count = 0;

  if (missionData.job_title && !excludedCriteria.job_title?.length) count++;
  if (missionData.post_type?.length && !excludedCriteria.post_type?.length)
    count++;
  if (missionData.sector && !excludedCriteria.sector?.length) count++;
  if (missionData.specialties?.length && !excludedCriteria.specialties?.length)
    count++;
  if (missionData.expertises?.length && !excludedCriteria.expertises?.length)
    count++;
  if (missionData.diplomas?.length && !excludedCriteria.diplomas?.length)
    count++;
  if (missionData.languages?.length && !excludedCriteria.languages?.length)
    count++;

  if (additionalCriteria.job_title?.length) count++;
  if (additionalCriteria.post_type?.length) count++;
  if (additionalCriteria.sector?.length) count++;
  if (additionalCriteria.specialties?.length) count++;
  if (additionalCriteria.expertises?.length) count++;
  if (additionalCriteria.diplomas?.length) count++;
  if (additionalCriteria.languages?.length) count++;
  if (additionalCriteria.availability?.length) count++;
  if (additionalCriteria.management?.length) count++;
  if (additionalCriteria.handicap?.length) count++;

  return Math.max(1, count); // Ensure we don't divide by zero
};

export const calculateMatchingPercentage = (
  xpert: DBMatchedXpert,
  missionData: DBMission,
  excludedCriteria: Record<string, string[]>,
  additionalCriteria: Record<string, string[]>
): number => {
  // Get total number of active criteria
  const totalCriteria = getTotalCriteriaCount(
    missionData,
    excludedCriteria,
    additionalCriteria
  );
  const pointsPerCriteria = 100 / totalCriteria;

  // Get non-matching criteria
  const nonMatchingCriteria: NonMatchingCriteria = getNonMatchingCriteria(
    xpert,
    missionData,
    excludedCriteria,
    additionalCriteria
  );

  // Count number of non-matching criteria that have non-empty arrays
  const numberOfNonMatches = Object.entries(nonMatchingCriteria).filter(
    ([_, value]) => value && value.length > 0
  ).length;

  // Calculate percentage based on matching criteria
  const matchingPercentage = 100 - numberOfNonMatches * pointsPerCriteria;

  // Round to 1 decimal place and ensure it's between 0 and 100
  return Math.max(0, Math.min(100, Math.round(matchingPercentage * 10) / 10));
};

export const calculatePartialMatches = (
  xpert: DBMatchedXpert,
  missionData: DBMission,
  excludedCriteria: Record<string, string[]>,
  additionalCriteria: Record<string, string[]>,
  nonMatchingCriteria: NonMatchingCriteria
): number => {
  const mission = xpert.profile_mission;
  const expertise = xpert.profile_expertise;
  const experience = xpert.profile_experience;
  const totalCriteria = getTotalCriteriaCount(
    missionData,
    excludedCriteria,
    additionalCriteria
  );
  const pointsPerCriteria = 100 / totalCriteria;
  let additionalPoints = 0;

  // Job Title
  if (nonMatchingCriteria.job_title?.length && mission.job_titles) {
    const requiredTitles = [
      ...(excludedCriteria.job_title ? [] : [missionData.job_title]),
      ...(additionalCriteria.job_title || []),
    ].filter((title) => title && !excludedCriteria.job_title?.includes(title));

    const matchingCount = requiredTitles.filter((title) =>
      mission.job_titles?.includes(title || '')
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredTitles.length) * (pointsPerCriteria / 2);
    }
  }

  // Post Type
  if (nonMatchingCriteria.post_type?.length && experience) {
    const experiencePostTypes = experience.flatMap(
      (exp) => exp.post_type || []
    );
    const requiredTypes = [
      ...(excludedCriteria.post_type ? [] : missionData.post_type || []),
      ...(additionalCriteria.post_type || []),
    ].filter((type) => !excludedCriteria.post_type?.includes(type));

    const matchingCount = requiredTypes.filter((type) =>
      experiencePostTypes.includes(type)
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredTypes.length) * (pointsPerCriteria / 2);
    }
  }

  // Sector
  if (nonMatchingCriteria.sector?.length && experience) {
    const requiredSectors = [
      ...(excludedCriteria.sector ? [] : [missionData.sector]),
      ...(additionalCriteria.sector || []),
    ].filter((sector) => sector && !excludedCriteria.sector?.includes(sector));

    const matchingCount = requiredSectors.filter((sector) =>
      experience.some((exp) => exp.sector === sector)
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredSectors.length) * (pointsPerCriteria / 2);
    }
  }

  // Specialties
  if (nonMatchingCriteria.specialties?.length && mission.specialties) {
    const requiredSpecialties = [
      ...(excludedCriteria.specialties ? [] : [missionData.specialties]),
      ...(additionalCriteria.specialties || []),
    ].filter(
      (specialty) =>
        specialty &&
        !excludedCriteria.specialties?.includes(specialty as string)
    );

    const matchingCount = requiredSpecialties.filter((specialty) =>
      mission.specialties?.includes(specialty as string)
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredSpecialties.length) * (pointsPerCriteria / 2);
    }
  }

  // Expertises
  if (nonMatchingCriteria.expertises?.length && mission.expertises) {
    const requiredExpertises = [
      ...(excludedCriteria.expertises ? [] : [missionData.expertises]),
      ...(additionalCriteria.expertises || []),
    ].filter(
      (expertise) =>
        expertise && !excludedCriteria.expertises?.includes(expertise as string)
    );

    const matchingCount = requiredExpertises.filter((expertise) =>
      mission.expertises?.includes(expertise as string)
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredExpertises.length) * (pointsPerCriteria / 2);
    }
  }

  // Diplomas
  if (nonMatchingCriteria.diplomas?.length && expertise?.diploma) {
    const requiredDiplomas = [
      ...(excludedCriteria.diplomas ? [] : [missionData.diplomas]),
      ...(additionalCriteria.diplomas || []),
    ].filter(
      (diploma) =>
        diploma && !excludedCriteria.diplomas?.includes(diploma as string)
    );

    const matchingCount = requiredDiplomas.filter((diploma) =>
      expertise.diploma?.includes(diploma as string)
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredDiplomas.length) * (pointsPerCriteria / 2);
    }
  }

  // Languages
  if (nonMatchingCriteria.languages?.length && expertise?.maternal_language) {
    const requiredLanguages = [
      ...(excludedCriteria.languages ? [] : [missionData.languages]),
      ...(additionalCriteria.languages || []),
    ].filter(
      (language) =>
        language && !excludedCriteria.languages?.includes(language as string)
    );

    const matchingCount = requiredLanguages.filter((language) =>
      expertise.maternal_language?.includes(language as string)
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredLanguages.length) * (pointsPerCriteria / 2);
    }
  }

  // Availability
  if (nonMatchingCriteria.availability?.length && mission.availability) {
    const missionStartDate = new Date(missionData.start_date ?? '');
    const xpertAvailability = new Date(mission.availability);

    if (
      additionalCriteria.availability?.includes('yes') &&
      xpertAvailability <= missionStartDate
    ) {
      additionalPoints += pointsPerCriteria / 2;
    }
  }

  // Management
  if (nonMatchingCriteria.management?.length && experience) {
    const hasLedTeam = experience.some((exp) => exp.has_led_team === 'true');

    if (
      (additionalCriteria.management?.includes('yes') && hasLedTeam) ||
      (additionalCriteria.management?.includes('no') && !hasLedTeam)
    ) {
      additionalPoints += pointsPerCriteria / 2;
    }
  }

  // Handicap
  if (nonMatchingCriteria.handicap?.length && mission.workstation_needed) {
    const needsWorkstation = mission.workstation_needed === 'true';

    if (
      (additionalCriteria.handicap?.includes('yes') && needsWorkstation) ||
      (additionalCriteria.handicap?.includes('no') && !needsWorkstation)
    ) {
      additionalPoints += pointsPerCriteria / 2;
    }
  }

  return additionalPoints;
};

export const calculateTotalMatchingScore = (
  xpert: DBMatchedXpert,
  missionData: DBMission,
  excludedCriteria: Record<string, string[]>,
  additionalCriteria: Record<string, string[]>
): number => {
  const nonMatchingCriteria = getNonMatchingCriteria(
    xpert,
    missionData,
    excludedCriteria,
    additionalCriteria
  );

  const baseMatchingScore = calculateMatchingPercentage(
    xpert,
    missionData,
    excludedCriteria,
    additionalCriteria
  );

  const partialMatchesScore = calculatePartialMatches(
    xpert,
    missionData,
    excludedCriteria,
    additionalCriteria,
    nonMatchingCriteria
  );

  const totalScore = baseMatchingScore + partialMatchesScore;

  return Math.max(0, Math.min(100, Math.round(totalScore * 10) / 10));
};
