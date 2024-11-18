'use server';

import type { DBJuridicStatus } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getJuridicStatus = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('juridic_status')
    .select('*')
    .neq('value', 'null');

  if (error) {
    console.error('Error fetching juridic status:', error);
    return { data: null, error: error };
  }

  return { data };
};

export const insertJuridicStatus = async (juridicStatus: DBJuridicStatus) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('juridic_status')
    .insert({
      label: juridicStatus.label,
      value: juridicStatus.value,
      json_key: juridicStatus.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting juridic status:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
