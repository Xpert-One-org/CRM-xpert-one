'use server';
import type { DBProfile } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getNewUsersLastMonth = async (role: string) => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    const query = supabase
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
      .order('created_at', { ascending: false });

    if (role === 'xpert') {
      query.gt('totale_progression', 50);
    }

    const { data, error } = await query;

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

export const updateUserWelcomeCall = async ({
  user_id,
  value,
}: {
  user_id: string;
  value: boolean;
}) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('profile')
    .update({ get_welcome_call: !value })
    .eq('id', user_id);

  if (error) {
    console.log('error', error);
    throw error;
  }

  return { data, error };
};
