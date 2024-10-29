'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getPosts = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase.from('posts').select('label, value');

  if (error) {
    console.error('Error fetching posts:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching posts:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
