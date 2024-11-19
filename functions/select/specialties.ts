'use server';

import type { DBSpecialties } from '@/types/typesDb';
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

export const insertSpecialty = async (specialty: DBSpecialties) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('specialties')
    .insert({
      label: specialty.label,
      value: specialty.value,
      json_key: specialty.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting specialty:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
