'use server';

import type {
  ProfileDataPicked,
  UserData,
} from '@/components/dialogs/CreateXpertDialog';
import { limitXpert, limitXpertLastJobs } from '@/data/constant';
import { transformArray } from '@/lib/utils';
import type { AdminOpinionValue, FilterXpert } from '@/types/types';
import type {
  DBMission,
  DBMissionOptimized,
  DBProfile,
  DBProfileExperience,
  DBProfileExpertise,
  DBProfileMission,
  DBProfileStatus,
  DBUserAlerts,
  DBXpert,
  DBXpertLastPost,
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
    // D'abord récupérer le profile de base
    const { data, error } = await supabase
      .from('profile')
      .select(
        `
        *,
        profile_mission(*),
        mission:mission!xpert_associated_id(
          id,
          mission_number,
          job_title,
          job_title_other,
          state,
          description,
          created_at,
          start_date,
          end_date,
          xpert_associated_status,
          created_by,
          xpert_associated_id
        ),
        profile_status(*),
        profile_expertise(*),
        user_alerts(*)
      `
      )
      .eq('role', 'xpert')
      .eq('generated_id', xpertId)
      .single();

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    if (!data) {
      console.error('No data returned');
      return null;
    }

    // Requête séparée pour les expériences
    const { data: experiences, error: expError } = await supabase
      .from('profile_experience')
      .select('*')
      .eq('profile_id', data.id);

    if (expError) {
      console.error(expError);
      throw new Error(expError.message);
    }

    // Requête séparée pour les formations
    const { data: educations, error: eduError } = await supabase
      .from('profile_education')
      .select('*')
      .eq('profile_id', data.id);

    if (eduError) {
      console.error(eduError);
      throw new Error(eduError.message);
    }

    // Requête pour le référent
    const { data: referent, error: refError } = await supabase
      .from('profile')
      .select('firstname, id, lastname')
      .eq('id', data.affected_referent_id ?? '')
      .single();

    if (refError) {
      console.error(refError);
      // On ne throw pas d'erreur ici car le référent n'est pas critique
    }

    const { profile_expertise, ...rest } = data;

    return {
      ...rest,
      referent: referent ?? null,
      profile_expertise: profile_expertise
        ? {
            ...profile_expertise,
            experiences: experiences ?? [],
            educations: educations ?? [],
          }
        : null,
      user_alerts: data.user_alerts?.[0] || null,
      mission: data.mission as unknown as DBMission[],
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

// export const getAllXperts = async ({
//   offset,
// }: {
//   offset: number;
// }): Promise<{ data: DBXpert[]; count: number | null }> => {
//   const supabase = await createSupabaseAppServerClient();

//   const isAdmin = await checkAuthRole();

//   if (isAdmin) {
//     const { data, error, count } = await supabase
//       .from('profile')
//       .select(
//         `
//         *,
//         profile_mission(*),
//         referent:profile!profile_affected_referent_id_fkey(firstname, id, lastname),
//         experiences:profile_experience(*), educations:profile_education(*),
//         mission!mission_created_by_fkey(*),
//         profile_status(*),
//         profile_expertise(*)
//       `,
//         { count: 'exact' }
//       )
//       .eq('role', 'xpert')
//       .order('created_at', { ascending: false })
//       .range(offset, offset + limitXpert - 1);

//     if (error) {
//       console.error(error);
//       throw new Error(error.message);
//     }

//     if (!data) {
//       console.error('No data returned');
//       throw new Error('No data returned');
//     }

//     const processedData = data.map((profile) => {
//       const { experiences, educations, profile_expertise, ...rest } = profile;
//       return {
//         ...rest,

//         profile_expertise: {
//           ...profile_expertise,
//           experiences,
//           educations,
//         } as DBXpert['profile_expertise'],
//       };
//     });

//     return {
//       data: processedData,
//       count: count || 0,
//     };
//   }

//   return {
//     data: [],
//     count: null,
//   };
// };

export const getXpertsOptimized = async ({
  offset,
  filters,
}: {
  offset: number;
  filters?: FilterXpert;
}): Promise<{ data: DBXpertOptimized[]; count: number | null }> => {
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) {
    throw new Error("Vous n'êtes pas connecté");
  }

  const { data: userProfile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!userProfile) {
    throw new Error('Profil utilisateur non trouvé');
  }

  const isAdmin = userProfile.role === 'admin';

  // Récupération des IDs des XPERTs accessibles pour non-admin
  let allowedXpertIds: string[] = [];
  if (!isAdmin) {
    // XPERTs avec référent direct
    const { data: directXperts } = await supabase
      .from('profile')
      .select('id')
      .eq('affected_referent_id', authUser.id);

    // XPERTs avec utilisateur comme remplaçant
    const { data: replacementXperts } = await supabase
      .from('profile')
      .select('id, affected_referent_id')
      .eq('role', 'xpert')
      .in(
        'affected_referent_id',
        (
          await supabase
            .from('profile')
            .select('id')
            .eq('collaborator_is_absent', true)
            .eq('collaborator_replacement_id', authUser.id)
        ).data?.map((p) => p.id) || []
      );

    allowedXpertIds = [
      ...(directXperts?.map((x) => x.id) || []),
      ...(replacementXperts?.map((x) => x.id) || []),
    ];

    if (allowedXpertIds.length === 0) {
      return { data: [], count: 0 };
    }
  }

  let query = supabase
    .from('profile')
    .select(
      `
      firstname, lastname, id, country, generated_id, created_at, email,
      admin_opinion, cv_name, 
      profile_mission(availability, job_titles, sector), 
      profile_status(iam),
      profile_experience(post, post_other, sector), 
      mission:mission!xpert_associated_id(
        id,
        mission_number,
        job_title,
        job_title_other,
        state,
        description,
        created_at,
        start_date,
        end_date,
        xpert_associated_status,
        created_by,
        xpert_associated_id
      ),
      affected_referent_id,
      referent:profile!affected_referent_id(
        id,
        collaborator_is_absent,
        collaborator_replacement_id
      )
      `,
      { count: 'exact' }
    )
    .eq('role', 'xpert');

  // Restriction aux IDs autorisés pour non-admin
  if (!isAdmin) {
    query = query.in('id', allowedXpertIds);
  }

  // Filtres existants
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
    query = query.ilike('profile_mission.job_titles_search', `%${jobTitles}%`);
  }

  if (filters?.countries && filters.countries.length > 0) {
    query = query.in('country', filters.countries);
  }

  // Ajout des filtres manquants
  if (filters?.firstname) {
    query = query.ilike('firstname', `%${filters.firstname}%`);
  }

  if (filters?.lastname) {
    query = query.ilike('lastname', `%${filters.lastname}%`);
  }

  if (filters?.generated_id) {
    query = query.ilike('generated_id', `%${filters.generated_id}%`);
  }

  if (filters?.iam) {
    // S'assurer que profile_status existe avant de filtrer dessus
    query = query.not('profile_status', 'is', null);
    // Utiliser filter au lieu de eq pour le champ relationnel
    query = query.filter('profile_status.iam', 'eq', filters.iam);
  }

  if (filters?.adminOpinion) {
    query = query.eq('admin_opinion', filters.adminOpinion);
  }

  if (filters?.cv) {
    if (filters.cv === 'yes') {
      // Utilisation de l'API raw pour être explicite
      // On évite not is null pour utiliser une syntaxe plus directe
      query = query.filter('cv_name', 'not.is', null);
    } else if (filters.cv === 'no') {
      // Utilisation de l'API raw pour être explicite
      // On utilise l'opérateur is null directement
      query = query.filter('cv_name', 'is', null);
    }
  }

  if (filters?.sectors && filters.sectors.length > 0) {
    const validSectors = filters.sectors.filter((s) => s && s.trim() !== '');
    if (validSectors.length > 0) {
      // On cherche dans profile_mission.sector (tableau) ET profile_experience.sector (string)
      // Supabase ne supporte pas le .or() sur plusieurs tables jointes en une seule chaîne.
      // On récupère donc les IDs séparément.

      const { data: missionMatches } = await supabase
        .from('profile_mission')
        .select('profile_id')
        .overlaps('sector', validSectors);

      const { data: expMatches } = await supabase
        .from('profile_experience')
        .select('profile_id')
        .in('sector', validSectors);

      const sectorMatchedIds = Array.from(
        new Set([
          ...(missionMatches?.map((m) => m.profile_id) || []),
          ...(expMatches?.map((e) => e.profile_id) || []),
        ])
      );

      if (sectorMatchedIds.length > 0) {
        query = query.in('id', sectorMatchedIds);
      } else {
        // Aucun profil ne correspond aux secteurs demandés
        return { data: [], count: 0 };
      }
    }
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

  const { data, error, count } = await query.range(
    offset,
    offset + limitXpert - 1
  );

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const transformedData: DBXpertOptimized[] = data.map((xpert) => {
    const { profile_experience, mission, ...rest } = xpert;
    return {
      ...rest,
      profile_experience: profile_experience?.[0] || null,
      mission: (mission?.filter(Boolean) || []) as unknown as Pick<
        DBMissionOptimized,
        | 'xpert_associated_id'
        | 'id'
        | 'mission_number'
        | 'job_title'
        | 'job_title_other'
        | 'state'
        | 'description'
        | 'created_at'
        | 'start_date'
        | 'end_date'
        | 'xpert_associated_status'
        | 'created_by'
      >[],
      profile_mission: xpert.profile_mission || null,
      profile_status: xpert.profile_status || null,
    };
  });

  return {
    data: transformedData,
    count: count || 0,
  };
};

export const getXpertLastJobs = async ({
  offset,
}: {
  offset: number;
}): Promise<{
  data: DBXpertLastPost[];
  error: string | null;
  count: number | null;
}> => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    throw new Error("Vous n'êtes pas connecté");
  }

  const {
    data: uniqueJobs,
    error,
    count,
  } = await supabase
    .from('unique_posts_with_referents')
    .select('*', { count: 'exact' })
    .range(offset, offset + limitXpertLastJobs - 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: uniqueJobs,
    count: count || 0,
    error: null,
  };
};

