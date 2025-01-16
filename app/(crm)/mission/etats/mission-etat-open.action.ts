'use server';

import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { getNonMatchingCriteria } from '../matching/[slug]/_functions/getNonMatchingCriteria';
import { calculateTotalMatchingScore } from '../matching/[slug]/_functions/calculateMatchingPercentage';

export async function getCountMatchedXperts(
  missionData: DBMission
): Promise<{ data: DBMatchedXpert[]; error: string }> {
  const supabase = await createSupabaseAppServerClient();
  const {
    sector,
    post_type,
    specialties,
    expertises,
    languages,
    diplomas,
    start_date,
    city,
    open_to_disabled,
  } = missionData;

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
        availability,
        workstation_needed
      ),
      profile_experience (
        sector,
        post_type,
        post,
        has_led_team
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

    const conditions = [];

    if (missionData.job_title) {
      conditions.push(
        experience
          .map((exp) => exp.post)
          .some((job) => missionData.job_title?.split(',').includes(job || ''))
      );
    }

    if (sector) {
      conditions.push(
        experience.some((exp) => sector.split(',').includes(exp.sector || ''))
      );
    }

    if (post_type && post_type.length > 0) {
      conditions.push(
        experience.some((exp) =>
          exp.post_type?.some((type) => post_type.includes(type))
        )
      );
    }

    if (specialties && specialties.length > 0) {
      conditions.push(
        expertise?.specialties?.some((specialty) =>
          specialties.includes(specialty)
        )
      );
    }

    if (expertises && expertises.length > 0) {
      conditions.push(
        expertise?.expertises?.some((exp) => expertises.includes(exp))
      );
    }

    if (diplomas && diplomas.length > 0) {
      conditions.push(
        expertise?.diploma && diplomas.includes(expertise.diploma)
      );
    }

    if (languages && languages.length > 0) {
      conditions.push(
        expertise?.maternal_language &&
          languages.includes(expertise.maternal_language)
      );
    }

    if (start_date) {
      conditions.push(
        mission?.availability &&
          new Date(mission.availability) <= new Date(start_date)
      );
    }

    conditions.push(experience.some((exp) => exp.has_led_team === 'true'));

    conditions.push(
      open_to_disabled === 'true'
        ? mission?.workstation_needed === 'true'
        : mission?.workstation_needed === 'false'
    );

    return conditions.some((condition) => condition === true);
  });

  const enhancedXperts = matchedXperts
    .map((xpert) => {
      const nonMatchingCriteria = getNonMatchingCriteria(
        xpert as DBMatchedXpert,
        missionData,
        {},
        {}
      );

      const matchingScore = calculateTotalMatchingScore(
        xpert as DBMatchedXpert,
        missionData,
        {},
        {}
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

export async function getMissionSelectionXperts(missionId: number) {
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('selection_matching')
    .select(
      `
      *,
      xpert:profile!selection_matching_xpert_id_fkey (
        firstname,
        lastname,
        generated_id
      )
      `
    )
    .eq('mission_id', missionId);

  if (error) throw error;

  return { data, error: '' };
}
