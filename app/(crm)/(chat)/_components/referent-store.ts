import { create } from 'zustand';

type ReferentStore = {
  lastUpdate: number;
  triggerRefresh: () => void;
};

const useReferent = create<ReferentStore>((set) => ({
  lastUpdate: 0,
  triggerRefresh: () => set((state) => ({ lastUpdate: Date.now() })),
}));

export default useReferent;