export const getXpertIdByJobName = async (
  jobName: string
): Promise<{ data: { profile_id: string | null }[] }> => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('profile_experience')
    .select('profile_id')
    .or(`post.eq.${jobName},post_other.eq.${jobName}`)
    .eq('is_last', 'true');

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return {
    data: data,
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

  const { data, error } = await supabase.auth.admin.createUser({
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

  if (!data.user) {
    return {
      error: {
        message: "Erreur lors de la création de l'utilisateur",
        code: 'create_user_error',
      },
    };
  }

  const {
    address,
    company_name,
    city,
    civility,
    country,
    fix,
    how_did_you_hear_about_us,
    linkedin,
    postal_code,
    street_number,
  } = profile;

  let updateError: {
    message: string;
    code: string;
    details?: string;
    hint?: string;
  } | null = null;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const { error, data: updatedData } = await supabase
      .from('profile')
      .update({
        address,
        company_name,
        city,
        civility,
        country,
        fix,
        how_did_you_hear_about_us,
        linkedin,
        postal_code,
        street_number,
        role: role,
        mobile,
      })
      .eq('id', data.user.id)
      .select('id');

    if (error) {
      updateError = error;
      break;
    }

    if (updatedData && updatedData.length > 0) {
      updateError = null;
      break;
    }

    attempts++;
    if (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      updateError = {
        message:
          "Erreur: Le profil n'a pas pu être mis à jour après plusieurs tentatives. Veuillez contacter le support.",
        code: 'profile_update_timeout',
      };
    }
  }

  if (updateError) {
    return { error: { message: updateError.message, code: updateError.code } };
  }

  return { error: null };
};

export const deleteXpert = async ({
  xpertId,
  xpertGeneratedId,
  reason,
  xpertEmail,
  xpertFirstName,
  xpertLastName,
}: {
  xpertId: string;
  xpertGeneratedId: string;
  reason: string;
  xpertEmail: string | null;
  xpertFirstName: string | null;
  xpertLastName: string | null;
}) => {
  try {
    const supabase = await createSupabaseAppServerClient('admin');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Vous n'êtes pas connecté");

    const { error: insertError } = await supabase
      .from('profile_deleted')
      .insert({
        deleted_profile_generated_id: xpertGeneratedId,
        deleted_by: user.id,
        reason: reason,
        deleted_at: new Date().toISOString(),
        email: xpertEmail,
        firstname: xpertFirstName,
        lastname: xpertLastName,
        role: 'xpert',
      });

    if (insertError) throw insertError;

    const { error: deleteError } =
      await supabase.auth.admin.deleteUser(xpertId);
    if (deleteError) throw deleteError;

    return { data: null };
  } catch (error) {
    console.error('Error in deleteXpert:', error);
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

export const updateUserAlerts = async ({
  xpert_id,
  userAlerts,
}: {
  xpert_id: string;
  userAlerts: Partial<DBUserAlerts>;
}) => {
  const supabase = await createSupabaseAppServerClient();

  const { data } = await supabase
    .from('user_alerts')
    .select('*')
    .eq('user_id', xpert_id)
    .single();

  if (data) {
    return supabase
      .from('user_alerts')
      .update(userAlerts) // On utilise userAlerts ici
      .eq('user_id', xpert_id);
  } else {
    return supabase.from('user_alerts').insert({
      ...userAlerts, // Et ici
      user_id: xpert_id,
    });
  }
};

export const updateUserEmail = async ({
  userId,
  newEmail,
  oldEmail,
}: {
  userId: string;
  newEmail: string;
  oldEmail: string;
}) => {
  try {
    // Créer le client Supabase avec les droits admin
    const supabase = await createSupabaseAppServerClient('admin');

    // Vérifier que l'utilisateur actuel est admin
    const isAdmin = await checkAuthRole();
    if (!isAdmin) {
      return {
        error: {
          message: "Vous n'avez pas les droits pour effectuer cette action",
          code: 'not_authorized',
        },
      };
    }

    // Vérifier l'email actuel avant la mise à jour
    const { data: userBefore, error: userBeforeError } =
      await supabase.auth.admin.getUserById(userId);

    if (userBeforeError || !userBefore.user) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur:",
        userBeforeError
      );
      return {
        error: {
          message: "Impossible de récupérer l'utilisateur",
          code: 'user_fetch_failed',
        },
      };
    }

    // Tenter la mise à jour via API admin
    const { data, error: updateAuthError } =
      await supabase.auth.admin.updateUserById(userId, {
        email: newEmail,
        email_confirm: true,
      });

    if (updateAuthError || !data.user) {
      console.error(
        "Erreur lors de la mise à jour de l'email:",
        updateAuthError
      );
      return {
        error: {
          message: updateAuthError?.message || 'Échec de la mise à jour',
          code: updateAuthError?.code || 'update_failed',
        },
      };
    }

    // Vérifier réellement la mise à jour - ne pas faire confiance à la réponse initiale
    const { data: userAfter, error: userAfterError } =
      await supabase.auth.admin.getUserById(userId);

    if (userAfterError || !userAfter.user) {
      console.error(
        'Erreur lors de la vérification de la mise à jour:',
        userAfterError
      );
      return {
        error: {
          message: 'Impossible de vérifier la mise à jour',
          code: 'verification_failed',
        },
      };
    }

    // Vérification stricte que l'email a bien changé
    if (userAfter.user.email !== newEmail) {
      console.error(
        "ALERTE: L'email n'a pas été mis à jour dans auth malgré la réponse positive de l'API!"
      );

      // Essayons une approche alternative - méthode avec invite de réinitialisation de mot de passe
      try {
        // Cette approche peut fonctionner car elle utilise un autre chemin dans l'API Supabase
        const { error: inviteError } =
          await supabase.auth.admin.inviteUserByEmail(newEmail, {
            redirectTo: process.env.NEXT_PUBLIC_SITE_URL,
            data: {
              user_id: userId,
              email_migration: true,
            },
          });

        if (inviteError) {
          console.error('Échec de la méthode alternative:', inviteError);
          return {
            error: {
              message: "Échec de la mise à jour de l'email dans auth",
              code: 'auth_update_failed',
            },
          };
        }
      } catch (altError) {
        console.error('Exception lors de la méthode alternative:', altError);
        return {
          error: {
            message: "Échec de la mise à jour de l'email",
            code: 'update_failed',
          },
        };
      }
    }

    // Si nous arrivons ici, soit l'update a réussi, soit nous avons utilisé une méthode alternative
    // Mettons à jour la table profile
    const { error: updateProfileError } = await supabase
      .from('profile')
      .update({ email: newEmail })
      .eq('id', userId);

    if (updateProfileError) {
      console.error(
        'Erreur lors de la mise à jour du profil:',
        updateProfileError
      );
      return {
        error: {
          message: updateProfileError.message,
          code: updateProfileError.code,
        },
      };
    }

    // Notifications
    try {
      await supabase.auth.signInWithOtp({
        email: oldEmail,
        options: {
          emailRedirectTo: undefined,
          data: { type: 'email_changed_notification', newEmail },
        },
      });

      await supabase.auth.signInWithOtp({
        email: newEmail,
        options: {
          emailRedirectTo: undefined,
          data: { type: 'email_changed_confirmation', oldEmail },
        },
      });
    } catch (emailError) {
      console.error("Erreur lors de l'envoi des notifications:", emailError);
    }

    return { data: { success: true } };
  } catch (error) {
    console.error('Erreur globale:', error);
    return {
      error: {
        message: "Une erreur est survenue lors de la mise à jour de l'email",
        code: 'unknown_error',
      },
    };
  }
};

export const banXpert = async ({
  xpertId,
  reason,
}: {
  xpertId: string;
  reason: string;
}) => {
  try {
    const supabase = await createSupabaseAppServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        error: {
          message: "Vous n'êtes pas connecté",
          code: 'not_authenticated',
        },
      };
    }

    // Vérifier que l'utilisateur actuel est admin
    const { data: adminUser } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminUser.role !== 'admin') {
      return {
        error: {
          message: "Vous n'avez pas les droits pour effectuer cette action",
          code: 'not_authorized',
        },
      };
    }

    // Insérer l'entrée de bannissement
    const { error: insertError } = await supabase.from('profile_bans').insert({
      profile_id: xpertId,
      banned_by: user.id,
      reason,
      banned_at: new Date().toISOString(),
      is_active: true,
    });

    if (insertError) {
      console.error("Erreur lors de l'insertion du bannissement:", insertError);
      return {
        error: { message: insertError.message, code: insertError.code },
      };
    }

    // Mettre à jour le statut de profil pour indiquer que l'utilisateur est banni
    const { error: updateError } = await supabase
      .from('profile')
      .update({
        is_banned_from_community: true,
        community_banning_explanations: reason,
      })
      .eq('id', xpertId);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du profil:', updateError);
      return {
        error: { message: updateError.message, code: updateError.code },
      };
    }

    return { data: { success: true } };
  } catch (error: any) {
    console.error('Erreur générale lors du bannissement:', error);
    return {
      error: {
        message:
          error.message || 'Une erreur est survenue lors du bannissement',
        code: 'unknown_error',
      },
    };
  }
};

