'use server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const signIn = async (formData: FormData) => {
  const origin = (await headers()).get('origin');

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createSupabaseAppServerClient();

  const {
    data: { user },
    error: signInError,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    console.error('Error signing in:', signInError.message);
    return { user: null, error: 'Email ou mot de passe incorrect' };
  }

  if (!user) {
    console.error('No user returned');
    return { user: null, error: 'Email ou mot de passe incorrect' };
  }

  const { data, error: roleCheckError } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleCheckError) {
    console.error('Error checking user role:', roleCheckError.message);
    // Sign out the user if we couldn't verify their role
    await supabase.auth.signOut();
    return { user: null, error: "Vous n'êtes pas autorisé à vous connecter" };
  }

  if (
    data.role !== 'admin' &&
    data.role !== 'project_manager' &&
    data.role !== 'intern' &&
    data.role !== 'hr' &&
    data.role !== 'adv'
  ) {
    console.error('User is not authorized to access this resource');
    // Sign out the user if they're not an admin
    await supabase.auth.signOut();
    return { user: null, error: "Vous n'êtes pas autorisé à vous connecter" };
  }

  // If we get here, the user is an admin

  return redirect(`${origin}/auth/callback`);
};
