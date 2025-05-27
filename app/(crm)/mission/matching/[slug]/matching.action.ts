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
    availability: [...(additionalCriteria?.availability || [])],
    management: [...(additionalCriteria?.management || [])],
    handicap: [...(additionalCriteria?.handicap || [])],
    secondary_job_title: additionalCriteria?.secondary_job_title || [],
    secondary_sector: additionalCriteria?.secondary_sector || [],
    secondary_country: [...(additionalCriteria?.secondary_country || [])],
    secondary_region: [...(additionalCriteria?.secondary_region || [])],
    secondary_post_type: additionalCriteria?.secondary_post_type || [],
    secondary_specialties: additionalCriteria?.secondary_specialties || [],
    secondary_expertises: additionalCriteria?.secondary_expertises || [],
    secondary_firstname: additionalCriteria?.secondary_firstname || [],
    secondary_lastname: additionalCriteria?.secondary_lastname || [],
  };

  const finalCriteria = Object.entries(mergedCriteria).reduce(
    (acc, [key, values]) => {
      acc[key] = values.filter(
        (value) => !excludedCriteria?.[key]?.includes(value)
      );
      return acc;
    },
    {} as Record<string, string[]>
  );

  const firstname =
    finalCriteria.secondary_firstname.length > 0
      ? finalCriteria.secondary_firstname[0]
      : '';
  const lastname =
    finalCriteria.secondary_lastname.length > 0
      ? finalCriteria.secondary_lastname[0]
      : '';

  const secondaryCountry =
    finalCriteria.secondary_country.length > 0
      ? finalCriteria.secondary_country
      : '';

  const secondaryRegion =
    finalCriteria.secondary_region.length > 0
      ? finalCriteria.secondary_region
      : '';

  let query = supabase
    .from('profile')
    .select(
      `
    id,
    firstname,
    lastname,
    country,
    
    generated_id,
    profile_mission!inner(
      job_titles,
      posts_type,
      sector,
      specialties,
      expertises,
      availability,
      workstation_needed,
      area,
      france_detail,
      regions
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
  `,
      { count: 'exact' }
    )
    .eq('role', 'xpert');

  if (firstname) {
    query = query.ilike('firstname', firstname);
  }

  if (lastname) {
    query = query.ilike('lastname', lastname);
  }

  if (secondaryCountry && secondaryCountry?.length > 0) {
    query = query.in('country', secondaryCountry);
  }

  if (secondaryRegion && secondaryRegion?.length > 0) {
    // query = query.or(
    //   `area.cs.{"france"},and(france_detail.cs.{"metropolitan_france"})`, {
    //     "referencedTable": "profile_mission",
    //   }

    // );

    query = query.or(
      `france_detail.cs.{metropolitan_france},and(france_detail.cs.{regions},regions.cs.{${secondaryRegion.join(',')}})`,
      { referencedTable: 'profile_mission' }
    );

    // query = query.filter('profile_mission.france_detail', 'cs', '{"regions"}');
    // query = query.filter('profile_mission.regions', 'cs', `{${secondaryRegion.join(',')}}`);

    console.log(query);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching matching experts:', error);
    return { data: [], error: 'Une erreur est survenue lors du matching.' };
  }

  const matchedXperts = data.filter((xpert) => {
    const mission = xpert.profile_mission;
    const expertise = xpert.profile_expertise;
    const experience = xpert.profile_experience;

    const primaryConditions = [];
    const secondaryConditions = [];

    if (finalCriteria.job_title.length > 0) {
      primaryConditions.push(
        experience
          .map((exp) => exp.post)
          .some((job) => finalCriteria.job_title.includes(job || ''))
      );
    }

    if (finalCriteria.sector.length > 0) {
      primaryConditions.push(
        experience.some((exp) =>
          finalCriteria.sector.includes(exp.sector || '')
        )
      );
    }

    if (finalCriteria.post_type.length > 0) {
      primaryConditions.push(
        experience.some((exp) =>
          exp.post_type?.some((type) => finalCriteria.post_type.includes(type))
        )
      );
    }

    if (finalCriteria.specialties.length > 0) {
      primaryConditions.push(
        expertise?.specialties?.some((specialty) =>
          finalCriteria.specialties.includes(specialty)
        )
      );
    }

    if (finalCriteria.expertises.length > 0) {
      primaryConditions.push(
        expertise?.expertises?.some((exp) =>
          finalCriteria.expertises.includes(exp)
        )
      );
    }

    if (finalCriteria.diplomas.length > 0) {
      primaryConditions.push(
        expertise?.diploma && finalCriteria.diplomas.includes(expertise.diploma)
      );
    }

    if (finalCriteria.languages.length > 0) {
      primaryConditions.push(
        expertise?.maternal_language &&
          finalCriteria.languages.includes(expertise.maternal_language)
      );
    }

    if (finalCriteria.availability.length > 0) {
      primaryConditions.push(
        mission?.availability &&
          new Date(mission.availability) <=
            new Date(missionData.start_date ?? '')
      );
    } else {
      primaryConditions.push(
        mission?.availability &&
          new Date(mission.availability) >
            new Date(missionData.start_date ?? '')
      );
    }

    if (finalCriteria.management.length > 0) {
      primaryConditions.push(
        experience.some((exp) =>
          finalCriteria.management.includes('yes')
            ? exp.has_led_team === 'true'
            : exp.has_led_team === 'false'
        )
      );
    } else {
      primaryConditions.push(
        experience.some((exp) => exp.has_led_team === 'true')
      );
    }

    if (finalCriteria.handicap.length > 0) {
      primaryConditions.push(
        finalCriteria.handicap.includes('yes')
          ? mission?.workstation_needed === 'true'
          : mission?.workstation_needed === 'false'
      );
    } else {
      primaryConditions.push(
        missionData.open_to_disabled === 'true'
          ? mission?.workstation_needed === 'true'
          : mission?.workstation_needed === 'false'
      );
    }

    if (finalCriteria.secondary_job_title?.length > 0) {
      secondaryConditions.push(
        experience
          .map((exp) => exp.post)
          .some((job) => finalCriteria.secondary_job_title.includes(job || ''))
      );
    }

    if (finalCriteria.secondary_sector?.length > 0) {
      secondaryConditions.push(
        experience.some((exp) =>
          finalCriteria.secondary_sector.includes(exp.sector || '')
        )
      );
    }

    if (finalCriteria.secondary_post_type?.length > 0) {
      secondaryConditions.push(
        experience.some((exp) =>
          exp.post_type?.some((type) =>
            finalCriteria.secondary_post_type.includes(type)
          )
        )
      );
    }

    if (finalCriteria.secondary_specialties?.length > 0) {
      secondaryConditions.push(
        expertise?.specialties?.some((specialty) =>
          finalCriteria.secondary_specialties.includes(specialty)
        )
      );
    }

    if (finalCriteria.secondary_expertises?.length > 0) {
      secondaryConditions.push(
        expertise?.expertises?.some((exp) =>
          finalCriteria.secondary_expertises.includes(exp)
        )
      );
    }

    if (finalCriteria.secondary_country.length > 0) {
      secondaryConditions.push(
        finalCriteria.secondary_country.includes(xpert.country || '')
      );
    }

    // if (finalCriteria.secondary_firstname?.length > 0) {
    //   secondaryConditions.push(
    //     xpert.firstname &&
    //       finalCriteria.secondary_firstname.includes(xpert.firstname)

    //   );
    // }

    // if (finalCriteria.secondary_lastname?.length > 0) {
    //   secondaryConditions.push(
    //     xpert.lastname &&
    //       finalCriteria.secondary_lastname.includes(xpert.lastname)

    //   );
    // }

    const hasPrimaryMatch =
      primaryConditions.length === 0 ||
      primaryConditions.some((condition) => condition === true);
    const hasSecondaryMatch =
      secondaryConditions.length === 0 ||
      secondaryConditions.some((condition) => condition === true);

    return hasPrimaryMatch && hasSecondaryMatch;
  });

  const enhancedXperts = matchedXperts
    .map((xpert) => {
      const nonMatchingCriteria = getNonMatchingCriteria({
        xpert: xpert as DBMatchedXpert,
        excludedCriteria: excludedCriteria || {},
        additionalCriteria: Object.fromEntries(
          Object.entries(additionalCriteria || {}).filter(
            ([key]) => !key.startsWith('secondary_')
          )
        ),
        missionData,
      });

      const matchingScore = calculateTotalMatchingScore(
        xpert as DBMatchedXpert,
        missionData,
        excludedCriteria || {},
        Object.fromEntries(
          Object.entries(additionalCriteria || {}).filter(
            ([key]) => !key.startsWith('secondary_')
          )
        )
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
