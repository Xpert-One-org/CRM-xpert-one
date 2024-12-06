'use server';

import type {
  ProfileDataPicked,
  UserData,
} from '@/components/dialogs/CreateXpertDialog';
import { limitXpert } from '@/data/constant';
import type { AdminOpinionValue, FilterXpert } from '@/types/types';
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
        'firstname, lastname, id, country, generated_id, created_at, admin_opinion, cv_name, profile_mission(availability, job_titles), mission!mission_xpert_associated_id_fkey(xpert_associated_id)',
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
        query = query.is('mission', null);
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

    if (filters?.adminOpinion) {
      query = query.eq('admin_opinion', filters.adminOpinion);
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
  user,
  profile,
}: {
  user: UserData;
  profile: ProfileDataPicked;
}) => {
  const supabase = await createSupabaseAppServerClient('admin');

  const { user: userSession } = (await supabase.auth.getUser()).data;

  if (!userSession) {
    return {
      error: { message: "Vous n'êtes pas connecté", code: 'not_authenticated' },
    };
  }

  const { email, password, firstname, lastname, mobile, referent_id } = user;

  const { error } = await supabase.auth.admin.createUser({
    email_confirm: true,
    email,
    password,
    user_metadata: {
      firstname,
      lastname,
      default_phone: mobile,
      referent_generated_id: referent_id,
      role: 'xpert',
    },
  });

  if (error) {
    return { error: { message: error.message, code: error.code } };
  }

  const {
    address,
    birthdate,
    city,
    civility,
    country,
    fix,
    how_did_you_hear_about_us,
    linkedin,
    postal_code,
    street_number,
  } = profile;
  const { error: updateError } = await supabase
    .from('profile')
    .update({
      address,
      birthdate,
      city,
      civility,
      country,
      fix,
      how_did_you_hear_about_us,
      linkedin,
      postal_code,
      street_number,
    })
    .eq('email', email);

  if (updateError) {
    return { error: { message: updateError.message, code: updateError.code } };
  }

  return { error: null };
};

export const deleteXpert = async (xpertId: string) => {
  try {
    const supabase = await createSupabaseAppServerClient('admin');

    const { error: deleteError } =
      await supabase.auth.admin.deleteUser(xpertId);
    if (deleteError) throw deleteError;

    return { errorMessage: null };
  } catch (error) {
    return {
      errorMessage: {
        message: "Erreur lors de la suppression de l'Xpert",
        code: 'delete_error',
      },
    };
  }
};

export const updateAdminOpinion = async (
  xpertId: string,
  opinion: AdminOpinionValue
) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    return { error: "Vous n'êtes pas connecté" };
  }

  const { error } = await supabase
    .from('profile')
    .update({ admin_opinion: opinion === '' ? null : opinion })
    .eq('id', xpertId);

  if (error) {
    console.error('Error updating admin opinion:', error);
    return { error: error.message };
  } else {
    return { error: null };
  }
};
