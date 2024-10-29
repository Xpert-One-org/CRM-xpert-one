'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const supabase = await createSupabaseAppServerClient();
  await supabase.auth.signOut();
  return redirect('/connexion');
};
