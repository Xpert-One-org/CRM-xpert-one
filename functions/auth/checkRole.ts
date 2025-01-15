'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const checkAuthRole = async () => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: userData, error: userError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single();
  if (userError) {
    throw userError;
  }

  if (
    userData.role !== 'admin' &&
    userData.role !== 'project_manager' &&
    userData.role !== 'intern' &&
    userData.role !== 'hr' &&
    userData.role !== 'adv'
  ) {
    throw new Error('User not authorized to access this resource');
  }

  return true;
};
