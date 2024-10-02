'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signUp = async ({
  formData,
  phone,
  role,
  referent_generated_id,
}: {
  formData: FormData;
  phone: string;
  role: 'xpert' | 'company' | 'student_apprentice';
  referent_generated_id: string | null;
}) => {
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const lastname = formData.get('lastname') as string;
  const firstname = formData.get('firstname') as string;
  const company_role =
    role == 'company' ? (formData.get('company_role') as string) : null;
  const company_name =
    role === 'company' ? (formData.get('company_name') as string) : null;

  const supabase = createSupabaseAppServerClient();

  const convertedReferentId = referent_generated_id
    ? referent_generated_id.replace(/X/g, 'X')
    : null;

  const roleWithStudentCase = role != 'company' ? 'xpert' : 'company';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        lastname,
        role: roleWithStudentCase,
        default_phone: phone,
        firstname,
        referent_generated_id: convertedReferentId,
        company_name,
        company_role: company_role,
        is_student: role === 'student_apprentice',
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes('User already registered')) {
      return 'Cet email est déjà utilisé.';
    }
    console.error('error', error);
    return error.message;
  }
  redirect(`${origin}/connexion?mailsent=true`);
};
