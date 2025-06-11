'use server';
import type {
  DBMission,
  DBMissionState,
  ReasonMissionDeletion,
} from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

// Fonction utilitaire pour vérifier l'accès aux missions
const checkMissionAccess = async (supabase: any) => {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return { isAuthorized: false };

  const { data: userProfile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!userProfile) return { isAuthorized: false };

  // Vérifier si l'utilisateur est un remplaçant
  const { data: isReplacement } = await supabase
    .from('profile')
    .select('id')
    .eq('collaborator_is_absent', true)
    .eq('collaborator_replacement_id', authUser.id);

  const isReplaceForSomeone = isReplacement && isReplacement.length > 0;
  console.log("L'utilisateur est-il remplaçant:", isReplaceForSomeone);

  // D'après l'image, admin et chargé d'affaires ont accès complet
  const isAdmin = userProfile.role === 'admin';
  const isChargeAffaires = userProfile.role === 'business';
  const isStagiaire = userProfile.role === 'intern';

  const hasWriteAccess = isAdmin || isChargeAffaires || isReplaceForSomeone;
  const hasReadAccess =
    isAdmin || isChargeAffaires || isStagiaire || isReplaceForSomeone;

  return {
    isAuthorized: true,
    isAdmin,
    isChargeAffaires,
    hasWriteAccess,
    hasReadAccess,
    userId: authUser.id,
    userProfile,
    role: userProfile.role,
    isReplaceForSomeone,
  };
};

// Fonction utilitaire pour récupérer les IDs des missions accessibles par un remplaçant
const getMissionsForReplacement = async (supabase: any, userId: string) => {
  console.log('getMissionsForReplacement appelé pour userId:', userId);

  // D'abord, trouver tous les référents pour lesquels l'utilisateur est remplaçant
  const { data: referentsReplaced } = await supabase
    .from('profile')
    .select('id')
    .eq('collaborator_is_absent', true)
    .eq('collaborator_replacement_id', userId);

  console.log('Référents remplacés:', referentsReplaced);

  if (!referentsReplaced || referentsReplaced.length === 0) {
    console.log('Aucun référent remplacé trouvé');
    return [];
  }

  // Récupérer les missions où ces référents sont assignés
  const referentIds = referentsReplaced.map((ref: { id: string }) => ref.id);
  console.log('IDs des référents remplacés:', referentIds);

  const { data: replacementMissions } = await supabase
    .from('mission')
    .select('id')
    .in('affected_referent_id', referentIds);

  console.log('Missions de remplacement trouvées:', replacementMissions);

  const missionIds =
    replacementMissions?.map((m: { id: number }) => m.id.toString()) || [];
  console.log('IDs des missions de remplacement:', missionIds);

  return missionIds;
};

// Fonction utilitaire pour vérifier si un utilisateur est remplaçant
const checkReplacementAccess = async (
  supabase: any,
  userId: string,
  referentId: string | null
) => {
  console.log(
    'checkReplacementAccess appelé pour userId:',
    userId,
    'referentId:',
    referentId
  );

  if (!referentId) return false;

  const { data: referent } = await supabase
    .from('profile')
    .select('collaborator_is_absent, collaborator_replacement_id')
    .eq('id', referentId)
    .single();

  console.log('Données du référent:', referent);

  const hasAccess =
    referent?.collaborator_is_absent &&
    referent?.collaborator_replacement_id === userId;
  console.log('A-t-il accès:', hasAccess);

  return hasAccess;
};

