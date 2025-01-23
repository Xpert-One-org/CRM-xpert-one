'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

// Récupérer toutes les notes d'un chat
export const getChatNotes = async (chatId: number) => {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    return { data: null, error: 'User not found' };
  }

  const { data, error } = await supabase
    .from('chat_notes')
    .select('*, author:profile(firstname, lastname)')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching chat notes:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

// Récupérer une note spécifique
export const getChatNote = async (noteId: number) => {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    return { data: null, error: 'User not found' };
  }

  const { data, error } = await supabase
    .from('chat_notes')
    .select('*, author:profile(firstname, lastname)')
    .eq('id', noteId)
    .single();

  if (error) {
    console.error('Error fetching chat note:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

// Créer une nouvelle note
export const createChatNote = async ({
  content,
  chatId,
}: {
  content: string;
  chatId: number;
}) => {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    return { data: null, error: 'User not found' };
  }

  const { data, error } = await supabase
    .from('chat_notes')
    .insert({
      content,
      chat_id: chatId,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat note:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

// Mettre à jour une note
export const updateChatNote = async ({
  noteId,
  content,
}: {
  noteId: number;
  content: string;
}) => {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    return { data: null, error: 'User not found' };
  }

  const { data, error } = await supabase
    .from('chat_notes')
    .update({ content })
    .eq('id', noteId)
    .select()
    .single();

  if (error) {
    console.error('Error updating chat note:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

// Supprimer une note
export const deleteChatNote = async (noteId: number) => {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;

  if (!user) {
    return { error: 'User not found' };
  }

  const { error } = await supabase.from('chat_notes').delete().eq('id', noteId);

  if (error) {
    console.error('Error deleting chat note:', error);
    return { error: error.message };
  }

  return { error: null };
};
