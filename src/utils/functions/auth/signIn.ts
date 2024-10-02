'use server';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signIn = async (formData: FormData) => {
  const origin = headers().get('origin');

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createSupabaseAppServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return error.message;
  }

  return redirect(`${origin}/mon-profil/profil`);
};