export const getSpecificMission = async (
  missionNumber: string
): Promise<{ data: DBMission }> => {
  const supabase = await createSupabaseAppServerClient();

  const { isAuthorized, hasReadAccess, userId } =
    await checkMissionAccess(supabase);
  if (!isAuthorized || !hasReadAccess) {
    throw new Error("Vous n'avez pas les droits nécessaires");
  }

  let query = supabase
    .from('mission')
    .select(
      `
      *,
      referent:profile!mission_affected_referent_id_fkey(id, firstname, lastname, mobile, fix, email, collaborator_is_absent, collaborator_replacement_id),
      xpert:profile!mission_xpert_associated_id_fkey(
        *,
        profile_status (
          status
        )
      ),
      supplier:profile!mission_created_by_fkey(*),
      checkpoints:mission_checkpoints(*),
      finance:mission_finance(*)
    `
    )
    .eq('mission_number', missionNumber);

  // Pour un non-admin, vérifier les droits d'accès
  if (!hasReadAccess) {
    // Récupérer les IDs des missions où l'utilisateur est remplaçant
    const replacementMissionIds = await getMissionsForReplacement(
      supabase,
      userId
    );

    if (replacementMissionIds.length > 0) {
      // Construire une condition OR qui inclut:
      // 1. L'utilisateur est le référent
      // 2. L'utilisateur est remplaçant d'un référent absent et la mission appartient à ce référent
      query = query.or(
        `affected_referent_id.eq.${userId},id.in.(${replacementMissionIds.join(
          ','
        )})`
      );
    } else {
      // Uniquement les missions où l'utilisateur est référent
      query = query.eq('affected_referent_id', userId);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Mission not found');
  }

  // Vérifier si l'utilisateur a accès à cette mission spécifique
  if (!hasReadAccess) {
    const missionData = data[0];
    const isReferent = missionData.affected_referent_id === userId;
    const isReplacement = await checkReplacementAccess(
      supabase,
      userId,
      missionData.affected_referent_id
    );

    if (!isReferent && !isReplacement) {
      throw new Error("Vous n'avez pas accès à cette mission");
    }
  }

  const mission = data[0];
  const processedMission = {
    ...mission,
    checkpoints: mission.checkpoints ? [mission.checkpoints] : [],
    finance: mission.finance ? mission.finance[0] : null,
  };

  return { data: processedMission };
};

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

  const {
    isAuthorized,
    hasReadAccess,
    userId,
    isAdmin,
    isChargeAffaires,
    isReplaceForSomeone,
  } = await checkMissionAccess(supabase);

  console.log(
    'getAllMissions - userId:',
    userId,
    'isAuthorized:',
    isAuthorized,
    'hasReadAccess:',
    hasReadAccess,
    'isRemplaçant:',
    isReplaceForSomeone
  );

  if (!isAuthorized) return { missions: [], total: 0 };

  let query = supabase.from('mission').select(
    `
      *,
      referent:profile!mission_affected_referent_id_fkey(id, firstname, lastname, mobile, fix, email, collaborator_is_absent, collaborator_replacement_id),
      xpert:profile!mission_xpert_associated_id_fkey(
        *,
        profile_status (
          status
        )
      ),
      supplier:profile!mission_created_by_fkey(*),
      checkpoints:mission_checkpoints(*),
      finance:mission_finance(*)
    `,
    { count: 'exact' }
  );

  // Seuls les admin et chargés d'affaires voient toutes les missions
  // Les autres (référents et remplaçants) doivent être filtrés
  if (!isAdmin && !isChargeAffaires) {
    console.log('Filtrage des missions pour utilisateur:', userId);

    // Récupérer les IDs des référents que l'utilisateur remplace
    const { data: referentsReplaced } = await supabase
      .from('profile')
      .select('id')
      .eq('collaborator_is_absent', true)
      .eq('collaborator_replacement_id', userId);

    console.log('Référents remplacés:', referentsReplaced);

    if (referentsReplaced && referentsReplaced.length > 0) {
      // Construire une condition OR pour:
      // 1. Missions où l'utilisateur est référent
      // 2. Missions où l'utilisateur remplace le référent
      const referentIds = referentsReplaced.map((r: any) => r.id);
      console.log('IDs des référents remplacés:', referentIds);

      // Si l'utilisateur est référent OU s'il remplace un référent qui est assigné à la mission
      query = query.or(
        `affected_referent_id.eq.${userId},affected_referent_id.in.(${referentIds.join(
          ','
        )})`
      );
    } else {
      // Si l'utilisateur n'est pas remplaçant, uniquement ses missions
      query = query.eq('affected_referent_id', userId);
    }
  }

  // Appliquer le filtre d'état si spécifié
  if (options?.states) {
    query = query.in('state', options.states);
  }

  // Récupérer le nombre total pour la pagination
  const { count } = await query;

  // Appliquer le tri si spécifié
  if (options?.sortBy) {
    query = query.order(options.sortBy.column, {
      ascending: options.sortBy.ascending,
      nullsFirst: !options.sortBy.nullsLast,
    });
  }

  // Calculer l'offset de pagination
  const offset = (page - 1) * limit;

  // Appliquer la pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    console.error('Query error:', error);
    throw new Error(error.message);
  }

  const missionsWithCheckpoints = data
    ?.map((mission) => {
      if (typeof mission !== 'object' || mission === null) {
        return null;
      }

      return {
        ...mission,
        checkpoints:
          'checkpoints' in mission && mission.checkpoints
            ? [mission.checkpoints]
            : [],
        finance:
          'finance' in mission && mission.finance ? mission.finance[0] : null,
      };
    })
    .filter(Boolean) as DBMission[];

  return {
    missions: missionsWithCheckpoints || [],
    total: count || 0,
  };
};

