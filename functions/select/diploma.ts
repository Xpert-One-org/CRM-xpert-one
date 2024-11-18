'use server';

import type { DBDiploma } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getDiplomas = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('diplomas')
    .select('label, value');

  if (error) {
    console.error('Error fetching diplomas:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching diplomas:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};

export const insertDiploma = async (diploma: DBDiploma) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('diplomas')
    .insert({
      label: diploma.label,
      value: diploma.value,
      json_key: diploma.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting diploma:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
