'use server';

import type { DBMissionState, DBProfile } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from './auth/checkRole';

export const getLastSignupNewUsers = async (role?: string) => {
  const supabase = await createSupabaseAppServerClient();

  let query = supabase
    .from('profile')
    .select('*')
    .order('created_at', { ascending: false });

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return { data };
};

export const getLastSignUpNewUsersWeek = async (role?: string) => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (isAdmin) {
    let query = supabase
      .from('profile')
      .select('*')
      .gte(
        'created_at',
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleString('en-US', {
          timeZone: 'Europe/Paris',
        })
      )
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const newUsersLastWeek = data.filter(
      (user: DBProfile) => new Date(user.created_at) > lastWeek
    );

    return { newUsersLastWeek };
  }

  return { newUsersLastWeek: [] };
};

export const getCountMissions = async () => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase.from('mission').select('*');

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export const getCountMissionsState = async (state: DBMissionState) => {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('mission')
    .select('*')
    .eq('state', state);

  if (error) {
    throw new Error(error.message);
  }

  return { data };
};

export const getCountMissionApplications = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('selection_matching')
    .select('*, xpert:profile(firstname, lastname, generated_id)')
    .eq('column_status', 'postulant');

  if (error) {
    console.error('Error fetching mission applications:', error);
    return { data: [] };
  }

  return { data: data || [] };
};

export const getCountMissionApplicationsWeek = async () => {
  const supabase = await createSupabaseAppServerClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('selection_matching')
    .select('*')
    .eq('column_status', 'postulant')
    .gte('created_at', weekAgo.toISOString());

  if (error) {
    console.error('Error fetching mission applications of the week:', error);
    return { data: [] };
  }

  return { data: data || [] };
};
