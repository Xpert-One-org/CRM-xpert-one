'use server';

import type { DBNotification } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getChatNotification = async ({
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

  const { data: notifications, error } = await supabase
    .from('notification')
    .select('id, chat!inner(*, message!inner(*, profile(*)))')
    .neq('chat.type', 'forum')
    .or(`xpert_recipient_id.eq.${user.id},created_by.eq.${user.id}`, {
      referencedTable: 'chat',
    })
    .filter('chat.message.read_by', 'cs', `{${user.id}}`)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const returnData = notifications as unknown as DBNotification[];

  return { data: returnData, error };
};
