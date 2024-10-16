'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getLanguages = async () => {
  const supabase = createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('languages')
    .select('label, value');

  if (error) {
    console.error('Error fetching languages:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching languages:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
