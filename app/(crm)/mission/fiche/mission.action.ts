'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import type { DBMission } from '@/types/typesDb';

export const getMissionDetails = async (missionId: string) => {
  const supabase = await createSupabaseAppServerClient();

  // Remplacer les tirets par des espaces pour correspondre au format en DB
  const formattedMissionId = missionId.replace(/-/g, ' ');

  const { data, error } = await supabase
    .from('mission')
    .select(
      '*, xpert:profile!mission_xpert_associated_id_fkey(*), supplier:profile!mission_created_by_fkey(*)'
    )
    .eq('mission_number', formattedMissionId);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Mission non trouvée');
  }

  return data[0];
};

type UpdateMissionData = Omit<Partial<DBMission>, 'id'> & {
  id?: never;
};

export const updateMission = async ({
  mission_id,
  newData,
}: {
  mission_id: number;
  newData: UpdateMissionData;
}) => {
  const supabase = await createSupabaseAppServerClient();

  // Validation du state si présent dans newData
  if (
    newData.state &&
    ![
      'to_validate',
      'open_all_to_validate',
      'open',
      'open_all',
      'in_progress',
      'deleted',
      'finished',
      'in_process',
      'validated',
      'refused',
    ].includes(newData.state)
  ) {
    return { error: 'État de mission invalide' };
  }

  const { error } = await supabase
    .from('mission')
    .update(newData)
    .eq('id', mission_id);

  if (error) {
    console.error('Error updating mission:', error);
    return { error: error.message };
  }

  return { error: null };
};
