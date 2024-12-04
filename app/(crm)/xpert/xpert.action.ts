'use server';

import { limitXpert } from '@/data/constant';
import type { FilterXpert } from '@/types/types';
import type { DBXpert, DBXpertOptimized } from '@/types/typesDb';
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
      `,
        { count: 'exact' }
      )
      .eq('role', 'xpert')
      .eq('generated_id', xpertId)
      .order('created_at', { ascending: false })
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

export const searchXpert = async (): Promise<{ data: DBXpert[] }> => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('role', 'xpert');

  if (error) {
    throw new Error(error.message);
  }

  return { data: data as DBXpert[] };
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

export const getXpertsOptimized = async ({
  offset,
  filters,
}: {
  offset: number;
  filters?: FilterXpert;
}): Promise<{ data: DBXpertOptimized[]; count: number | null }> => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    let query = supabase
      .from('profile')
      .select(
        'firstname, lastname, id, country, generated_id, created_at, cv_name, profile_mission(availability, job_titles), mission!mission_xpert_associated_id_fkey(xpert_associated_id)',
        { count: 'exact' }
      )
      .eq('role', 'xpert');

    if (filters?.availability) {
      if (filters.availability === 'unavailable') {
        const date = new Date();
        query = query.or(
          `availability.eq.${null},availability.gt.${date.toISOString()}`,
          { referencedTable: 'profile_mission' }
        );
      }
      if (filters.availability === 'in_mission') {
        query = query.not(`mission`, 'is', null);
      }
      if (filters.availability === 'available') {
        query = query.not(`profile_mission`, 'is', null);
        query = query.or(`availability.lt.${new Date().toISOString()}`, {
          referencedTable: 'profile_mission',
        });
      }
    }

    if (filters?.jobTitles) {
      const jobTitles = filters.jobTitles.replace(/ /g, '_');
      query = query.not('profile_mission', 'is', null);
      query = query.ilike(
        'profile_mission.job_titles_search',
        `%${jobTitles}%`
      );
    }

    if (filters?.countries && filters.countries.length > 0) {
      query = query.in('country', filters.countries);
    }

    if (filters?.sortDate) {
      query = query.order('created_at', {
        ascending: filters.sortDate === 'asc',
      });
    } else {
      query = query.order('created_at', {
        ascending: false,
      });
    }

    if (filters?.firstname) {
      query = query.ilike('firstname', `%${filters.firstname}%`);
    }

    if (filters?.lastname) {
      query = query.ilike('lastname', `%${filters.lastname}%`);
    }

    if (filters?.cv) {
      if (filters.cv === 'yes') {
        query = query.not('cv_name', 'is', null);
      } else {
        query = query.is('cv_name', null);
      }
    }

    if (filters?.generated_id) {
      query = query.ilike('generated_id', `%${filters.generated_id}%`);
    }

    const { data, error, count } = await query.range(
      offset,
      offset + limitXpert - 1
    );

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error('No data returned');
      throw new Error('No data returned');
    }

    return {
      data: data,
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
