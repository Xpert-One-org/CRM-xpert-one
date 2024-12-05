import type { FilterTasks, TaskWithRelations } from '@/types/types';
import { getTasks } from '@functions/tasks';
import { toast } from 'sonner';
import { create } from 'zustand';

type TaskState = {
  loading: boolean;
  tasks: TaskWithRelations[];
  totalTasks: number;
  loadTasks: (replacing?: boolean) => void;
  activeFilters: FilterTasks;
  setActiveFilters: (filters: FilterTasks) => void;
};

export const useTasksStore = create<TaskState>((set, get) => ({
  loading: false,
  tasks: [],
  totalTasks: 0,
  loadTasks: async (replacing) => {
    alert('ok');
    set({ loading: true });
    const offset = replacing ? 0 : get().tasks.length || 0;
    const filters = get().activeFilters;
    const { data, count, error } = await getTasks({ offset, filters });
    if (data) {
      replacing
        ? set({ tasks: data })
        : set({ tasks: [...get().tasks, ...data] });
    }
    count && set({ totalTasks: count });
    if (error) {
      toast.error('Impossible de charger les tâches');
    }
    set({ loading: false });
  },
  activeFilters: {},
  setActiveFilters: (filter) => {
    set({ activeFilters: filter });
  },
}));
