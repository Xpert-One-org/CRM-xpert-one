'use server';

import { limitFournisseur } from '@/data/constant';
import type {
  DBFournisseur,
  DBProfile,
  DBProfileMission,
  DBProfileStatus,
} from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { transformArray } from '@/lib/utils';

export const getSpecificFournisseur = async (
  fournisseurId: string
): Promise<DBFournisseur | null> => {
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: userProfile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!userProfile) return null;

  const isAdmin = userProfile.role === 'admin';

  let query = supabase
    .from('profile')
    .select('*, mission!mission_created_by_fkey(*), profile_status(*)')
    .eq('generated_id', fournisseurId)
    .eq('role', 'company');

  if (!isAdmin) {
    query = query.or(
      `affected_referent_id.eq.${authUser.id},affected_referent_id.in.(${supabase
        .from('profile')
        .select('id')
        .eq('collaborator_is_absent', true)
        .eq('collaborator_replacement_id', authUser.id)})`
    );
  }

  const { data, error } = await query.single();

  if (error || !data) {
    console.error('Error fetching specific Fournisseur:', error);
    return null;
  }

  // Si le fournisseur a un référent, récupérons ses informations
  let referent = null;
  if (data.affected_referent_id) {
    const { data: referentData } = await supabase
      .from('profile')
      .select('firstname, lastname')
      .eq('id', data.affected_referent_id)
      .single();

    if (referentData) {
      referent = {
        firstname: referentData.firstname,
        lastname: referentData.lastname,
      };
    }
  }

  // Transformation pour assurer la compatibilité des types
  const typedData = {
    ...data,
    referent,
  } as unknown as DBFournisseur;

  return typedData;
};

export const getAllFournisseurs = async ({
  offset,
}: {
  offset: number;
}): Promise<{ data: DBFournisseur[]; count: number | null }> => {
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return { data: [], count: null };

  const { data: userProfile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!userProfile) return { data: [], count: null };

  const isAdmin = userProfile.role === 'admin';

  // Si non admin, on récupère d'abord les IDs des référents absents
  let referentsAbsentsIds: string[] = [];
  if (!isAdmin) {
    const { data: referentsAbsents } = await supabase
      .from('profile')
      .select('id')
      .eq('collaborator_is_absent', true)
      .eq('collaborator_replacement_id', authUser.id);

    referentsAbsentsIds = referentsAbsents?.map((ref) => ref.id) || [];
  }

  let query = supabase
    .from('profile')
    .select('*, mission!mission_created_by_fkey(*), profile_status(*)', {
      count: 'exact',
    })
    .eq('role', 'company');

  if (!isAdmin) {
    if (referentsAbsentsIds.length > 0) {
      query = query.or(
        `affected_referent_id.eq.${authUser.id},affected_referent_id.in.(${referentsAbsentsIds.join(
          ','
        )})`
      );
    } else {
      query = query.eq('affected_referent_id', authUser.id);
    }
  }

  query = query.order('created_at', { ascending: false });

  const { data, count, error } = await query.range(
    offset,
    offset + limitFournisseur - 1
  );

  if (error) {
    console.error('Error fetching Fournisseurs:', error);
    return { data: [], count: null };
  }

  // Récupérer tous les IDs des référents uniques
  const referentIds = data
    .map((item) => item.affected_referent_id)
    .filter((id): id is string => id !== null && id !== undefined);

  const uniqueReferentIds = Array.from(new Set(referentIds));

  // Récupérer les informations de tous les référents en une seule requête
  let referentsMap: Record<
    string,
    { firstname: string | null; lastname: string | null }
  > = {};

  if (uniqueReferentIds.length > 0) {
    const { data: referentsData } = await supabase
      .from('profile')
      .select('id, firstname, lastname')
      .in('id', uniqueReferentIds);

    if (referentsData) {
      referentsMap = referentsData.reduce(
        (acc, ref) => {
          acc[ref.id] = { firstname: ref.firstname, lastname: ref.lastname };
          return acc;
        },
        {} as Record<
          string,
          { firstname: string | null; lastname: string | null }
        >
      );
    }
  }

  // Transformation pour assurer la compatibilité des types
  const typedData = data.map((item) => {
    return {
      ...item,
      referent:
        item.affected_referent_id && referentsMap[item.affected_referent_id]
          ? referentsMap[item.affected_referent_id]
          : null,
    };
  }) as unknown as DBFournisseur[];

  return { data: typedData, count };
};

