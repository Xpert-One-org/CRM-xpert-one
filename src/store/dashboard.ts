import type { DBUser } from '@/types/typesDb';
import { getLastSignUpNewUsersWeek } from '@functions/dashboard';
import { create } from 'zustand';

type DashboardStore = {
  newUsers: DBUser[];
  setNewUsers: (users: DBUser[]) => void;
  fetchLastSignUpNewUsersWeek: () => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  newUsers: [],
  setNewUsers: (users: DBUser[]) => set({ newUsers: users }),
  fetchLastSignUpNewUsersWeek: async () => {
    const result = await getLastSignUpNewUsersWeek();
    if (result) {
      set({ newUsers: result.data });
    }
  },
}));
