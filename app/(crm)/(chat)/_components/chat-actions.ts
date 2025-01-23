'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function assignReferent(userId: string, referentId: string) {
  const supabase = await createSupabaseAppServerClient();

  const { error } = await supabase
    .from('profile')
    .update({ affected_referent_id: referentId })
    .eq('id', userId);

  if (error) {
    console.error('Error assigning referent:', error);
    throw new Error('Failed to assign referent');
  }

  return { success: true };
}

export async function getAvailableReferents() {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .in('role', ['admin', 'hr', 'intern', 'project_manager', 'adv']);

  if (error) {
    console.error('Error fetching referents:', error);
    throw new Error('Failed to fetch referents');
  }

  return data;
}
