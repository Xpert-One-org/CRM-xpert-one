'use server';

import type { DBMissionState } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from './auth/checkRole';

// Toutes ces fonctions n'alimentent que des compteurs du dashboard :
// on utilise des requêtes `count` (head: true) pour ne transférer aucune ligne.

export const getCountNewUsers = async (role?: string) => {
  const supabase = await createSupabaseAppServerClient();

  let query = supabase
    .from('profile')
    .select('*', { count: 'exact', head: true });

  if (role) {
    query = query.eq('role', role);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return { count: count ?? 0 };
};

export const getCountNewUsersWeek = async (role?: string) => {
  const supabase = await createSupabaseAppServerClient();

  const isAdmin = await checkAuthRole();

  if (!isAdmin) {
    return { count: 0 };
  }

  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  let query = supabase
    .from('profile')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', lastWeek.toISOString());

  if (role) {
    query = query.eq('role', role);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return { count: count ?? 0 };
};

export const getCountMissions = async () => {
  const supabase = await createSupabaseAppServerClient();

  const { count, error } = await supabase
    .from('mission')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(error.message);
  }

  return { count: count ?? 0 };
};

export const getCountMissionsState = async (state: DBMissionState) => {
  const supabase = await createSupabaseAppServerClient();

  const { count, error } = await supabase
    .from('mission')
    .select('*', { count: 'exact', head: true })
    .eq('state', state);

  if (error) {
    throw new Error(error.message);
  }

  return { count: count ?? 0 };
};

export const getCountMissionApplications = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { count, error } = await supabase
    .from('selection_matching')
    .select('*', { count: 'exact', head: true })
    .eq('column_status', 'postulant');

  if (error) {
    console.error('Error fetching mission applications:', error);
    return { count: 0 };
  }

  return { count: count ?? 0 };
};

export const getCountMissionApplicationsWeek = async () => {
  const supabase = await createSupabaseAppServerClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { count, error } = await supabase
    .from('selection_matching')
    .select('*', { count: 'exact', head: true })
    .eq('column_status', 'postulant')
    .gte('created_at', weekAgo.toISOString());

  if (error) {
    console.error('Error fetching mission applications of the week:', error);
    return { count: 0 };
  }

  return { count: count ?? 0 };
};
