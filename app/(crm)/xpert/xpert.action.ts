'use server';

import { limitXpert } from '@/data/constant';
import type { DBXpert } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getSpecificXpert = async (
  xpertId: string
): Promise<DBXpert | null> => {
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error } = await supabase
      .from('profile')
      .select(
        `
        *,
        profile_mission(*),
        experiences:profile_experience(*), educations:profile_education(*),
        mission!mission_created_by_fkey(*),
        profile_status(*),
        profile_expertise(*)
      `
      )
      .eq('role', 'xpert')
      .single();

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error('No data returned');
      return null;
    }

    const { experiences, educations, profile_expertise, ...rest } = data;
    return {
      ...rest,
      profile_expertise: {
        ...profile_expertise,
        experiences,
        educations,
      } as DBXpert['profile_expertise'],
    };
  }

  return null;
};

export const getAllXperts = async ({
  offset,
}: {
  offset: number;
}): Promise<{ data: DBXpert[]; count: number | null }> => {
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error, count } = await supabase
      .from('profile')
      .select(
        `
        *,
        profile_mission(*),
        experiences:profile_experience(*), educations:profile_education(*),
        mission!mission_created_by_fkey(*),
        profile_status(*),
        profile_expertise(*)
      `,
        { count: 'exact' }
      )
      .eq('role', 'xpert')
      .order('created_at', { ascending: false })
      .range(offset, offset + limitXpert - 1);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error('No data returned');
      throw new Error('No data returned');
    }

    const processedData = data.map((profile) => {
      const { experiences, educations, profile_expertise, ...rest } = profile;
      return {
        ...rest,
        profile_expertise: {
          ...profile_expertise,
          experiences,
          educations,
        } as DBXpert['profile_expertise'],
      };
    });

    return {
      data: processedData,
      count: count || 0,
    };
  }

  return {
    data: [],
    count: null,
  };
};
