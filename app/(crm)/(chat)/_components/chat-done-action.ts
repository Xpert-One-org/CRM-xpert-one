'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function toggleChatDone(
  chatId: string
): Promise<{ success: boolean; isDone: boolean }> {
  try {
    const supabase = await createSupabaseAppServerClient();

    // D'abord on récupère l'état actuel
    const { data: currentChat, error: fetchError } = await supabase
      .from('chat')
      .select('is_done')
      .eq('id', chatId)
      .single();

    if (fetchError) {
      console.error('Error fetching chat:', fetchError);
      return { success: false, isDone: false };
    }

    // On toggle l'état
    const newDoneState = !currentChat.is_done;

    const { error: updateError } = await supabase
      .from('chat')
      .update({ is_done: newDoneState })
      .eq('id', chatId);

    if (updateError) {
      console.error('Error updating chat:', updateError);
      return { success: false, isDone: false };
    }

    return { success: true, isDone: newDoneState };
  } catch (error) {
    console.error('Error in toggleChatDone:', error);
    return { success: false, isDone: false };
  }
}
