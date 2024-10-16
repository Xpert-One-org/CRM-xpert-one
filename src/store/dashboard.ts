import type { DBProfile, DBUser } from '@/types/typesDb';
import { getLastSignUpNewUsersWeek } from '@functions/dashboard';
import { create } from 'zustand';

type DashboardStore = {
  newUsers: DBProfile[];
  setNewUsers: (users: DBUser[]) => void;
  fetchLastSignUpNewUsersWeek: () => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  newUsers: [],
  setNewUsers: (users: DBProfile[]) => set({ newUsers: users }),
  fetchLastSignUpNewUsersWeek: async () => {
    const result = await getLastSignUpNewUsersWeek();
    if (result) {
      set({ newUsers: result.data });
    }
  },
}));
