import { notifPerPage } from '@/data/constant';
import { deleteNotification, getNotifications } from '@functions/notification';
import type { DBNotification } from '@/types/typesDb';
import { create } from 'zustand';

type State = {
  loading: boolean;
  notifications: DBNotification[] | null;
  totalNotifications: number | null;
  setNotifications: (notifications: DBNotification[]) => void;
  fetchNotifications: () => Promise<void>;
  removeNotification: (id: number) => void;
  to: number;
};

const useNotifications = create<State>((set) => ({
  notifications: null,
  loading: false,
  totalNotifications: null,
  setNotifications: (notifications) => set({ notifications }),
  to: notifPerPage,
  fetchNotifications: async () => {
    set({ loading: true });
    const from = useNotifications.getState().notifications?.length ?? 0;
    const to = from + useNotifications.getState().to;
    const { data, count } = await getNotifications({ from: from, to: to });
    const oldNotifications = useNotifications.getState().notifications;
    const newNotifications = oldNotifications
      ? [...oldNotifications, ...(data ?? [])]
      : data;
    set({
      notifications: newNotifications ?? [],
      totalNotifications: count,
      loading: false,
    });
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
