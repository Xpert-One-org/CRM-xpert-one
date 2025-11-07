'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const updateOrderMissionNumber = async (
  missionNumber: string,
  orderNumber: string
) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('mission')
    .update({ order_number: orderNumber })
    .eq('mission_number', missionNumber);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
