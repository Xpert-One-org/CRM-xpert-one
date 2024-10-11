'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getMissionDetails = async (missionId: string) => {
  const supabase = createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .select('*')
    .eq('mission_number', missionId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data[0];
};
