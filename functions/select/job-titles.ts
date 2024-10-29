'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getJobTitles = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('job_titles')
    .select('label, value');

  if (error) {
    console.error('Error fetching job titles:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching job titles:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
