'use server';

import type {
  ProfileDataPicked,
  UserData,
} from '@/components/dialogs/CreateXpertDialog';
import { limitXpert } from '@/data/constant';
import { transformArray } from '@/lib/utils';
import type { AdminOpinionValue, FilterXpert } from '@/types/types';
import type {
  DBProfile,
  DBProfileExperience,
  DBProfileExpertise,
  DBProfileMission,
  DBProfileStatus,
  DBXpert,
  DBXpertOptimized,
} from '@/types/typesDb';
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

export const createUser = async ({
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

  const { email, password, firstname, lastname, mobile, referent_id, role } =
    user;

  const { error } = await supabase.auth.admin.createUser({
    email_confirm: true,
    email,
    password,
    user_metadata: {
      firstname,
      lastname,
      default_phone: mobile,
      referent_generated_id: referent_id,
      role: role,
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
      role: role,
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

// const {error} = await updateProfileExpertise({xpert_id: xpertNotSaved.id, newData: newDataProfileExpertise});

export const updateProfileExpertise = async ({
  xpert_id,
  newData,
}: {
  xpert_id: string;
  newData: Partial<Record<keyof DBProfileExpertise, any>>[];
}) => {
  const supabase = await createSupabaseAppServerClient();

  const transformedData = transformArray(newData);

  const { experiences, educations, ...rest } = transformedData;

  if (experiences && experiences.length === 0) {
    // if experiences == undefined, there is no experience to update
    // but if it's an empty array, we need to delete all experiences

    // Delete all experiences matching the xpert_id
    const { error: errorDeletingExp } = await supabase
      .from('profile_experience')
      .delete()
      .eq('profile_id', xpert_id);

    if (errorDeletingExp) {
      console.error('Error deleting profile experiences:', errorDeletingExp);
    }
  }

  if (experiences && experiences.length > 0) {
    // promise.all
    // if id is defined, update the experience
    // if id is undefined, create the experience

    const { data, count } = await supabase
      .from('profile_experience')
      .select('id', { count: 'exact' })
      .eq('profile_id', xpert_id);

    // check if one experience has been removed from the front
    if (count ?? 0 > experiences.length) {
      const experiencesId = data?.map(
        (experience: { id: number }) => experience.id
      );

      const experiencesToRemove = experiencesId?.filter(
        (id: number) =>
          !experiences.find(
            (experience: { id: number }) => experience.id === id
          )
      );
      if (experiencesToRemove) {
        const { error: errorDeletingExp } = await supabase
          .from('profile_experience')
          .delete()
          .in('id', experiencesToRemove);

        if (errorDeletingExp) {
          console.error(
            'Error deleting profile experiences:',
            errorDeletingExp
          );
        }
      }
    }

    const promises = experiences.map(
      async (experience: DBProfileExperience) => {
        if (experience.id) {
          const { error } = await supabase
            .from('profile_experience')
            .update(experience)
            .eq('id', experience.id);

          if (error) {
            console.error('Error updating profile experience:', error);
          }
        } else {
          const { error } = await supabase
            .from('profile_experience')
            .insert({ ...experience, profile_id: xpert_id });

          if (error) {
            console.error('Error inserting profile experience:', error);
          }
        }
      }
    );

    await Promise.all(promises);
  }

  const { data, error } = await supabase
    .from('profile_expertise')
    .select('id')
    .eq('profile_id', xpert_id);

  if (data?.length === 0) {
    const { error } = await supabase
      .from('profile_expertise')
      .insert({ ...rest, profile_id: xpert_id });

    if (error) {
      console.error('Error inserting profile expertise:', error);
      return { error: error.message };
    } else {
      return { error: null };
    }
  } else {
    const { error: errorUpdate } = await supabase
      .from('profile_expertise')
      .update(rest)
      .eq('profile_id', xpert_id);

    if (error) {
      console.error('Error updating profile expertise:', error);
      return { error: error.message };
    } else {
      return { error: null };
    }
  }
};

export const updateProfile = async ({
  xpert_id,
  newData,
}: {
  xpert_id: string;
  newData: Partial<Record<keyof DBProfile, any>>[];
}) => {
  const supabase = await createSupabaseAppServerClient();
  const transformedData = transformArray(newData);

  const { error } = await supabase
    .from('profile')
    .update(transformedData)
    .eq('id', xpert_id);

  if (error) {
    console.error('Error updating profile expertise:', error);
    return { error: error.message };
  } else {
    return { error: null };
  }
};

export const updateProfileStatus = async ({
  xpert_id,
  newData,
}: {
  xpert_id: string;
  newData: Partial<Record<keyof DBProfileStatus, any>>[];
}) => {
  const supabase = await createSupabaseAppServerClient();
  const transformedData = transformArray(newData);

  const { data, error } = await supabase
    .from('profile_status')
    .select('id')
    .eq('profile_id', xpert_id);

  if (data?.length === 0) {
    const { error } = await supabase
      .from('profile_status')
      .insert({ ...transformedData, profile_id: xpert_id });

    if (error) {
      console.error('Error inserting profile status:', error);
      return { error: error.message };
    } else {
      return { error: null };
    }
  }

  const { error: errorUpdate } = await supabase
    .from('profile_status')
    .update(transformedData)
    .eq('profile_id', xpert_id);

  if (errorUpdate) {
    console.error('Error updating profile status:', errorUpdate);
    return { error: errorUpdate.message };
  } else {
    return { error: null };
  }
};

export const updateProfileMission = async ({
  xpert_id,
  newData,
}: {
  xpert_id: string;
  newData: Partial<Record<keyof DBProfileMission, any>>[];
}) => {
  const supabase = await createSupabaseAppServerClient();

  const transformedData = transformArray(newData);

  const { data, error } = await supabase
    .from('profile_mission')
    .select('id')
    .eq('profile_id', xpert_id);

  if (data?.length === 0) {
    const { error } = await supabase
      .from('profile_mission')
      .insert({ ...transformedData, profile_id: xpert_id });

    if (error) {
      console.error('Error inserting profile mission:', error);
      return { error: error.message };
    } else {
      return { error: null };
    }
  } else {
    const { error: errorUpdate } = await supabase
      .from('profile_mission')
      .update(transformedData)
      .eq('profile_id', xpert_id);

    if (errorUpdate) {
      console.error('Error updating profile expertise:', errorUpdate);
      return { error: errorUpdate.message };
    } else {
      return { error: null };
    }
  }
};
