'use server';

import { limitFournisseur } from '@/data/constant';
import type {
  DBFournisseur,
  DBProfile,
  DBProfileMission,
  DBProfileStatus,
} from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';
import { transformArray } from '@/lib/utils';

export const getSpecificFournisseur = async (
  fournisseurId: string
): Promise<DBFournisseur | null> => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error } = await supabase
      .from('profile')
      .select('*, mission!mission_created_by_fkey(*), profile_status(*)')
      .eq('generated_id', fournisseurId)
      .eq('role', 'company')
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

    return data;
  }

  return null;
};

export const getAllFournisseurs = async ({
  offset,
}: {
  offset: number;
}): Promise<{ data: DBFournisseur[]; count: number | null }> => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, count, error } = await supabase
      .from('profile')
      .select('*, mission!mission_created_by_fkey(*), profile_status(*)', {
        count: 'exact',
      })
      .eq('role', 'company')
      .order('created_at', { ascending: false })
      .range(offset, offset + limitFournisseur - 1);
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return { data, count };
  }

  return { data: [], count: null };
};

export const deleteFournisseur = async (
  fournisseurId: string,
  fournisseurGeneratedId: string,
  reason: string
) => {
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
