'use server';

import type { Database } from '@/types/supabase';
import type { CheckpointField } from '@/types/types';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

type MissionCheckpoint =
  Database['public']['Tables']['mission_checkpoints']['Row'];

type ToggleResponse = {
  data: MissionCheckpoint | null;
  error: string | null;
};

export async function toggleMissionCheckpoint(
  missionId: number,
  checkpointField: CheckpointField
): Promise<ToggleResponse> {
  const supabase = await createSupabaseAppServerClient();

  // Get current value
  const { data: currentData, error: fetchError } = await supabase
    .from('mission_checkpoints')
    .select('*')
    .eq('mission_id', missionId)
    .single();

  console.log('currentData', currentData);
  if (fetchError) {
    console.error(fetchError);
    return { data: null, error: fetchError.message };
  }

  // Toggle the value
  const newValue = !currentData[checkpointField];

  // Update the checkpoint
  const { data, error: updateError } = await supabase
    .from('mission_checkpoints')
    .update({ [checkpointField]: newValue })
    .eq('mission_id', missionId)
    .select('*')
    .single();

  if (updateError) {
    return { data: null, error: updateError.message };
  }

  return { data, error: null };
}
