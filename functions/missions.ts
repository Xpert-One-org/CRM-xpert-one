'use server';
import type {
  DBMission,
  DBMissionState,
  ReasonMissionDeletion,
} from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export const getAllMissions = async (
  page: number = 1,
  limit: number = 10,
  options?: {
    sortBy?: {
      column: string;
      ascending: boolean;
      nullsLast?: boolean;
    };
    states?: DBMissionState[];
  }
): Promise<{ missions: DBMission[]; total: number }> => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    throw new Error('User not found');
  }

  const offset = (page - 1) * limit;

  let query = supabase.from('mission').select('*', {
    count: 'exact',
    head: true,
  });

  // Appliquer le filtre d'état si spécifié
  if (options?.states) {
    query = query.in('state', options.states);
  }

  const { count: total } = await query;

  // Construire la requête principale
  let mainQuery = supabase.from('mission').select(
    `
      *,
      referent:profile!mission_affected_referent_id_fkey(id, firstname, lastname, mobile, fix, email),
      xpert:profile!mission_xpert_associated_id_fkey(
        *,
        profile_status (
          status
        )
      ),
      supplier:profile!mission_created_by_fkey(*),
      checkpoints:mission_checkpoints(*)
    `
  );

  const { data: userData } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user?.id ?? '')
    .single();

  if (userData && userData.role !== 'admin') {
    mainQuery = mainQuery.eq('affected_referent_id', userData.id);
  }

  // Appliquer le filtre d'état si spécifié
  if (options?.states) {
    mainQuery = mainQuery.in('state', options.states);
  }

  // Appliquer le tri si spécifié
  if (options?.sortBy) {
    mainQuery = mainQuery.order(options.sortBy.column, {
      ascending: options.sortBy.ascending,
      nullsFirst: !options.sortBy.nullsLast,
    });
  }

  // Appliquer la pagination
  mainQuery = mainQuery.range(offset, offset + limit - 1);

  const { data, error } = await mainQuery;

  if (error) {
    console.error('Query error:', error);
    throw new Error(error.message);
  }

  const missionsWithCheckpoints = data?.map((mission) => ({
    ...mission,
    checkpoints: mission.checkpoints ? [mission.checkpoints] : [],
  }));

  return {
    missions: missionsWithCheckpoints || [],
    total: total || 0,
  };
};

export const getMissionState = async (
  state: DBMissionState
): Promise<DBMission[]> => {
  const supabase = await createSupabaseAppServerClient();
  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    let query = supabase.from('mission').select(`
        *,
              referent:profile!mission_affected_referent_id_fkey(id, firstname, lastname, mobile, fix, email),

        xpert:profile!mission_xpert_associated_id_fkey(
          *
        ), 
        supplier:profile!mission_created_by_fkey(*),
        checkpoints:mission_checkpoints(*)
      `);

    if (state === 'open') {
      query = query.in('state', ['open', 'open_all']);
    } else if (state === 'in_process') {
      query = query.in('state', [
        'in_process',
        'open_all_to_validate',
        'to_validate',
      ]);
    } else if (state === 'deleted') {
      query = query.in('state', ['refused', 'deleted']);
    } else {
      query = query.eq('state', state);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Transforme les checkpoints en tableau
    const missionsWithCheckpoints = data?.map((mission) => ({
      ...mission,
      checkpoints: mission.checkpoints ? [mission.checkpoints] : [],
    }));

    return missionsWithCheckpoints;
  }
  return [];
};

export const searchMission = async (missionId: string) => {
  const supabase = await createSupabaseAppServerClient();

  let query = supabase.from('mission').select('mission_number');

  // // Filtrer par état open ou open_all
  // query = query.in('state', ['open', 'open_all']);

  if (missionId) {
    query = query.ilike('mission_number', `%${missionId}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }
  return { data };
};

export const getLastMissionNumber = async () => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .select('mission_number')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { data: data.mission_number };
};
export const updateMissionState = async (
  missionId: string,
  state: DBMissionState,
  reason_deletion?: ReasonMissionDeletion,
  detail_deletion?: string
) => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .update({ state, reason_deletion, detail_deletion })
    .eq('id', missionId)
    .select('*');

  if (error) {
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

export const deleteMission = async (
  missionId: number,
  reason: ReasonMissionDeletion
) => {
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
    .update({
      state: 'deleted',
      reason_deletion: reason,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', missionId);

  if (errorMission) {
    return { errorMission };
  }

  return { error: null };
};
