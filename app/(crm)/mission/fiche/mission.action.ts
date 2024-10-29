'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getMissionDetails = async (missionId: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .select(
      '*, xpert:profile!mission_xpert_associated_id_fkey(*), supplier:profile!mission_created_by_fkey(*)'
    )

    .eq('mission_number', missionId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data[0];
};
