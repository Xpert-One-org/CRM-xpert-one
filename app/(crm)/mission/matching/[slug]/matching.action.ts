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

  // Create the final criteria by removing excluded values
  const finalCriteria = {
    sector: excludedCriteria.sector
      ? excludedCriteria.sector.filter(
          (s) => !excludedCriteria.sector.includes(s)
        )
      : sector,
    post_type: excludedCriteria.post_type
      ? post_type?.filter((p) => !excludedCriteria.post_type.includes(p))
      : post_type,
    specialties: excludedCriteria.specialties
      ? specialties?.filter((s) => !excludedCriteria.specialties.includes(s))
      : specialties,
    expertises: excludedCriteria.expertises
      ? expertises?.filter((e) => !excludedCriteria.expertises.includes(e))
      : expertises,
    languages: excludedCriteria.languages
      ? languages?.filter((l) => !excludedCriteria.languages.includes(l))
      : languages,
    diplomas: excludedCriteria.diplomas
      ? diplomas?.filter((d) => !excludedCriteria.diplomas.includes(d))
      : diplomas,
  };

  console.log(finalCriteria);

  const { data, error } = await supabase
    .from('profile')
    .select(
      `
        id,
        firstname,
        lastname,
        profile_mission (
          sector,
          posts_type,
          specialties,
          expertises
        ),
        profile_education (
          education_diploma
        ),
        profile_expertise (
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
    const education = xpert.profile_education;
    const expertise = xpert.profile_expertise;

    return (
      mission?.sector?.some((s) => finalCriteria.sector?.includes(s)) ||
      mission?.posts_type?.some((p) => finalCriteria.post_type?.includes(p)) ||
      mission?.specialties?.some((sp) =>
        finalCriteria.specialties?.includes(sp)
      ) ||
      mission?.expertises?.some((e) => finalCriteria.expertises?.includes(e)) ||
      education
        .map((e) => e.education_diploma)
        .some((d) => finalCriteria.diplomas?.includes(d ?? '')) ||
      finalCriteria.languages?.some((l) =>
        expertise?.maternal_language?.includes(l)
      )
    );
  });

  return { data: matchedXperts as unknown as DBMatchedXpert[], error: '' };
}
