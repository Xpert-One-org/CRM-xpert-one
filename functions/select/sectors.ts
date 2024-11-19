'use server';

import type { DBSectors } from '@/types/typesDb';
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

export const insertSector = async (sector: DBSectors) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('sectors')
    .insert({
      json_key: sector.json_key,
      label: sector.label,
      value: sector.value,
    })
    .select('*');

  if (error) {
    console.error('Error inserting sector:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
