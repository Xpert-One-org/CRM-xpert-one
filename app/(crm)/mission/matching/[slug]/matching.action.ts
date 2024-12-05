'use server';

import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { calculateTotalMatchingScore } from './_functions/calculateMatchingPercentage';
import { getNonMatchingCriteria } from './_functions/getNonMatchingCriteria';

export async function getAllMatchedXperts(
  missionData: DBMission,
  excludedCriteria?: Record<string, string[]>,
  additionalCriteria?: Record<string, string[]>
): Promise<{ data: DBMatchedXpert[]; error: string }> {
  const supabase = await createSupabaseAppServerClient();
  const { sector, post_type, specialties, expertises, languages, diplomas } =
    missionData;

  const mergedCriteria = {
    job_title: [
      ...(missionData.job_title ? missionData.job_title.split(',') : []),
      ...(additionalCriteria?.job_title ? additionalCriteria.job_title : []),
    ],
    sector: [
      ...(sector ? sector.split(',') : []),
      ...(additionalCriteria?.sector ? additionalCriteria.sector : []),
    ],
    post_type: [
      ...(post_type ? post_type : []),
      ...(additionalCriteria?.post_type ? additionalCriteria.post_type : []),
    ],
    specialties: [
      ...(specialties || []),
      ...(additionalCriteria?.specialties || []),
    ],
    expertises: [
      ...(expertises || []),
      ...(additionalCriteria?.expertises || []),
    ],
    languages: [...(languages || []), ...(additionalCriteria?.languages || [])],
    diplomas: [...(diplomas || []), ...(additionalCriteria?.diplomas || [])],
  };

  // Create final criteria by removing excluded values
  const finalCriteria = Object.entries(mergedCriteria).reduce(
    (acc, [key, values]) => {
      acc[key] = values.filter(
        (value) => !excludedCriteria?.[key]?.includes(value)
      );
      return acc;
    },
    {} as Record<string, string[]>
  );

  const { data, error } = await supabase
    .from('profile')
    .select(
      `
      id,
      firstname,
      lastname,
      generated_id,
      profile_mission (
        job_titles,
        posts_type,
        sector,
        specialties,
        expertises,
        availability
      ),
      profile_experience (
        sector,
        post_type
      ),
      profile_expertise (
        seniority,
        specialties,
        expertises,
        diploma,
        degree,
        maternal_language
      )
    `
    )
    .eq('role', 'xpert');

  if (error) {
    console.error('Error fetching matching experts:', error);
    return { data: [], error: 'Une erreur est survenue lors du matching.' };
  }

  const matchedXperts = data.filter((xpert) => {
    const mission = xpert.profile_mission;
    const expertise = xpert.profile_expertise;
    const experience = xpert.profile_experience;

    // Create an array of boolean conditions for each non-empty criteria
    const matchConditions = [];

    // Only check criteria that have values
    if (finalCriteria.job_title.length > 0) {
      matchConditions.push(
        mission?.job_titles?.some((job) =>
          finalCriteria.job_title.includes(job)
        )
      );
    }

    if (finalCriteria.sector.length > 0) {
      matchConditions.push(
        experience.some((exp) =>
          finalCriteria.sector.includes(exp.sector || '')
        )
      );
    }

    if (finalCriteria.post_type.length > 0) {
      matchConditions.push(
        experience.some((exp) =>
          exp.post_type?.some((type) => finalCriteria.post_type.includes(type))
        )
      );
    }

    if (finalCriteria.specialties.length > 0) {
      matchConditions.push(
        expertise?.specialties?.some((specialty) =>
          finalCriteria.specialties.includes(specialty)
        )
      );
    }

    if (finalCriteria.expertises.length > 0) {
      matchConditions.push(
        expertise?.expertises?.some((exp) =>
          finalCriteria.expertises.includes(exp)
        )
      );
    }

    if (finalCriteria.diplomas.length > 0) {
      matchConditions.push(
        expertise?.diploma && finalCriteria.diplomas.includes(expertise.diploma)
      );
    }

    if (finalCriteria.languages.length > 0) {
      matchConditions.push(
        expertise?.maternal_language &&
          finalCriteria.languages.includes(expertise.maternal_language)
      );
    }

    return matchConditions.some((condition) => condition === true);
  });

  // Enhance matched experts with scores and non-matching criteria
  const enhancedXperts = matchedXperts
    .map((xpert) => {
      const nonMatchingCriteria = getNonMatchingCriteria(
        xpert as DBMatchedXpert,
        missionData,
        excludedCriteria || {},
        additionalCriteria || {}
      );

      const matchingScore = calculateTotalMatchingScore(
        xpert as DBMatchedXpert,
        missionData,
        excludedCriteria || {},
        additionalCriteria || {}
      );

      return {
        ...xpert,
        matchingScore,
        nonMatchingCriteria,
      };
    })
    .sort((a, b) => b.matchingScore - a.matchingScore);

  return { data: enhancedXperts as DBMatchedXpert[], error: '' };
}
