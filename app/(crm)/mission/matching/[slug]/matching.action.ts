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

    // secondaires
    secondary_job_title: additionalCriteria?.secondary_job_title || [],
    secondary_sector: additionalCriteria?.secondary_sector || [],
    secondary_country: [...(additionalCriteria?.secondary_country || [])],
    secondary_region: [...(additionalCriteria?.secondary_region || [])],
    secondary_post_type: additionalCriteria?.secondary_post_type || [],
    secondary_specialties: additionalCriteria?.secondary_specialties || [],
    secondary_expertises: additionalCriteria?.secondary_expertises || [],
    secondary_firstname: additionalCriteria?.secondary_firstname || [],
    secondary_lastname: additionalCriteria?.secondary_lastname || [],
    secondary_xpert_id: additionalCriteria?.secondary_xpert_id || [],
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

  // Déterminer si on est en "mode secondaire uniquement"
  const secondaryMode = Object.entries(finalCriteria).some(
    ([k, v]) => k.startsWith('secondary_') && v.length > 0
  );

  const firstname =
    finalCriteria.secondary_firstname.length > 0
      ? finalCriteria.secondary_firstname[0]
      : '';
  const lastname =
    finalCriteria.secondary_lastname.length > 0
      ? finalCriteria.secondary_lastname[0]
      : '';

  const xpertId =
    finalCriteria.secondary_xpert_id.length > 0
      ? finalCriteria.secondary_xpert_id[0]
      : '';

  const secondaryCountry =
    finalCriteria.secondary_country.length > 0
      ? finalCriteria.secondary_country
      : [];

  const secondaryRegion =
    finalCriteria.secondary_region.length > 0
      ? finalCriteria.secondary_region
      : [];

  // IMPORTANT : pas de !inner -> LEFT JOIN implicites
  let query = supabase
    .from('profile')
    .select(
      `
      id,
      firstname,
      lastname,
      country,
      generated_id,

      profile_mission (
        id,
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
        id,
        sector,
        post_type,
        post,
        has_led_team
      ),
      profile_expertise (
        id,
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

  // Les champs nom/prénom secondaires sont appliqués en SQL (ilike)
  if (firstname) {
    query = query.ilike('firstname', `%${firstname}%`);
  }
  if (lastname) {
    query = query.ilike('lastname', `%${lastname}%`);
  }
  if (xpertId) {
    // if no space between X and numbers, add a space
    if (!xpertId.includes(' ')) {
      console.log('xpertId', xpertId);
      const xpertIdWithSpace = `X ${xpertId.replace('X', '')}`;
      query = query.ilike('generated_id', `%${xpertIdWithSpace}%`);
    } else {
      query = query.ilike('generated_id', `%${xpertId}%`);
    }
  }
  if (secondaryCountry && secondaryCountry.length > 0) {
    query = query.in('country', secondaryCountry);
  }

  // Regions (secondaire) -> null = pas match, donc on ne garde PAS les lignes sans profile_mission
  if (secondaryRegion && secondaryRegion.length > 0) {
    query = query.or(
      `france_detail.cs.{metropolitan_france},and(france_detail.cs.{regions},regions.cs.{${secondaryRegion.join(',')}})`,
      { referencedTable: 'profile_mission' }
    );
  }

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching matching experts:', error);
    return { data: [], error: 'Une erreur est survenue lors du matching.' };
  }

  const matchedXperts = (data || []).filter((xpert: any) => {
    const mission = xpert.profile_mission; // peut être null
    const expertise = xpert.profile_expertise; // peut être null
    const experience = xpert.profile_experience || []; // array ou []

    const primaryConditions: boolean[] = [];
    const secondaryConditions: boolean[] = [];

    // ====== PRIMARY ONLY IF secondaryMode === false ======
    if (!secondaryMode) {
      if (finalCriteria.job_title.length > 0) {
        primaryConditions.push(
          experience
            .map((exp: any) => exp.post)
            .some((job: string) => finalCriteria.job_title.includes(job || ''))
        );
      }

      if (finalCriteria.sector.length > 0) {
        primaryConditions.push(
          experience.some((exp: any) =>
            finalCriteria.sector.includes(exp.sector || '')
          )
        );
      }

      if (finalCriteria.post_type.length > 0) {
        primaryConditions.push(
          experience.some((exp: any) =>
            (exp.post_type || []).some((type: string) =>
              finalCriteria.post_type.includes(type)
            )
          )
        );
      }

      if (finalCriteria.specialties.length > 0) {
        primaryConditions.push(
          (expertise?.specialties || []).some((specialty: string) =>
            finalCriteria.specialties.includes(specialty)
          )
        );
      }

      if (finalCriteria.expertises.length > 0) {
        primaryConditions.push(
          (expertise?.expertises || []).some((exp: string) =>
            finalCriteria.expertises.includes(exp)
          )
        );
      }

      if (finalCriteria.diplomas.length > 0) {
        primaryConditions.push(
          !!expertise?.diploma &&
            finalCriteria.diplomas.includes(expertise.diploma)
        );
      }

      if (finalCriteria.languages.length > 0) {
        primaryConditions.push(
          !!expertise?.maternal_language &&
            finalCriteria.languages.includes(expertise.maternal_language)
        );
      }

      // disponibilité (null = pas match)
      if (finalCriteria.availability.length > 0) {
        primaryConditions.push(
          !!mission?.availability &&
            new Date(mission.availability) <=
              new Date(missionData.start_date ?? '')
        );
      } else {
        primaryConditions.push(
          !!mission?.availability &&
            new Date(mission.availability) >
              new Date(missionData.start_date ?? '')
        );
      }

      // management (null = pas match)
      if (finalCriteria.management.length > 0) {
        primaryConditions.push(
          experience.some((exp: any) =>
            finalCriteria.management.includes('yes')
              ? exp.has_led_team === 'true'
              : exp.has_led_team === 'false'
          )
        );
      } else {
        primaryConditions.push(
          experience.some((exp: any) => exp.has_led_team === 'true')
        );
      }

      // handicap (null = pas match)
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
    }

    // ====== SECONDARY (utilisés SEULS si secondaryMode === true) ======
    if (finalCriteria.secondary_job_title?.length > 0) {
      secondaryConditions.push(
        experience
          .map((exp: any) => exp.post)
          .some((job: string) =>
            finalCriteria.secondary_job_title.includes(job || '')
          )
      );
    }

    if (finalCriteria.secondary_sector?.length > 0) {
      secondaryConditions.push(
        experience.some((exp: any) =>
          finalCriteria.secondary_sector.includes(exp.sector || '')
        )
      );
    }

    if (finalCriteria.secondary_post_type?.length > 0) {
      secondaryConditions.push(
        experience.some((exp: any) =>
          (exp.post_type || []).some((type: string) =>
            finalCriteria.secondary_post_type.includes(type)
          )
        )
      );
    }

    if (finalCriteria.secondary_specialties?.length > 0) {
      secondaryConditions.push(
        (expertise?.specialties || []).some((specialty: string) =>
          finalCriteria.secondary_specialties.includes(specialty)
        )
      );
    }

    if (finalCriteria.secondary_expertises?.length > 0) {
      secondaryConditions.push(
        (expertise?.expertises || []).some((exp: string) =>
          finalCriteria.secondary_expertises.includes(exp)
        )
      );
    }

    if (finalCriteria.secondary_country.length > 0) {
      secondaryConditions.push(
        finalCriteria.secondary_country.includes(xpert.country || '')
      );
    }

    // Note : secondary_firstname/lastname sont déjà appliqués en SQL via ilike

    // === Décision finale ===
    if (secondaryMode) {
      // On ignore complètement les primaryConditions
      const hasSecondaryMatch =
        secondaryConditions.length === 0 || secondaryConditions.some(Boolean);
      return hasSecondaryMatch;
    } else {
      const hasPrimaryMatch =
        primaryConditions.length === 0 || primaryConditions.some(Boolean);
      const hasSecondaryMatch =
        secondaryConditions.length === 0 || secondaryConditions.some(Boolean);
      return hasPrimaryMatch && hasSecondaryMatch;
    }
  });

  const enhancedXperts = matchedXperts
    .map((xpert: any) => {
      const nonMatchingCriteria = getNonMatchingCriteria({
        xpert: xpert as DBMatchedXpert,
        excludedCriteria: excludedCriteria || {},
        // si secondaryMode, on ne calcule le score que sur les critères primaires ? => on garde ton comportement actuel
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
    .sort((a: any, b: any) => b.matchingScore - a.matchingScore);

  return { data: enhancedXperts as DBMatchedXpert[], error: '' };
}