export const unbanXpert = async ({
  xpertId,
  banId,
}: {
  xpertId: string;
  banId: string;
}) => {
  try {
    const supabase = await createSupabaseAppServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        error: {
          message: "Vous n'êtes pas connecté",
          code: 'not_authenticated',
        },
      };
    }

    // Vérifier que l'utilisateur actuel est admin
    const { data: adminUser } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminUser || adminUser.role !== 'admin') {
      return {
        error: {
          message: "Vous n'avez pas les droits pour effectuer cette action",
          code: 'not_authorized',
        },
      };
    }

    // Mettre à jour l'entrée de bannissement
    const { error: updateBanError } = await supabase
      .from('profile_bans')
      .update({
        is_active: false,
        unbanned_at: new Date().toISOString(),
        unbanned_by: user.id,
      })
      .eq('id', banId)
      .eq('profile_id', xpertId);

    if (updateBanError) {
      console.error(
        'Erreur lors de la mise à jour du bannissement:',
        updateBanError
      );
      return {
        error: { message: updateBanError.message, code: updateBanError.code },
      };
    }

    // Mettre à jour le statut de profil
    const { error: updateProfileError } = await supabase
      .from('profile')
      .update({
        is_banned_from_community: false,
        community_banning_explanations: null,
      })
      .eq('id', xpertId);

    if (updateProfileError) {
      console.error(
        'Erreur lors de la mise à jour du profil:',
        updateProfileError
      );
      return {
        error: {
          message: updateProfileError.message,
          code: updateProfileError.code,
        },
      };
    }

    return { data: { success: true } };
  } catch (error: any) {
    console.error('Erreur générale lors du débannissement:', error);
    return {
      error: {
        message:
          error.message || 'Une erreur est survenue lors du débannissement',
        code: 'unknown_error',
      },
    };
  }
};
