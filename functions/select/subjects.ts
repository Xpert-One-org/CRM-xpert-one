'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getSubjects = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('label, value');

  if (error) {
    console.error('Error fetching subjects:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching subjects:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
