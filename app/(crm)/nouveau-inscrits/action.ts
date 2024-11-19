'use server';
import type { DBProfile } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getNewUsersLastMonth = async (role: string) => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('role', role)
      .gte(
        'created_at',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleString(
          'en-US',
          {
            timeZone: 'Europe/Paris',
          }
        )
      )
      .gt('totale_progression', 50)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newUsersLastMonth = data.filter(
      (user: DBProfile) => new Date(user.created_at) > lastMonth
    );

    return { newUsersLastMonth };
  }

  return { newUsersLastMonth: [] };
};
