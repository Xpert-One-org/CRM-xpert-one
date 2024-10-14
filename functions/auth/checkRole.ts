'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const checkAuthRole = async () => {
  const supabase = createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;

  const { data: userData, error: userError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user?.id);

  if (userError) {
    throw userError;
  }

  if (userData[0].role !== 'admin') {
    throw new Error('User not authorized to access this resource');
  }

  return true;
};
