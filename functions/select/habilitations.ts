'use server';

import type { DBHabilitation } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getHabilitations = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('habilitations')
    .select('label, value');

  if (error) {
    console.error('Error fetching habilitations:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching habilitations:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};

export const insertHabilitation = async (habilitation: DBHabilitation) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('habilitations')
    .insert({
      label: habilitation.label,
      value: habilitation.value,
      json_key: habilitation.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting habilitation:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
