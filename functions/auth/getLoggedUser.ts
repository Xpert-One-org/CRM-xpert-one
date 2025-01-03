'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getLoggedUser = async () => {
  const supabase = await createSupabaseAppServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    throw new Error('User not authenticated');
  }

  const { data: userData } = await supabase
    .from('profile')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!userData) {
    throw new Error('User not found');
  }

  return userData;
};
