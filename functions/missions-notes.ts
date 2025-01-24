// app/(crm)/missions/notes.actions.ts
'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import type { DBMissionNote } from '@/types/typesDb';

export const createMissionNote = async (missionId: number, content: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }

  const { data: note, error } = await supabase
    .from('mission_notes')
    .insert({
      mission_id: missionId,
      content: content,
      created_by: user.id,
    })
    .select(
      `
            *,
            author:profile!mission_notes_created_by_fkey(
                firstname,
                lastname
            )
        `
    )
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: note as DBMissionNote, error: null };
};

export const getMissionNotes = async (missionId: number) => {
  const supabase = await createSupabaseAppServerClient();

  const { data: notes, error } = await supabase
    .from('mission_notes')
    .select(
      `
            *,
            author:profile!mission_notes_created_by_fkey(
                firstname,
                lastname
            )
        `
    )
    .eq('mission_id', missionId)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: notes as DBMissionNote[], error: null };
};

export const updateMissionNote = async (noteId: number, content: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { data: note, error } = await supabase
    .from('mission_notes')
    .update({ content })
    .eq('id', noteId)
    .select(
      `
            *,
            author:profile!mission_notes_created_by_fkey(
                firstname,
                lastname
            )
        `
    )
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: note as DBMissionNote, error: null };
};

export const deleteMissionNote = async (noteId: number) => {
  const supabase = await createSupabaseAppServerClient();

  const { error } = await supabase
    .from('mission_notes')
    .delete()
    .eq('id', noteId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
};
