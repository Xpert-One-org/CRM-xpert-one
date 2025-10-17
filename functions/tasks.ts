'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import type {
  InsertTask,
  TaskHistoryAction,
  TaskWithRelations,
  UpdateTask,
  User,
} from '@/types/types';
import type { Task } from '@/types/types';
import { limitTask } from '@/data/constant';

const taskQuery = `
  *,
  created_by_profile:profile!tasks_created_by_fkey(id, firstname, lastname, generated_id, role),
  assigned_to_profile:profile!tasks_assigned_to_fkey!inner(id, firstname, lastname, generated_id, role),
  xpert:profile!tasks_xpert_id_fkey(id, firstname, lastname, generated_id),
  supplier:profile!tasks_supplier_id_fkey(id, firstname, lastname, generated_id),
  mission(id, job_title, mission_number, state)
`;

export async function getTaskToTreatCount() {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  const { error, count } = await supabase
    .from('tasks')
    .select('*', { count: 'exact' })
    .neq('status', 'done')
    .eq('assigned_to', user?.id ?? '');

  if (error) {
    return { count: null, error };
  }

  return { count, error: null };
}

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const { data: userData } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user?.id ?? '')
    .single();

  if (userData && userData.role !== 'admin') {
    query = query.eq('assigned_to', userData.id);
  }

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
    })
    .order('created_at', {
      ascending: false,
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

export async function updateTask(id: number, updates: UpdateTask) {
  const supabase = await createSupabaseAppServerClient();
  try {
    // 1. Récupérer l'ancienne version de la tâche
    const { data: oldTask, error: oldTaskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (oldTaskError) {
      console.error('Error fetching old task:', oldTaskError);
      return { error: oldTaskError };
    }

    if (!oldTask) {
      console.error('No old task found');
      return { error: 'Task not found' };
    }

    // 2. Effectuer la mise à jour
    const { data: updatedTask, error: updateError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating task:', updateError);
      return { error: updateError };
    }

    // 3. Enregistrer dans l'historique
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user:', userError);
      return { error: 'User not found' };
    }

    // Typage strict de l'action
    const action: 'updated' | 'completed' =
      updates.status === 'done' ? 'completed' : 'updated';

    const historyEntry: {
      task_id: number;
      action: TaskHistoryAction;
      changed_by: string;
      old_values: Task;
      new_values: Task;
      changed_at: string;
    } = {
      task_id: id,
      action,
      changed_by: user.id,
      old_values: oldTask,
      new_values: updatedTask,
      changed_at: new Date().toISOString(),
    };

    const { error: historyError } = await supabase
      .from('task_history')
      .insert(historyEntry);

    if (historyError) {
      console.error('Error inserting history:', historyError);
      throw historyError;
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error in updateTask:', error);
    return { error: 'Une erreur inattendue est survenue' };
  }
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

export const getCountTasksToTreatAndUrgent = async () => {
  const supabase = await createSupabaseAppServerClient();

  const { error: errorPending, count: pending } = await supabase
    .from('tasks')
    .select('', { count: 'exact' })
    .eq('status', 'pending');

  if (errorPending) {
    console.error('Error fetching count tasks to treat:', errorPending);
    return { count: { pending: null, urgent: null }, error: errorPending };
  }
  const { error: errorUrgent, count: urgent } = await supabase
    .from('tasks')
    .select('', { count: 'exact' })
    .eq('status', 'urgent');
  if (errorUrgent) {
    console.error('Error fetching count tasks urgent:', errorUrgent);
    return { count: { pending: null, urgent: null }, error: errorUrgent };
  }

  return { count: { pending, urgent }, error: null };
};

export async function deleteTask(ids: number[]) {
  const supabase = await createSupabaseAppServerClient();

  const { error } = await supabase.from('tasks').delete().in('id', ids);

  if (error) {
    return { error };
  }
  return { error: null };
}

type TaskHistoryEntry = {
  id: number;
  task_id: number;
  action: TaskHistoryAction;
  changed_by: string;
  changed_at: string;
  old_values: Task;
  new_values: Task;
  changed_by_profile: {
    firstname: string | null;
    lastname: string | null;
  };
  old_assigned: {
    firstname: string | null;
    lastname: string | null;
  } | null;
  new_assigned: {
    firstname: string | null;
    lastname: string | null;
  } | null;
};

export async function getTaskHistory(taskId: number): Promise<{
  data: TaskHistoryEntry[] | null;
  error: string | null;
}> {
  const supabase = await createSupabaseAppServerClient();

  const { data: historyData, error } = await supabase
    .from('task_history')
    .select(
      `
      *,
      changed_by_profile:profile!inner(
        firstname,
        lastname
      )
    `
    )
    .eq('task_id', taskId)
    .order('changed_at', { ascending: false });

  if (error) {
    return { data: null, error: error.message };
  }

  if (!historyData) {
    return { data: null, error: 'No data found' };
  }

  // Enrichir avec les infos des assignés
  const enrichedData = await Promise.all(
    historyData.map(async (entry) => {
      const oldValues = entry.old_values as Task;
      const newValues = entry.new_values as Task;

      let oldAssigned = null;
      let newAssigned = null;

      if (oldValues?.assigned_to) {
        const { data: oldProfile } = await supabase
          .from('profile')
          .select('firstname, lastname')
          .eq('id', oldValues.assigned_to)
          .single();
        oldAssigned = oldProfile;
      }

      if (newValues?.assigned_to) {
        const { data: newProfile } = await supabase
          .from('profile')
          .select('firstname, lastname')
          .eq('id', newValues.assigned_to)
          .single();
        newAssigned = newProfile;
      }

      return {
        ...entry,
        old_assigned: oldAssigned,
        new_assigned: newAssigned,
        old_values: oldValues,
        new_values: newValues,
      };
    })
  );

  return { data: enrichedData, error: null };
}
