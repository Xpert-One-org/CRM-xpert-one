'use server';

import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function getAllMatchedXperts(
  missionCriteria: DBMission,
  excludedCriteria: Record<string, string[]>
): Promise<{ data: DBMatchedXpert[]; error: string }> {
  const supabase = await createSupabaseAppServerClient();
  const { sector, post_type, specialties, expertises, languages, diplomas } =
    missionCriteria;

  const shouldApplyCriteria = (criteriaKey: string) => {
    return (
      !excludedCriteria[criteriaKey] ||
      excludedCriteria[criteriaKey].length === 0
    );
  };

  const finalCriteria = {
    job_title: shouldApplyCriteria('job_title')
      ? missionCriteria.job_title
      : undefined,
    sector: shouldApplyCriteria('sector') ? sector : undefined,
    post_type: shouldApplyCriteria('post_type') ? post_type : undefined,
    specialties: shouldApplyCriteria('specialties') ? specialties : undefined,
    expertises: shouldApplyCriteria('expertises') ? expertises : undefined,
    languages: shouldApplyCriteria('languages') ? languages : undefined,
    diplomas: shouldApplyCriteria('diplomas') ? diplomas : undefined,
  };

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
        expertises
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
      mission?.job_titles?.some((job) =>
        finalCriteria.job_title?.includes(job)
      ) ||
      experience.some((exp) =>
        finalCriteria.sector?.includes(exp.sector || '')
      ) ||
      expertise?.specialties?.some((specialty) =>
        finalCriteria.specialties?.includes(specialty)
      ) ||
      expertise?.expertises?.some((expertise) =>
        finalCriteria.expertises?.includes(expertise)
      ) ||
      (expertise?.diploma &&
        finalCriteria.diplomas?.includes(expertise.diploma)) ||
      (expertise?.maternal_language &&
        finalCriteria.languages?.includes(expertise.maternal_language))
    );
  });

  return { data: matchedXperts as DBMatchedXpert[], error: '' };
}
