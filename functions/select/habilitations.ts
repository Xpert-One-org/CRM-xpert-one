'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getHabilitations = async () => {
  const supabase = createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('habilitations')
    .select('label, value');

  if (error) {
    console.error('Error fetching habilitations:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching habilitations:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
