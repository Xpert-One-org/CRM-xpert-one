import { notifPerPage } from '@/data/constant';
import { getChatNotification } from '@functions/notification';
import type { DBNotification } from '@/types/typesDb';
import { create } from 'zustand';

type State = {
  chatNotifications: DBNotification[] | null;

  fetchNotifications: () => Promise<void>;
  from: number;
  to: number;
};

const useNotifications = create<State>((set) => ({
  chatNotifications: null,
  from: 0,
  to: notifPerPage,
  fetchNotifications: async () => {
    const to = useNotifications.getState().to;
    const from = useNotifications.getState().from;
    const { data } = await getChatNotification({ from: from, to: to });
    set({ chatNotifications: data ?? [] });
  },
}));

export default useNotifications;
