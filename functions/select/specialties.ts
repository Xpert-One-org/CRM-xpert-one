'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getSpecialties = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('specialties')
    .select('label, value');

  if (error) {
    console.error('Error fetching specialties:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching specialties:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
