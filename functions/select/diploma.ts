'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getDiplomas = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('diplomas')
    .select('label, value');

  if (error) {
    console.error('Error fetching diplomas:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching diplomas:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
