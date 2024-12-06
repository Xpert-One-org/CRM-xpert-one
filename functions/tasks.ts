'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';
import type { InsertTask, TaskWithRelations, UpdateTask } from '@/types/types';
import { Task } from '@/types/types';
import { limitTask } from '@/data/constant';

const taskQuery = `
  *,
  created_by_profile:profile!tasks_created_by_fkey!inner(id, firstname, lastname, generated_id, role),
  assigned_to_profile:profile!tasks_assigned_to_fkey!inner(id, firstname, lastname, generated_id, role),
  xpert:profile!tasks_xpert_id_fkey(id, firstname, lastname, generated_id),
  supplier:profile!tasks_supplier_id_fkey(id, firstname, lastname, generated_id),
  mission(id, job_title, mission_number, state)
`;

export async function getTasks({
  offset,
  filters,
}: {
  offset: number;

  filters: {
    status?: string;
    createdBy?: string;
    assignedTo?: string;
    subjectType?: string;
  };
}): Promise<{
  data: TaskWithRelations[] | null;
  count: number | null;
  error: string | null;
}> {
  const supabase = await createSupabaseAppServerClient();

  let query = supabase.from('tasks').select(taskQuery, { count: 'exact' });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.createdBy) {
    query = query.eq('created_by', filters.createdBy);
  }
  if (filters.assignedTo) {
    query = query.eq('assigned_to', filters.assignedTo);
  }
  if (filters.subjectType) {
    query = query.eq('subject_type', filters.subjectType);
  }

  const { data, error, count } = await query
    .range(offset, offset + limitTask - 1)
    .order('status', {
      ascending: true,
    });

  if (error) {
    return {
      data: null,
      error: error.message,
      count: count,
    };
  }

  return {
    data: data,
    error: null,
    count: count,
  };
}

export async function getAdminUsers() {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('profile')
    .select('id, firstname, lastname, role')
    .eq('role', 'admin');

  if (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }

  return data;
}

// Mettre à jour une tâche
export async function updateTask(id: number, updates: UpdateTask) {
  const supabase = await createSupabaseAppServerClient();

  const { error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select(taskQuery)
    .single();

  if (error) {
    return { error };
  }
  return { error: null };
}

// Marquer une tâche comme terminée
export async function completeTask(id: number) {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: 'done',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(taskQuery)
    .single();

  if (error) {
    return { error };
  }
  return { error: null };
}

export async function createTask(taskData: InsertTask) {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
}
