'use server';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import type { DBProfile } from '@/types/typesDb';

type ProfileWithReferent = {
  receiver: DBProfile | null;
  referent: DBProfile | null;
};

export async function getReceiverAndReferentProfile(
  receiverId: string
): Promise<ProfileWithReferent> {
  const supabase = await createSupabaseAppServerClient();

  const { data: receiverData, error: receiverError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', receiverId)
    .single();

  if (receiverError) {
    console.error('Error fetching receiver profile:', receiverError);
    return { receiver: null, referent: null };
  }

  if (receiverData?.affected_referent_id) {
    const { data: referentData, error: referentError } = await supabase
      .from('profile')
      .select('*')
      .eq('id', receiverData.affected_referent_id)
      .single();

    if (referentError) {
      console.error('Error fetching referent profile:', referentError);
      return { receiver: receiverData, referent: null };
    }

    return { receiver: receiverData, referent: referentData };
  }

  return { receiver: receiverData, referent: null };
}
