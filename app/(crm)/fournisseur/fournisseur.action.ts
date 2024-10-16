'use server';

import type { DBFournisseur } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getAllFournisseurs = async (): Promise<DBFournisseur[]> => {
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error } = await supabase
      .from('profile')
      .select('*, mission!mission_created_by_fkey(*)')
      .eq('role', 'company');

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }

  return [];
};
