'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase';
import type { InsertTask, TaskWithRelations, UpdateTask } from '@/types/types';
import { Task } from '@/types/types';

const taskQuery = `
  *,
  created_by_profile:profile!created_by(
    id,
    firstname,
    lastname
  ),
  assigned_to_profile:profile!assigned_to(
    id,
    firstname,
    lastname
  ),
  xpert:profile(
    id,
    firstname,
    lastname
  ),
  supplier:profile(
    id,
    firstname,
    lastname
  ),
  mission(
    id,
    title,
    status
  )
`;

// Fonction pour récupérer les tâches avec les filtres
export async function getTasks(
  filters: {
    status?: string;
    createdBy?: string;
    assignedTo?: string;
    subjectType?: string;
  } = {}
) {
  const supabase = await createSupabaseAppServerClient();

  let query = supabase.from('tasks').select(taskQuery);

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

  const { data, error } = await query.order('created_at', {
    ascending: false,
  });

  if (error) throw error;
  return data as unknown as TaskWithRelations[];
}

// Mettre à jour une tâche
export async function updateTask(id: number, updates: UpdateTask) {
  const supabase = await createSupabaseAppServerClient();

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select(taskQuery)
    .single();

  if (error) throw error;
  return data as unknown as TaskWithRelations;
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

  if (error) throw error;
  return data as unknown as TaskWithRelations;
}

// Créer une nouvelle tâche
export async function createTask(taskData: Omit<InsertTask, 'created_at'>) {
  const supabase = await createSupabaseAppServerClient();

  // Préparer les données de la tâche
  const newTaskData: InsertTask = {
    ...taskData,
    created_at: new Date().toISOString(),
    status: taskData.status || 'pending',
    // S'assurer que seule la bonne référence est définie selon le subject_type
    xpert_id: taskData.subject_type === 'xpert' ? taskData.xpert_id : null,
    supplier_id:
      taskData.subject_type === 'supplier' ? taskData.supplier_id : null,
    mission_id:
      taskData.subject_type === 'mission' ? taskData.mission_id : null,
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert(newTaskData)
    .select(taskQuery)
    .single();

  if (error) {
    throw error;
  }

  return data as unknown as TaskWithRelations;
}
