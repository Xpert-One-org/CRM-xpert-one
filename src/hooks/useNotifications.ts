import { notifPerPage } from '@/data/constant';
import { deleteNotification, getNotifications } from '@functions/notification';
import type { DBNotification } from '@/types/typesDb';
import { create } from 'zustand';

type State = {
  notifications: DBNotification[] | null;
  setNotifications: (notifications: DBNotification[]) => void;
  fetchNotifications: () => Promise<void>;
  removeNotification: (id: number) => void;
  from: number;
  to: number;
};

const useNotifications = create<State>((set) => ({
  notifications: null,
  setNotifications: (notifications) => set({ notifications }),
  from: 0,
  to: notifPerPage,
  fetchNotifications: async () => {
    const to = useNotifications.getState().to;
    const from = useNotifications.getState().from;
    const { data } = await getNotifications({ from: from, to: to });
    set({ notifications: data ?? [] });
  },
  removeNotification: async (id) => {
    await deleteNotification(id);
    set((state) => ({
      notifications:
        state.notifications?.filter((notif) => notif.id !== id) ?? [],
    }));
  },
}));

export default useNotifications;
