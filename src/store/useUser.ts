import type { User } from '@/types/types';
import { create } from 'zustand';
import type { DBProfile } from '@/types/typesDb';
import { getUserBase } from '@functions/profile';

type UserState = {
  user: User | null;
  error: string | null;
  minimal_profile: Pick<DBProfile, 'role' | 'firstname' | 'lastname'> | null;
  fetchMinimalProfile: () => void;
};

const useUser = create<UserState>((set) => ({
  user: null,
  minimal_profile: null,
  error: null,
  fetchMinimalProfile: async () => {
    const { data, error } = await getUserBase();
    if (error) {
      set({ error });
      return;
    }
    if (data) {
      set({ minimal_profile: data, error: null });
    }
  },
}));

export default useUser;
