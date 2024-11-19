'use server';

import type { DBPosts } from '@/types/typesDb';
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

export const insertPost = async (post: DBPosts) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({
      label: post.label,
      value: post.value,
      json_key: post.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting post:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
