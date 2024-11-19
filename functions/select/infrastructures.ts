'use server';

import type { DBInfrastructures } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getInfrastructures = async () => {
  const supabase = await createSupabaseAppServerClient();
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

export const insertInfrastructure = async (
  infrastructure: DBInfrastructures
) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('infrastructures')
    .insert({
      label: infrastructure.label,
      value: infrastructure.value,
      json_key: infrastructure.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting infrastructure:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
