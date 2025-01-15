'use server';
import { generateCollaboratorId } from '@/utils/generateCollaboratorId';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const generateUniqueCollaboratorId = async () => {
  const supabase = await createSupabaseAppServerClient();
  let isUnique = false;
  let generatedId = '';

  while (!isUnique) {
    generatedId = generateCollaboratorId();
    const { data } = await supabase
      .from('profile')
      .select('generated_id')
      .eq('generated_id', generatedId)
      .single();

    if (!data) {
      isUnique = true;
    }
  }

  return generatedId;
};

export const checkGeneratedIdExist = async (generated_id: string) => {
  const supabase = await createSupabaseAppServerClient();

  const { data: referent } = await supabase
    .from('profile')
    .select('generated_id')
    .eq('generated_id', generated_id)
    .single();

  if (!referent) {
    return { data: null, error: 'Referent not found' };
  }

  return { data: referent, error: null };
};
