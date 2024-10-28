'use server';

import type { DBProfile } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from './auth/checkRole';

export const getLastSignUpNewUsersWeek = async () => {
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    // get from last 7 days
    const { data, error } = await supabase
      .from('profile')
      .select('*')
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

    const newUsers = data.filter(
      (user: DBProfile) => new Date(user.created_at) > lastWeek
    );

    return { data: newUsers };
  }
};
