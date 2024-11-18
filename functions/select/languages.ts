'use server';

import type { DBLanguages } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getLanguages = async () => {
  const supabase = await createSupabaseAppServerClient();
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

export const insertLanguage = async (language: DBLanguages) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('languages')
    .insert({
      label: language.label,
      value: language.value,
      json_key: language.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting language:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
