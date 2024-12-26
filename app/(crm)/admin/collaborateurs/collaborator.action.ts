'use server';

import type { Collaborator, CreateCollaboratorDTO } from '@/types/collaborator';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { generateUniqueCollaboratorId } from './generated-id.action';

export const createCollaborator = async ({
  collaborator,
}: {
  collaborator: CreateCollaboratorDTO;
}) => {
  const supabase = await createSupabaseAppServerClient('admin');

  const { user: userSession } = (await supabase.auth.getUser()).data;

  if (!userSession) {
    return {
      error: { message: "Vous n'êtes pas connecté", code: 'not_authenticated' },
    };
  }

  const { email, password, firstname, lastname, mobile, role } = collaborator;

  const { data: authData, error } = await supabase.auth.admin.createUser({
    email_confirm: true,
    email,
    password,
    user_metadata: {
      firstname,
      lastname,
      default_phone: mobile,
      role: role,
    },
  });

  if (error) {
    return { error: { message: error.message, code: error.code } };
  }

  const { data, error: profileError } = await supabase
    .from('profile')
    .insert({
      id: authData.user.id,
      email,
      firstname,
      lastname,
      mobile,
      role,
      generated_id: await generateUniqueCollaboratorId(),
    })
    .select('id, email, firstname, lastname, mobile, role')
    .single();

  if (profileError) {
    return {
      error: { message: profileError.message, code: profileError.code },
    };
  }

  return { collaborator: data as Collaborator, error: null };
};

export const getCollaborators = async () => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('profile')
    .select('id, firstname, lastname, mobile, email, role')
    .in('role', ['admin', 'project_manager', 'intern', 'hr', 'adv']);

  if (error) {
    console.error('Error fetching collaborators:', error);
    return { collaborators: [] };
  }

  const collaborators = data.map((c) => ({
    id: c.id,
    firstname: c.firstname || '',
    lastname: c.lastname || '',
    mobile: c.mobile || '',
    email: c.email || '',
    role: c.role,
  }));

  return { collaborators };
};

export const updateCollaborator = async ({
  id,
  collaborator,
}: {
  id: string;
  collaborator: Partial<Omit<Collaborator, 'id'>>;
}) => {
  const supabase = await createSupabaseAppServerClient('admin');

  const { data, error } = await supabase
    .from('profile')
    .update(collaborator)
    .eq('id', id)
    .select('id, email, firstname, lastname, mobile, role')
    .single();

  if (error) {
    return { error: { message: error.message, code: error.code } };
  }

  return { collaborator: data as Collaborator, error: null };
};

export const deleteCollaborator = async (id: string) => {
  const supabase = await createSupabaseAppServerClient('admin');
  const { error: deleteError } = await supabase.auth.admin.deleteUser(id);
  if (deleteError) throw deleteError;

  return { errorMessage: null };
};
