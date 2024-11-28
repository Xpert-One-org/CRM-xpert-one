'use server';

import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function getAllMatchedXperts(
  missionCriteria: DBMission,
  excludedCriteria?: Record<string, string[]>,
  newCriteria?: Record<string, string[]>
): Promise<{ data: DBMatchedXpert[]; error: string }> {
  const supabase = await createSupabaseAppServerClient();
  const { sector, post_type, specialties, expertises, languages, diplomas } =
    missionCriteria;

  const mergedCriteria = {
    job_title: [
      ...(missionCriteria.job_title
        ? missionCriteria.job_title.split(',')
        : []),
      ...(newCriteria?.job_title ? newCriteria.job_title : []),
    ],
    sector: [
      ...(sector ? sector.split(',') : []),
      ...(newCriteria?.sector ? newCriteria.sector : []),
    ],
    post_type: [
      ...(post_type ? post_type : []),
      ...(newCriteria?.post_type ? newCriteria.post_type : []),
    ],
    specialties: [...(specialties || []), ...(newCriteria?.specialties || [])],
    expertises: [...(expertises || []), ...(newCriteria?.expertises || [])],
    languages: [...(languages || []), ...(newCriteria?.languages || [])],
    diplomas: [...(diplomas || []), ...(newCriteria?.diplomas || [])],
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
    return (
      mission?.job_titles?.some(
        (job) =>
          finalCriteria.job_title && finalCriteria.job_title.includes(job)
      ) ||
      experience.some(
        (exp) =>
          finalCriteria.sector &&
          finalCriteria.sector.includes(exp.sector || '')
      ) ||
      expertise?.specialties?.some(
        (specialty) =>
          finalCriteria.specialties &&
          finalCriteria.specialties.includes(specialty)
      ) ||
      expertise?.expertises?.some(
        (expertise) =>
          finalCriteria.expertises &&
          finalCriteria.expertises.includes(expertise)
      ) ||
      (expertise?.diploma &&
        finalCriteria.diplomas &&
        finalCriteria.diplomas.includes(expertise.diploma)) ||
      (expertise?.maternal_language &&
        finalCriteria.languages &&
        finalCriteria.languages.includes(expertise.maternal_language))
    );
  });

  return { data: matchedXperts as DBMatchedXpert[], error: '' };
}
