'use server';

import type { DBSubject } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getSubjects = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('subjects')
    .select('label, value');

  if (error) {
    console.error('Error fetching subjects:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching subjects:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};

export const insertSubject = async (subject: DBSubject) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('subjects')
    .insert({
      label: subject.label,
      value: subject.value,
      json_key: subject.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting subject:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
