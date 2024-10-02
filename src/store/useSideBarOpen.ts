import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type SidebarOpenState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useSidebarOpenStore = create(
  persist<SidebarOpenState>(
    (set) => ({
      isSidebarOpen:
        typeof window !== 'undefined'
          ? JSON.parse(sessionStorage.getItem('sidebar-storage') || 'true')
          : true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
    }),
    {
      name: 'sidebar-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
