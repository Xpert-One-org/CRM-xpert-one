'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getSectors = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase.from('sectors').select('label, value');

  if (error) {
    console.error('Error fetching sectors:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching sectors:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