export const deleteFournisseur = async ({
  fournisseurId,
  fournisseurGeneratedId,
  reason,
  fournisseurEmail,
  fournisseurFirstName,
  fournisseurLastName,
}: {
  fournisseurId: string;
  fournisseurGeneratedId: string;
  reason: string;
  fournisseurEmail: string | null;
  fournisseurFirstName: string | null;
  fournisseurLastName: string | null;
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
        deleted_profile_generated_id: fournisseurGeneratedId,
        deleted_by: user.id,
        reason: reason,
        deleted_at: new Date().toISOString(),
        email: fournisseurEmail,
        firstname: fournisseurFirstName,
        lastname: fournisseurLastName,
      });

    if (insertError) throw insertError;

    const { error: deleteError } =
      await supabase.auth.admin.deleteUser(fournisseurId);
    if (deleteError) throw deleteError;

    return { data: null };
  } catch (error) {
    console.error('Error in deleteFournisseur:', error);
    return {
      errorMessage: {
        message: 'Erreur lors de la suppression du fournisseur',
        code: 'delete_error',
      },
    };
  }
};

export const updateProfile = async ({
  fournisseur_id,
  newData,
}: {
  fournisseur_id: string;
  newData: Partial<Record<keyof DBProfile, any>>[];
}) => {
  const supabase = await createSupabaseAppServerClient();
  const transformedData = transformArray(newData);

  const { error } = await supabase
    .from('profile')
    .update(transformedData)
    .eq('id', fournisseur_id);

  if (error) {
    console.error('Error updating profile:', error);
    return { error: error.message };
  } else {
    return { error: null };
  }
};

export const updateProfileStatus = async ({
  fournisseur_id,
  newData,
}: {
  fournisseur_id: string;
  newData: Partial<Record<keyof DBProfileStatus, any>>[];
}) => {
  const supabase = await createSupabaseAppServerClient();
  const transformedData = transformArray(newData);

  const { data, error } = await supabase
    .from('profile_status')
    .select('id')
    .eq('profile_id', fournisseur_id);

  if (data?.length === 0) {
    const { error } = await supabase
      .from('profile_status')
      .insert({ ...transformedData, profile_id: fournisseur_id });

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
    .eq('profile_id', fournisseur_id);

  if (errorUpdate) {
    console.error('Error updating profile status:', errorUpdate);
    return { error: errorUpdate.message };
  } else {
    return { error: null };
  }
};

export const updateProfileMission = async ({
  fournisseur_id,
  newData,
}: {
  fournisseur_id: string;
  newData: Partial<Record<keyof DBProfileMission, any>>[];
}) => {
  const supabase = await createSupabaseAppServerClient();
  const transformedData = transformArray(newData);

  const { data, error } = await supabase
    .from('profile_mission')
    .select('id')
    .eq('profile_id', fournisseur_id);

  if (data?.length === 0) {
    const { error } = await supabase
      .from('profile_mission')
      .insert({ ...transformedData, profile_id: fournisseur_id });

    if (error) {
      console.error('Error inserting profile mission:', error);
      return { error: error.message };
    } else {
      return { error: null };
    }
  }

  const { error: errorUpdate } = await supabase
    .from('profile_mission')
    .update(transformedData)
    .eq('profile_id', fournisseur_id);

  if (errorUpdate) {
    console.error('Error updating profile mission:', errorUpdate);
    return { error: errorUpdate.message };
  } else {
    return { error: null };
  }
};
