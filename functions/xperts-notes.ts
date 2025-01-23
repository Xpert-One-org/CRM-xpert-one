// app/(crm)/xpert/notes.actions.ts
'use server';

import type { DBXpertNote } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

// Créer une nouvelle note
export const createNote = async (xpertId: string, content: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }

  const { data: note, error } = await supabase
    .from('xpert_notes')
    .insert({
      xpert_id: xpertId,
      content: content,
      created_by: user.id,
    })
    .select(
      `
      *,
      author:profile!xpert_notes_created_by_fkey(
        firstname,
        lastname
      )
    `
    )
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: note, error: null };
};

// Récupérer toutes les notes d'un xpert
export const getNotes = async (xpertId: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { data: notes, error } = await supabase
    .from('xpert_notes')
    .select(
      `
      *,
      author:profile!xpert_notes_created_by_fkey(
        firstname,
        lastname
      )
    `
    )
    .eq('xpert_id', xpertId)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: notes, error: null };
};

// Mettre à jour une note
export const updateNote = async (noteId: number, content: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { data: note, error } = await supabase
    .from('xpert_notes')
    .update({ content })
    .eq('id', noteId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: note, error: null };
};

// Supprimer une note
export const deleteNote = async (noteId: number) => {
  const supabase = await createSupabaseAppServerClient();

  const { error } = await supabase
    .from('xpert_notes')
    .delete()
    .eq('id', noteId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
};
