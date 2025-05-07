import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import type { NonMatchingCriteria } from './getNonMatchingCriteria';
import { getNonMatchingCriteria } from './getNonMatchingCriteria';

const getTotalCriteriaCount = (
  missionData: DBMission,
  excludedCriteria: Record<string, string[]>,
  additionalCriteria: Record<string, string[]>
): number => {
  let count = 0;

  if (missionData.job_title && !excludedCriteria.job_title?.length) {
    console.log('CRITERE JOB TITLE : ', missionData.job_title);
    count++;
  }
  if (
    missionData.post_type?.length &&
    excludedCriteria.post_type?.length != missionData.post_type.length
  ) {
    const notExcluded = missionData.post_type.filter(
      (type) => !excludedCriteria.post_type?.includes(type)
    );
    notExcluded.forEach((type) => {
      console.log('CRITERE POST TYPE : ', type);
      count++;
    });
  }
  if (missionData.sector && !excludedCriteria.sector?.length) {
    console.log('CRITERE SECTOR : ', missionData.sector);
    count++;
  }
  if (
    missionData.specialties?.length &&
    excludedCriteria.specialties?.length != missionData.specialties.length
  ) {
    const notExcluded = missionData.specialties.filter(
      (specialty) => !excludedCriteria.specialties?.includes(specialty)
    );
    notExcluded.forEach((specialty) => {
      console.log('CRITERE SPECIALTIES : ', specialty);
      count++;
    });
  }
  if (
    missionData.expertises?.length &&
    excludedCriteria.expertises?.length != missionData.expertises.length
  ) {
    const notExcluded = missionData.expertises.filter(
      (expertise) => !excludedCriteria.expertises?.includes(expertise)
    );
    notExcluded.forEach((expertise) => {
      console.log('CRITERE EXPERTISES : ', expertise);
      count++;
    });
  }
  if (
    missionData.diplomas?.length &&
    excludedCriteria.diplomas?.length != missionData.diplomas.length
  ) {
    const notExcluded = missionData.diplomas.filter(
      (diploma) => !excludedCriteria.diplomas?.includes(diploma)
    );
    notExcluded.forEach((diploma) => {
      console.log('CRITERE DIPLOMAS : ', diploma);
      count++;
    });
  }
  if (
    missionData.languages?.length &&
    excludedCriteria.languages?.length != missionData.languages.length
  ) {
    const notExcluded = missionData.languages.filter(
      (language) => !excludedCriteria.languages?.includes(language)
    );
    notExcluded.forEach((language) => {
      console.log('CRITERE LANGUAGES : ', language);
      count++;
    });
  }

  console.log({ additionalCriteria });

  if (additionalCriteria.job_title?.length) {
    console.log(
      'CRITERE JOB TITLE ADDITIONNEL : ',
      additionalCriteria.job_title
    );
    count++;
  }
  if (additionalCriteria.post_type?.length) {
    console.log(
      'CRITERE POST TYPE ADDITIONNEL : ',
      additionalCriteria.post_type
    );
    count++;
  }
  if (additionalCriteria.sector?.length) {
    console.log('CRITERE SECTOR ADDITIONNEL : ', additionalCriteria.sector);
    count++;
  }
  if (additionalCriteria.specialties?.length) {
    console.log(
      'CRITERE SPECIALTIES ADDITIONNEL : ',
      additionalCriteria.specialties
    );
    count++;
  }
  if (additionalCriteria.expertises?.length) {
    console.log(
      'CRITERE EXPERTISES ADDITIONNEL : ',
      additionalCriteria.expertises
    );
    count++;
  }
  if (additionalCriteria.diplomas?.length) {
    console.log('CRITERE DIPLOMAS ADDITIONNEL : ', additionalCriteria.diplomas);
    count++;
  }
  if (additionalCriteria.languages?.length) {
    console.log(
      'CRITERE LANGUAGES ADDITIONNEL : ',
      additionalCriteria.languages
    );
    count++;
  }
  // if (additionalCriteria.availability?.length) {
  //   console.log(
  //     'CRITERE AVAILABILITY ADDITIONNEL : ',
  //     additionalCriteria.availability
  //   );
  //   count++;
  // }
  if (additionalCriteria.management?.length) {
    console.log(
      'CRITERE MANAGEMENT ADDITIONNEL : ',
      additionalCriteria.management
    );
    count++;
  }
  if (additionalCriteria.handicap?.length) {
    console.log('CRITERE HANDICAP ADDITIONNEL : ', additionalCriteria.handicap);
    count++;
  }

  console.log('TOTAL CRITERIA COUNT : ', count);
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
  const nonMatchingCriteria: NonMatchingCriteria = getNonMatchingCriteria({
    xpert,
    excludedCriteria,
    additionalCriteria,
    missionData,
  });

  // Count number of non-matching criteria that have non-empty arrays
  const numberOfNonMatches = Object.values(nonMatchingCriteria).reduce(
    (sum, array) => sum + (array ? array.length : 0),
    0
  );

  // Calculate percentage based on matching criteria
  const matchingPercentage = 100 - numberOfNonMatches * pointsPerCriteria;

  console.log({ matchingPercentage });
  console.log({ totalCriteria });
  console.log({ nonMatchingCriteria });
  console.log({ numberOfNonMatches });
  console.log({ pointsPerCriteria });

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
  if (nonMatchingCriteria.job_title?.length && mission?.job_titles) {
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

  // Country

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
  if (nonMatchingCriteria.specialties?.length && mission?.specialties) {
    const requiredSpecialties = [
      ...(excludedCriteria.specialties ? [] : [missionData.specialties]),
      ...(additionalCriteria.specialties || []),
    ].filter(
      (specialty) =>
        specialty &&
        !excludedCriteria.specialties?.includes(specialty as string)
    );

    const matchingCount = requiredSpecialties.filter((specialty) =>
      mission?.specialties?.includes(specialty as string)
    ).length;

    if (matchingCount > 0) {
      additionalPoints +=
        (matchingCount / requiredSpecialties.length) * (pointsPerCriteria / 2);
    }
  }

  // Expertises
  if (nonMatchingCriteria.expertises?.length && mission?.expertises) {
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
  // if (nonMatchingCriteria.availability?.length && mission?.availability) {
  //   const missionStartDate = new Date(missionData.start_date ?? '');
  //   const xpertAvailability = new Date(mission.availability);

  //   console.log('Is xpert available ? ', xpertAvailability <= missionStartDate);

  //   if (
  //     additionalCriteria.availability?.includes('yes') &&
  //     xpertAvailability <= missionStartDate
  //   ) {
  //     additionalPoints += pointsPerCriteria / 2;
  //   }
  // }

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
  if (nonMatchingCriteria.handicap?.length && mission?.workstation_needed) {
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
  const nonMatchingCriteria = getNonMatchingCriteria({
    xpert,
    missionData,
    excludedCriteria,
    additionalCriteria,
  });

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
