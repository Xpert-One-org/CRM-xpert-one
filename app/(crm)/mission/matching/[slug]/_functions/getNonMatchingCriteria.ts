import type { DBMatchedXpert, DBMission } from '@/types/typesDb';

export type NonMatchingCriteria = {
  job_title?: string[];
  post_type?: string[];
  sector?: string[];
  specialties?: string[];
  expertises?: string[];
  diplomas?: string[];
  languages?: string[];
  availability?: string[];
  management?: string[];
  handicap?: string[];
};

export const getNonMatchingCriteria = ({
  xpert,
  excludedCriteria,
  additionalCriteria,
  missionData,
}: {
  xpert: DBMatchedXpert;
  excludedCriteria: Record<string, string[]>;
  additionalCriteria: Record<string, string[]>;
  missionData?: DBMission;
}): NonMatchingCriteria => {
  const mission = xpert.profile_mission;
  const expertise = xpert.profile_expertise;
  const experience = xpert.profile_experience;
  const nonMatching: NonMatchingCriteria = {};

  if (mission?.job_titles && missionData?.job_title) {
    const requiredJobTitles = [
      missionData.job_title,
      ...(additionalCriteria?.job_title || []),
    ];

    const nonMatchingJobTitles = requiredJobTitles
      .filter((title) => !excludedCriteria?.job_title?.includes(title))
      .filter((title) => !mission.job_titles?.includes(title));

    if (nonMatchingJobTitles.length) {
      nonMatching.job_title = nonMatchingJobTitles;
    }
  }

  if (missionData?.post_type || additionalCriteria?.post_type) {
    const experiencePostTypes = experience?.flatMap(
      (exp) => exp.post_type || []
    );
    const requiredPostTypes = [
      ...(missionData?.post_type || []),
      ...(additionalCriteria?.post_type || []),
    ];

    const nonMatchingPostTypes = requiredPostTypes
      .filter((type) => !excludedCriteria?.post_type?.includes(type))
      .filter((type) => !experiencePostTypes?.includes(type));

    if (nonMatchingPostTypes.length) {
      nonMatching.post_type = nonMatchingPostTypes;
    }
  }

  if (missionData?.sector || additionalCriteria.sector) {
    const requiredSectors = [
      missionData?.sector,
      ...(additionalCriteria?.sector || []),
    ];

    const nonMatchingSectors = requiredSectors
      .filter((sector) => !excludedCriteria?.sector?.includes(sector ?? ''))
      .filter((sector) => !experience?.some((exp) => exp.sector === sector));

    if (nonMatchingSectors.length) {
      nonMatching.sector = nonMatchingSectors as string[];
    }
  }

  if (missionData?.specialties || additionalCriteria.specialties) {
    const requiredSpecialties = [
      ...(missionData?.specialties || []),
      ...(additionalCriteria?.specialties || []),
    ];

    const nonMatchingSpecialties = requiredSpecialties
      .filter(
        (specialty) => !excludedCriteria?.specialties?.includes(specialty)
      )
      .filter((specialty) => !expertise?.specialties?.includes(specialty));

    if (nonMatchingSpecialties.length) {
      nonMatching.specialties = nonMatchingSpecialties;
    }
  }

  if (missionData?.expertises || additionalCriteria.expertises) {
    const requiredExpertises = [
      ...(missionData?.expertises || []),
      ...(additionalCriteria?.expertises || []),
    ];

    const nonMatchingExpertises = requiredExpertises
      .filter((exp) => !excludedCriteria?.expertises?.includes(exp))
      .filter((exp) => !expertise?.expertises?.includes(exp));

    if (nonMatchingExpertises.length) {
      nonMatching.expertises = nonMatchingExpertises;
    }
  }

  if (missionData?.languages || additionalCriteria.languages) {
    const requiredLanguages = [
      ...(missionData?.languages || []),
      ...(additionalCriteria?.languages || []),
    ];

    const nonMatchingLanguages = requiredLanguages
      .filter((lang) => !excludedCriteria?.languages?.includes(lang))
      .filter((language) => !expertise?.maternal_language?.includes(language));

    if (nonMatchingLanguages.length) {
      nonMatching.languages = nonMatchingLanguages;
    }
  }

  if (missionData?.diplomas || additionalCriteria.diplomas) {
    const requiredDiplomas = [
      ...(missionData?.diplomas || []),
      ...(additionalCriteria?.diplomas || []),
    ];

    const nonMatchingDiplomas = requiredDiplomas
      .filter((diploma) => !excludedCriteria?.diplomas?.includes(diploma))
      .filter((diploma) => !expertise?.diploma?.includes(diploma));

    if (nonMatchingDiplomas.length) {
      nonMatching.diplomas = nonMatchingDiplomas;
    }
  }

  // Availability check
  if (additionalCriteria.availability?.length > 0) {
    const missionStartDate = new Date(missionData?.start_date ?? '');
    const xpertAvailability = new Date(mission?.availability ?? '');
    if (additionalCriteria.availability.includes('yes')) {
      if (xpertAvailability > missionStartDate) {
        nonMatching.availability = ['yes'];
      } else {
        nonMatching.availability = ['yes'];
      }
    }
  }

  // Management check
  if (additionalCriteria.management?.length > 0) {
    const hasLedTeam = experience?.some((exp) => exp.has_led_team === 'true');

    if (additionalCriteria.management.includes('yes') && !hasLedTeam) {
      nonMatching.management = ['yes'];
    } else if (additionalCriteria.management.includes('no') && hasLedTeam) {
      nonMatching.management = ['no'];
    }
  }

  // Handicap check
  if (additionalCriteria.handicap?.length > 0) {
    const needsWorkstation = mission?.workstation_needed === 'true';

    if (additionalCriteria.handicap.includes('no') && !needsWorkstation) {
      nonMatching.handicap = ['no'];
    }
  }

  return nonMatching;
};
