'use server';

import type { DBProfile } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getLastSignUpNewUsersWeek = async () => {
  const supabase = createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('profile')
    .select('*')
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
};
