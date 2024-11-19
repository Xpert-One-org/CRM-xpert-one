'use server';
import type { DBMission, DBMissionState } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getMissionState = async (
  state: DBMissionState
): Promise<DBMission[]> => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    let query = supabase
      .from('mission')
      .select(
        '*, xpert:profile!mission_xpert_associated_id_fkey(*), supplier:profile!mission_created_by_fkey(*)'
      );

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

export const searchMission = async (missionId: string) => {
  const supabase = await createSupabaseAppServerClient();

  let query = supabase.from('mission').select('mission_number');

  if (missionId) {
    query = query.ilike('mission_number', `%${missionId}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return { data };
};

export const updateMissionState = async (
  missionId: string,
  state: DBMissionState
) => {
  const supabase = await createSupabaseAppServerClient();

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

export const insertMission = async ({ mission }: { mission: any }) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }

  const { error } = await supabase.from('mission').insert([mission]);

  if (error) {
    return { error };
  }
  return { error: null };
};

export const deleteMission = async (missionId: number, reason: string) => {
  const supabase = await createSupabaseAppServerClient();

  //! maybe later we will add table called history_mission
  //! to keep history queries of the mission

  // const { error: errorMissionsCanceled } =
  //   await supabase.from('history_mission').insert({
  //     mission_id: missionId,
  //     reason,
  //     comment,
  //     created_at: new Date().toISOString(),
  //   });

  const { error: errorMission } = await supabase
    .from('mission')
    .delete()
    .eq('id', missionId);

  if (errorMission) {
    return { errorMission };
  }

  return { error: null };
};
