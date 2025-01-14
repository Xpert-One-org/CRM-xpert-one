'use server';

import type { Collaborator } from '@/types/collaborator';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export async function updateCollaboratorReferent(
  profileId: string,
  affected_referent_id: string | null
) {
  try {
    const supabase = await createSupabaseAppServerClient('admin');
    const { data, error } = await supabase
      .from('profile')
      .update({ affected_referent_id })
      .eq('id', profileId)
      .select('*');

    if (error) {
      return {
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return { collaborator: data[0] as Collaborator, error: null };
  } catch (error) {
    console.error('Error updating xpert referent:', error);
    return {
      error: {
        message:
          "Une erreur est survenue lors de la mise à jour du référent de l'xpert",
      },
    };
  }
}
