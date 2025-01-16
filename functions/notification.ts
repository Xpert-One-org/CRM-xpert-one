'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getNotifications = async ({
  from = 0,
  to = 10,
}: {
  from?: number;
  to?: number;
}) => {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }

  const {
    data: notifications,
    error,
    count,
  } = await supabase
    .from('notification')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return { data: notifications, error, count };
};

export const deleteNotification = async (id: number) => {
  const supabase = await createSupabaseAppServerClient();
  const { error } = await supabase.from('notification').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
};
