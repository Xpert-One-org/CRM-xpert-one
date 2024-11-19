'use server';
import type { DBProfile } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getNewUsersLastWeek = async (role: string) => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('role', role)
      .gte(
        'created_at',
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('en-US', {
          timeZone: 'Europe/Paris',
        })
      )
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const newUsersLastWeek = data.filter(
      (user: DBProfile) => new Date(user.created_at) > lastWeek
    );

    return { newUsersLastWeek };
  }

  return { newUsersLastWeek: [] };
};
