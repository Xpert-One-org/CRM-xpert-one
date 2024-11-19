'use server';

import type { DBExpertise } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getExpertises = async () => {
  const supabase = await createSupabaseAppServerClient();
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

export const insertExpertise = async (expertise: DBExpertise) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('expertises')
    .insert({
      label: expertise.label,
      value: expertise.value,
      json_key: expertise.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting expertise:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
