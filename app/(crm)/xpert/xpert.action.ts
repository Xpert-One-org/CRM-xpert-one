'use server';

import { limitXpert } from '@/data/constant';
import type { DBXpert } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getSpecificXpert = async (
  xpertId: string
): Promise<DBXpert | null> => {
  const supabase = await createSupabaseAppServerClient();

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
      .eq('referent_id', xpertId)
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
  const supabase = await createSupabaseAppServerClient();

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

export const createXpert = async ({
  email,
  password,
  firstname,
  lastname,
  phone,
  civility,
  birthdate,
}: {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  civility: string;
  birthdate: string;
}) => {
  const supabase = await createSupabaseAppServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        lastname,
        role: 'xpert',
        default_phone: phone,
        firstname,
        referent_generated_id: 'XEE',
        civility,
        birthdate,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { error: null };
};

export const deleteXpert = async (xpertId: string) => {
  try {
    const supabase = await createSupabaseAppServerClient('deleteXpert');

    const { error: deleteError } =
      await supabase.auth.admin.deleteUser(xpertId);
    if (deleteError) throw deleteError;

    return { errorMessage: null };
  } catch (error) {
    let errorMessage = "Impossible de supprimer l'XPERT";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { errorMessage };
  }
};
