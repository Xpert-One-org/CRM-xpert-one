import type { FilterTasks, TaskWithRelations } from '@/types/types';
import { getTasks } from '@functions/tasks';
import { toast } from 'sonner';
import { create } from 'zustand';

type TaskState = {
  loading: boolean;
  tasks: TaskWithRelations[] | null;
  setTasks: (tasks: TaskWithRelations[]) => void;
  totalTasks: number | null;
  loadTasks: (replacing?: boolean) => void;
  activeFilters: FilterTasks;
  setActiveFilters: (filters: FilterTasks) => void;
  resetTasks: () => void;
};

export const useTasksStore = create<TaskState>((set, get) => ({
  loading: true,
  tasks: null,
  setTasks: (tasks) => {
    set({ tasks });
  },
  totalTasks: null,
  loadTasks: async (replacing) => {
    set({ loading: true });
    const offset = replacing ? 0 : (get().tasks?.length ?? 0);
    const filters = get().activeFilters;
    const { data, count, error } = await getTasks({ offset, filters });

    if (data) {
      const tasks = get().tasks || [];
      replacing ? set({ tasks: data }) : set({ tasks: [...tasks, ...data] });
    }

    set({ totalTasks: count });
    if (error) {
      toast.error('Impossible de charger les tâches');
    }
    set({ loading: false });
  },
  activeFilters: {},
  setActiveFilters: (filter) => {
    set({ activeFilters: filter });
  },
  resetTasks: () => {
    set({
      activeFilters: {
        assignedTo: '',
        status: undefined,
        subjectType: '',
      },
    });

    get().loadTasks(true);
  },
}));
