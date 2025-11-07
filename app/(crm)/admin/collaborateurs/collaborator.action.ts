'use server';

import type { Collaborator, CreateCollaboratorDTO } from '@/types/collaborator';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { generateUniqueCollaboratorId } from './generated-id.action';
import type { DBCollaboratorRole } from '@/types/typesDb';
import { headers } from 'next/headers';

export const createCollaborator = async ({
  collaborator,
}: {
  collaborator: CreateCollaboratorDTO;
}) => {
  console.log('createCollaborator', collaborator);
  const supabase = await createSupabaseAppServerClient('admin');

  const { user: userSession } = (await supabase.auth.getUser()).data;

  if (!userSession) {
    return {
      error: { message: "Vous n'êtes pas connecté", code: 'not_authenticated' },
    };
  }

  const { email, password, firstname, lastname, mobile, role } = collaborator;

  console.log(role);

  const { data: authData, error } = await supabase.auth.admin.createUser({
    email_confirm: true,
    email,
    password,
    user_metadata: {
      firstname,
      lastname,
      default_phone: mobile,
      role: role,
      collaborator_is_absent: false,
    },
  });

  if (error) {
    return { error: { message: error.message, code: error.code } };
  }

  const { data, error: profileError } = await supabase
    .from('profile')
    .update({
      email,
      firstname,
      lastname,
      mobile,
      role,
      generated_id: await generateUniqueCollaboratorId(),
    })
    .eq('email', email)
    .select(
      'id, email, firstname, lastname, mobile, role, collaborator_is_absent'
    )
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
    .select(
      'id, firstname, lastname, mobile, email, role, collaborator_is_absent, collaborator_replacement_id'
    )
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
    collaborator_is_absent: c.collaborator_is_absent,
    collaborator_replacement_id: c.collaborator_replacement_id,
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
    .select(
      'id, email, firstname, lastname, mobile, role, collaborator_is_absent'
    )
    .single();

  if (error) {
    return { error: { message: error.message, code: error.code } };
  }

  return { collaborator: data as Collaborator, error: null };
};

export const updateCollaboratorStatus = async ({
  id,
  role,
  collaborator_is_absent,
  collaborator_replacement_id,
}: {
  id: string;
  role?: DBCollaboratorRole;
  collaborator_is_absent?: boolean;
  collaborator_replacement_id?: string | null;
}) => {
  const supabase = await createSupabaseAppServerClient('admin');

  const updates: {
    role?: DBCollaboratorRole;
    collaborator_is_absent?: boolean;
    collaborator_replacement_id?: string | null;
  } = {};

  if (role !== undefined) updates.role = role;
  if (collaborator_is_absent !== undefined)
    updates.collaborator_is_absent = collaborator_is_absent;
  if (collaborator_replacement_id !== undefined)
    updates.collaborator_replacement_id = collaborator_replacement_id;

  const { data, error: profileError } = await supabase
    .from('profile')
    .update(updates)
    .eq('id', id)
    .select(
      'id, email, firstname, lastname, mobile, role, collaborator_is_absent, collaborator_replacement_id'
    );

  if (profileError) {
    return {
      error: { message: profileError.message, code: profileError.code },
    };
  }

  return { collaborator: data[0] as Collaborator, error: null };
};

export const deleteCollaborator = async (id: string) => {
  const supabase = await createSupabaseAppServerClient('admin');
  const { error: deleteError } = await supabase.auth.admin.deleteUser(id);
  if (deleteError) throw deleteError;

  return { errorMessage: null };
};

export const resetPassword = async (email: string) => {
  const supabase = await createSupabaseAppServerClient();
  const origin = (await headers()).get('origin');

  // const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  //   redirectTo: `${origin}/nouveau-mot-de-passe`,
  // });
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/nouveau-mot-de-passe`,
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return {
    data,
    error: null,
  };
};
