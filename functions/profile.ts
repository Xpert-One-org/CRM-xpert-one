'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getUserBase = async () => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: 'User not found',
    };
  }
  const { data } = await supabase
    .from('profile')
    .select('role, firstname, avatar_url, lastname')
    .eq('id', user.id)
    .single();
  return {
    data,
    error: null,
  };
};