export const getMissionState = async (
  state: DBMissionState
): Promise<DBMission[]> => {
  const supabase = await createSupabaseAppServerClient();

  const {
    isAuthorized,
    hasReadAccess,
    userId,
    isAdmin,
    isChargeAffaires,
    isReplaceForSomeone,
  } = await checkMissionAccess(supabase);

  console.log(
    'getMissionState - userId:',
    userId,
    'isAuthorized:',
    isAuthorized,
    'hasReadAccess:',
    hasReadAccess,
    'isRemplaçant:',
    isReplaceForSomeone
  );

  if (!isAuthorized) return [];

  // Si l'utilisateur n'a pas les droits de lecture mais est remplaçant, continuer
  const shouldAccessMissions = hasReadAccess || isReplaceForSomeone;

  if (!shouldAccessMissions) return [];

  let query = supabase.from('mission').select(
    `
      *,
      referent:profile!mission_affected_referent_id_fkey(id, firstname, lastname, mobile, fix, email, collaborator_is_absent, collaborator_replacement_id),
      xpert:profile!mission_xpert_associated_id_fkey(
        *,
        profile_status (
          status
        )
      ),
      supplier:profile!mission_created_by_fkey(*),
      checkpoints:mission_checkpoints(*),
      finance:mission_finance(*)
    `
  );

  // Seuls les admin et chargés d'affaires voient toutes les missions
  // Les autres (référents et remplaçants) doivent être filtrés
  if (!isAdmin && !isChargeAffaires) {
    console.log('Filtrage des missions pour utilisateur:', userId);

    // Récupérer les IDs des référents que l'utilisateur remplace
    const { data: referentsReplaced } = await supabase
      .from('profile')
      .select('id')
      .eq('collaborator_is_absent', true)
      .eq('collaborator_replacement_id', userId);

    console.log('Référents remplacés:', referentsReplaced);

    if (referentsReplaced && referentsReplaced.length > 0) {
      // Construire une condition OR pour:
      // 1. Missions où l'utilisateur est référent
      // 2. Missions où l'utilisateur remplace le référent
      const referentIds = referentsReplaced.map((r: any) => r.id);
      console.log('IDs des référents remplacés:', referentIds);

      // Si l'utilisateur est référent OU s'il remplace un référent qui est assigné à la mission
      query = query.or(
        `affected_referent_id.eq.${userId},affected_referent_id.in.(${referentIds.join(
          ','
        )})`
      );
    } else {
      // Si l'utilisateur n'est pas remplaçant, uniquement ses missions
      query = query.eq('affected_referent_id', userId);
    }
  }

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

  const { data, error } = await query.order('start_date', {
    ascending: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  const missionsWithCheckpoints = data
    ?.map((mission) => {
      if (typeof mission !== 'object' || mission === null) {
        return null;
      }

      return {
        ...mission,
        checkpoints:
          'checkpoints' in mission && mission.checkpoints
            ? [mission.checkpoints]
            : [],
        finance:
          'finance' in mission && mission.finance ? mission.finance[0] : null,
      };
    })
    .filter(Boolean) as DBMission[];

  return missionsWithCheckpoints;
};

export const searchMission = async (
  missionId: string
): Promise<{ data: { mission_number: string | null }[] }> => {
  const supabase = await createSupabaseAppServerClient();

  const { isAuthorized, hasReadAccess, userId, isAdmin, isChargeAffaires } =
    await checkMissionAccess(supabase);

  if (!isAuthorized) return { data: [] };

  let query = supabase
    .from('mission')
    .select('mission_number')
    .ilike('mission_number', `%${missionId}%`);

  // Appliquer le même filtrage que dans getAllMissions et getMissionState
  if (!isAdmin && !isChargeAffaires) {
    console.log('Filtrage des missions pour utilisateur:', userId);

    // Récupérer les IDs des référents que l'utilisateur remplace
    const { data: referentsReplaced } = await supabase
      .from('profile')
      .select('id')
      .eq('collaborator_is_absent', true)
      .eq('collaborator_replacement_id', userId);

    console.log('Référents remplacés:', referentsReplaced);

    if (referentsReplaced && referentsReplaced.length > 0) {
      const referentIds = referentsReplaced.map((r: any) => r.id);
      console.log('IDs des référents remplacés:', referentIds);

      // Si l'utilisateur est référent OU s'il remplace un référent qui est assigné à la mission
      query = query.or(
        `affected_referent_id.eq.${userId},affected_referent_id.in.(${referentIds.join(
          ','
        )})`
      );
    } else {
      // Si l'utilisateur n'est pas remplaçant, uniquement ses missions
      query = query.eq('affected_referent_id', userId);
    }
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Query error:', error);
    throw new Error(error.message);
  }

  return { data };
};

export const getLastMissionNumber = async (isFacturation?: boolean) => {
  const supabase = await createSupabaseAppServerClient();

  let query = supabase.from('mission').select('mission_number');
  if (isFacturation) {
    query = query
      .in('state', ['open', 'open_all', 'in_progress'])
      .gte('start_date', new Date().toISOString())
      .lte('end_date', new Date().toISOString());
  }
  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Query error:', error);
    throw new Error(error.message);
  }

  return { data: data[0]?.mission_number };
};

export const updateMissionState = async (
  missionId: string,
  state: DBMissionState,
  reason_deletion?: ReasonMissionDeletion,
  detail_deletion?: string
) => {
  const supabase = await createSupabaseAppServerClient();

  const { isAuthorized, hasWriteAccess, userId } =
    await checkMissionAccess(supabase);
  if (!isAuthorized || !hasWriteAccess) {
    return { error: 'Non autorisé à modifier des missions' };
  }

  // Vérifier l'accès si non-admin
  if (!hasWriteAccess) {
    const { data } = await supabase
      .from('mission')
      .select(
        'affected_referent_id, referent:profile!mission_affected_referent_id_fkey(collaborator_is_absent, collaborator_replacement_id)'
      )
      .eq('id', missionId)
      .single();

    // Vérifier si l'utilisateur est le référent ou le remplaçant d'un référent absent
    const isReferent = data?.affected_referent_id === userId;
    const isReplacement = await checkReplacementAccess(
      supabase,
      userId,
      data?.affected_referent_id ?? null
    );

    if (!isReferent && !isReplacement) {
      return { error: 'Non autorisé à modifier cette mission' };
    }
  }

  const { data, error } = await supabase
    .from('mission')
    .update({ state, reason_deletion, detail_deletion })
    .eq('id', missionId)
    .select('*');

  if (error) {
    return { error: error.message };
  }

  return { data: data![0], error: null };
};

export const insertMission = async ({ mission }: { mission: any }) => {
  const supabase = await createSupabaseAppServerClient();

  const { isAuthorized, hasWriteAccess } = await checkMissionAccess(supabase);
  if (!isAuthorized || !hasWriteAccess) {
    return { error: 'Non autorisé à créer des missions' };
  }

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
  reason: ReasonMissionDeletion,
  detail_deletion?: string
) => {
  const supabase = await createSupabaseAppServerClient();

  const { isAuthorized, hasWriteAccess } = await checkMissionAccess(supabase);
  if (!isAuthorized || !hasWriteAccess) {
    return { error: 'Non autorisé à supprimer des missions' };
  }

  const { error: errorMission } = await supabase
    .from('mission')
    .update({
      state: 'deleted',
      reason_deletion: reason,
      detail_deletion: detail_deletion,
      deleted_at: new Date().toISOString(),
    })
    .eq('id', missionId);

  if (errorMission) {
    return { error: errorMission };
  }

  return { error: null };
};

export const cloneMission = async (mission: any) => {
  const supabase = await createSupabaseAppServerClient();

  const { isAuthorized, hasWriteAccess } = await checkMissionAccess(supabase);
  if (!isAuthorized || !hasWriteAccess) {
    return { error: 'Non autorisé à cloner des missions' };
  }

  const { finance, ...rest } = mission;
  const { data, error } = await supabase
    .from('mission')
    .insert(rest)
    .select()
    .single();

  if (error) {
    return { error };
  }

  if (!data) {
    return { error: 'Mission non créée' };
  }

  const { data: financeData, error: errorFinance } = await supabase
    .from('mission_finance')
    .update(finance)
    .eq('mission_id', data.id);

  if (errorFinance) {
    return { error: errorFinance };
  }

  return { data: data, error: null };
};
export async function updateShowOnWebsite(
  missionId: number,
  showOnWebsite: boolean
) {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .update({ show_on_website: showOnWebsite })
    .eq('id', missionId)
    .select();

  if (error) {
    return { error };
  }

  return { data: data[0] };
}
