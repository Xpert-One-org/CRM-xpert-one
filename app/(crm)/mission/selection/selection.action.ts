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
  matchingScores: Record<string, number>,
  allMatchingResults: DBMatchedXpert[]
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
      .eq('mission_id', mission.id);

    if (fetchError) throw fetchError;

    const existingXpertIds = new Set(
      existingMatches?.map((m) => m.xpert_id) || []
    );

    const newXperts = selectedXperts.filter((x) => !existingXpertIds.has(x.id));
    const existingXperts = allMatchingResults.filter((x) =>
      existingXpertIds.has(x.id)
    );

    const operations = [];

    if (newXperts.length > 0) {
      const insertData = newXperts.map((xpert) => ({
        mission_id: mission.id,
        xpert_id: xpert.id,
        matching_score: matchingScores[xpert.id],
        column_status: 'matching' as ColumnStatus,
        is_matched: true,
        is_candidate: false,
        created_at: new Date().toISOString(),
      }));

      operations.push(supabase.from('selection_matching').insert(insertData));
    }

    if (existingXperts.length > 0) {
      const updateOperations = existingXperts.map((xpert) =>
        supabase
          .from('selection_matching')
          .update({
            matching_score: xpert.matchingScore,
            is_matched: selectedXperts.some(
              (selected) => selected.id === xpert.id
            ),
          })
          .eq('mission_id', mission.id)
          .eq('xpert_id', xpert.id)
      );

      operations.push(...updateOperations);
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
  columnStatus: ColumnStatus,
  missionId: number,
  xpertId: string
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

    if (columnStatus === 'valides') {
      const { error } = await supabase
        .from('mission')
        .update({ xpert_associated_id: xpertId, state: 'in_progress' })
        .eq('id', missionId)
        .select();

      if (error) throw error;
      return { data: data[0], error: null };
    } else {
      const { error } = await supabase
        .from('mission')
        .update({
          xpert_associated_id: null,
          state: 'open',
          xpert_associated_status: null,
        })
        .eq('id', missionId)
        .select();

      if (error) throw error;
      return { data: data[0], error: null };
    }
  } catch (error) {
    return { data: null, error };
  }
}
