'use server';

import type { DBJobTitles } from '@/types/typesDb';
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

export const insertJobTitle = async (jobTitle: DBJobTitles) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('job_titles')
    .insert({
      label: jobTitle.label,
      value: jobTitle.value,
      image: jobTitle.image,
      json_key: jobTitle.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting job title:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
