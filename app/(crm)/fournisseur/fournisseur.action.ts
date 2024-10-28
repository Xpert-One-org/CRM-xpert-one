'use server';

import { limitFournisseur } from '@/data/constant';
import type { DBFournisseur } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getSpecificFournisseur = async (
  fournisseurId: string
): Promise<DBFournisseur | null> => {
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error } = await supabase
      .from('profile')
      .select('*, mission!mission_created_by_fkey(*)')
      .eq('generated_id', fournisseurId)
      .eq('role', 'company')
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
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, count, error } = await supabase
      .from('profile')
      .select('*, mission!mission_created_by_fkey(*)', { count: 'exact' })
      .eq('role', 'company')
      .order('generated_id', { ascending: true })
      .range(offset, offset + limitFournisseur - 1);
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return { data, count };
  }

  return { data: [], count: null };
};
