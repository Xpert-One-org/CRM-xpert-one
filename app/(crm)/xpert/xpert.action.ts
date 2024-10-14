'use server';

import type { DBXpert } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getAllXperts = async (): Promise<DBXpert[]> => {
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error } = await supabase
      .from('profile')
      .select(
        `
        *,
        profile_mission(*),
        mission!mission_created_by_fkey(*),
        profile_status(*),
        profile_expertise(*)
      `
      )
      .eq('role', 'xpert');

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }

  return [];
};
