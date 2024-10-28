import type { User } from '@/types/types';
import { create } from 'zustand';
import type { DBProfile } from '@/types/typesDb';
import { getUserBase, searchUsers } from '@functions/profile';

type UserState = {
  user: User | null;
  error: string | null;
  minimal_profile: Pick<DBProfile, 'role' | 'firstname' | 'lastname'> | null;
  fetchMinimalProfile: () => void;
  searchUsers: (query: string) => void;
  searchUsersResults: { label: string; id: string }[];
  searchUserSelected: { label: string; id: string } | null;
  clearSearchUserSelected: () => void;
  loading: boolean;
};

const useUser = create<UserState>((set) => ({
  user: null,
  minimal_profile: null,
  error: null,
  loading: false,
  searchUsersResults: [],
  searchUserSelected: null,
  clearSearchUserSelected: () => {
    set({ searchUserSelected: null });
  },
  searchUsers: async (query) => {
    set({ loading: true });
    const { data, error } = await searchUsers(query);
    if (error) {
      set({ error, loading: false });
      return;
    }
    if (data) {
      const result = data.map((user) => {
        return {
          label: `${user.firstname} ${user.lastname} - ${user.generated_id}`,
          id: user.id,
        };
      });
      set({ searchUsersResults: result, error: null, loading: false });
    } else {
      set({ loading: false, searchUsersResults: [] });
    }
  },
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
