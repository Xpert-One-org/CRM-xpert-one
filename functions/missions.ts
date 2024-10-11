'use server';
import type { DBMission } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getMissionState = async (state: string): Promise<DBMission[]> => {
  const supabase = createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    let query = supabase.from('mission').select('*');

    if (state === 'open') {
      query = query.in('state', ['open', 'open_all']);
    } else if (state === 'to_validate') {
      query = query.in('state', ['to_validate', 'open_all_to_validate']);
    } else {
      query = query.eq('state', state);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return data;
  }
  return [];
};

export const updateMissionState = async (missionId: string, state: string) => {
  const supabase = createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .update({ state })
    .eq('id', missionId)
    .select('*');

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return { data: data![0], error: error };
};
