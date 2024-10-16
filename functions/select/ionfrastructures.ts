'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getInfrastructures = async () => {
  const supabase = createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('infrastructures')
    .select('label, value');

  if (error) {
    console.error('Error fetching infrastructures:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching infrastructures:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
