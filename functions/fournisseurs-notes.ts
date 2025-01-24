// app/(crm)/fournisseur/notes.actions.ts
'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import type { DBFournisseurNote } from '@/types/typesDb';

export const createSupplierNote = async (
  supplierId: string,
  content: string
) => {
  const supabase = await createSupabaseAppServerClient();

  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }

  const { data: note, error } = await supabase
    .from('supplier_notes')
    .insert({
      supplier_id: supplierId,
      content: content,
      created_by: user.id,
    })
    .select(
      `
            *,
            author:profile!supplier_notes_created_by_fkey(
                firstname,
                lastname
            )
        `
    )
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: note as DBFournisseurNote, error: null };
};

export const getSupplierNotes = async (supplierId: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { data: notes, error } = await supabase
    .from('supplier_notes')
    .select(
      `
            *,
            author:profile!supplier_notes_created_by_fkey(
                firstname,
                lastname
            )
        `
    )
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data: notes as DBFournisseurNote[], error: null };
};

export const updateSupplierNote = async (noteId: number, content: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { data: note, error } = await supabase
    .from('supplier_notes')
    .update({ content })
    .eq('id', noteId)
    .select(
      `
            *,
            author:profile!supplier_notes_created_by_fkey(
                firstname,
                lastname
            )
        `
    )
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: note as DBFournisseurNote, error: null };
};

export const deleteSupplierNote = async (noteId: number) => {
  const supabase = await createSupabaseAppServerClient();

  const { error } = await supabase
    .from('supplier_notes')
    .delete()
    .eq('id', noteId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
};
