'use server';

import type { ColumnStatus, DBMatchedXpert } from '@/types/typesDb';
import type { DBMission } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';

export async function getXpertsSelection(missionId: number) {
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const isAdmin = await checkAuthRole();
  if (isAdmin) {
    const { data, error } = await supabase
      .from('selection_matching')
      .select(
        `
      *,
      xpert:profile!selection_matching_xpert_id_fkey (
        firstname,
        lastname,
        generated_id
      )
      `
      )
      .eq('mission_id', missionId);

    const sortedData = data?.sort(
      (a, b) => b.matching_score - a.matching_score
    );

    if (error) throw error;

    return sortedData;
  }
}

export async function sendMatchedXpertsToSelectionBoard(
  selectedXperts: DBMatchedXpert[],
  mission: DBMission,
  matchingScores: Record<string, number>
) {
  const supabase = await createSupabaseAppServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    const { data: existingMatches, error: fetchError } = await supabase
      .from('selection_matching')
      .select('xpert_id, mission_id')
      .eq('mission_id', mission.id)
      .in(
        'xpert_id',
        selectedXperts.map((x) => x.id)
      );

    if (fetchError) throw fetchError;

    const existingXpertIds = new Set(
      existingMatches?.map((m) => m.xpert_id) || []
    );

    const newXperts = selectedXperts.filter((x) => !existingXpertIds.has(x.id));
    const existingXperts = selectedXperts.filter((x) =>
      existingXpertIds.has(x.id)
    );

    const operations = [];

    if (newXperts.length > 0) {
      const insertData = newXperts.map((xpert) => ({
        mission_id: mission.id,
        xpert_id: xpert.id,
        created_by: user.id,
        matching_score: matchingScores[xpert.id],
        column_status: 'matching' as ColumnStatus,
      }));

      operations.push(supabase.from('selection_matching').insert(insertData));
    }

    if (existingXperts.length > 0) {
      operations.push(
        supabase
          .from('selection_matching')
          .update({
            column_status: 'matching',
            matching_score: existingXperts.map((x) => matchingScores[x.id])[0], // Update score if needed
            is_matched: true,
          })
          .eq('mission_id', mission.id)
          .in(
            'xpert_id',
            existingXperts.map((x) => x.id)
          )
      );
    }

    const results = await Promise.all(operations);

    const errors = results.map((r) => r.error).filter(Boolean);
    if (errors.length > 0) {
      throw errors[0];
    }

    return {
      data: results.map((r) => r.data).filter(Boolean),
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateSelectionMission(
  selectionId: number,
  columnStatus: ColumnStatus
) {
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  try {
    const { data, error } = await supabase
      .from('selection_matching')
      .update({ column_status: columnStatus })
      .eq('id', selectionId)
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (error) {
    return { data: null, error };
  }
}
