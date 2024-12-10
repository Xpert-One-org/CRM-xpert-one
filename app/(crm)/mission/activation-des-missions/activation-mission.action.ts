'use server';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function updateXpertAssociatedStatus(
  missionId: number,
  status: string
) {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .update({ xpert_associated_status: status })
    .eq('id', missionId)
    .select();

  if (error) {
    return { error };
  }

  return { data: data[0] };
}
