'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getExpertises = async () => {
  const supabase = createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('expertises')
    .select('label, value');

  if (error) {
    console.error('Error fetching expertises:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching expertises:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
