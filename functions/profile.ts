'use server';

import { minQuerySearch } from '@/data/constant';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getUserBase = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: 'User not found',
    };
  }
  const { data } = await supabase
    .from('profile')
    .select('role, firstname, avatar_url, lastname')
    .eq('id', user.id)
    .single();
  return {
    data,
    error: null,
  };
};

export const searchUsers = async (query: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: 'User not found',
    };
  }

  if (!query) {
    return {
      data: null,
      error: 'Query not found',
    };
  }

  const { data, error } = await supabase
    .from('profile')
    .select('firstname, lastname, generated_id, id')
    .or(
      `username.ilike.%${query}%,generated_id.ilike.%${query}%,firstname.ilike.%${query}%,lastname.ilike.%${query}%`
    );

  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

export const getUserChatProfile = async (userId: string | null) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return {
      data: null,
      error: 'User not found',
    };
  }
  if (userId) {
    const { data, error } = await supabase
      .from('profile')
      .select(
        'firstname, lastname, avatar_url, role, company_name, generated_id, username'
      )
      .eq('id', userId)
      .single();

    return { data, error };
  }
  return { data: null, error: 'User not found' };
};
