'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getInProgressMissionsCount = async () => {
  const supabase = createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .select('*, mission_application(*)');

  if (error) {
    throw error;
  }

  return { data };
};
