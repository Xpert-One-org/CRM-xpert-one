import type { FilterTasks, TaskWithRelations } from '@/types/types';
import { getTasks, getTaskToTreatCount } from '@functions/tasks';
import { toast } from 'sonner';
import { create } from 'zustand';

type TaskState = {
  loading: boolean;
  tasks: TaskWithRelations[] | null;
  totalTasks: number | null;
  activeFilters: FilterTasks;
  createTaskDialogOpen: boolean;
  taskToTreatCount: number | null;
  setTaskToTreatCount: (count: number) => void;
  initialTaskData: {
    referentId?: string;
    subjectType?: 'xpert' | 'supplier';
    subjectId?: string;
  };

  // Actions
  setTasks: (tasks: TaskWithRelations[]) => void;
  loadTasks: (replacing?: boolean) => Promise<void>;
  setActiveFilters: (filters: FilterTasks) => void;
  setCreateTaskDialogOpen: (open: boolean) => void;
  loadTaskToTreatCount: () => Promise<void>;
  setInitialTaskData: (data: {
    referentId?: string;
    subjectType?: 'xpert' | 'supplier';
    subjectId?: string;
  }) => void;
  resetTasks: () => void;
};

export const useTasksStore = create<TaskState>((set, get) => ({
  // State
  loading: true,
  tasks: null,
  taskToTreatCount: null,
  setTaskToTreatCount: (count) => {
    set({ taskToTreatCount: count });
  },
  totalTasks: null,
  activeFilters: {},
  createTaskDialogOpen: false,
  initialTaskData: {},

  // Actions
  setTasks: (tasks) => {
    set({ tasks });
  },

  loadTaskToTreatCount: async () => {
    const { count, error } = await getTaskToTreatCount();
    if (error) {
      throw new Error(error.message);
    }
    set({ taskToTreatCount: count });
  },

  loadTasks: async (replacing = false) => {
    try {
      set((state) => ({ loading: true }));

      const offset = replacing ? 0 : (get().tasks?.length ?? 0);
      const filters = get().activeFilters;

      const { data, count, error } = await getTasks({
        offset,
        filters,
      });

      if (error) {
        throw new Error(error);
      }

      get().loadTaskToTreatCount();

      if (data) {
        if (replacing) {
          set({
            tasks: data,
            totalTasks: count,
            loading: false,
          });
        } else {
          const currentTasks = get().tasks || [];
          // Éviter les doublons en vérifiant les IDs
          const newTasks = data.filter(
            (newTask) =>
              !currentTasks.some(
                (existingTask) => existingTask.id === newTask.id
              )
          );

          set({
            tasks: [...currentTasks, ...newTasks],
            totalTasks: count,
            loading: false,
          });
        }
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Impossible de charger les tâches');
      set({ loading: false });
    }
  },

  setActiveFilters: (filters) => {
    set({
      activeFilters: filters,
      // Reset tasks when filters change
      tasks: null,
      totalTasks: null,
    });
  },

  setCreateTaskDialogOpen: (open) => {
    set({ createTaskDialogOpen: open });
  },

  setInitialTaskData: (data) => {
    set({ initialTaskData: data });
  },

  resetTasks: () => {
    set({
      tasks: null,
      totalTasks: null,
      activeFilters: {},
      loading: false,
    });
  },
}));
