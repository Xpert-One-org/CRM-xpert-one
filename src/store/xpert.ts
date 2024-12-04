import type { DBXpert, DBXpertOptimized } from '@/types/typesDb';
import { create } from 'zustand';
import {
  deleteXpert,
  getAllXperts,
  getSpecificXpert,
  getXpertsOptimized,
} from '../../app/(crm)/xpert/xpert.action';
import { toast } from 'sonner';
import type { FilterXpert } from '@/types/types';

type XpertState = {
  loading: boolean;
  xperts: DBXpert[] | null;
  activeFilters: FilterXpert;
  setActiveFilters: (filter: FilterXpert) => void;
  xpertsOptimized: DBXpertOptimized[] | null;
  totalXperts: number | null;
  totalXpertOptimized: number | null;
  offset: number;
  openedXpert: DBXpert | null;
  setOpenedXpert: (xpertId: string) => void;
  getXpertSelected: (xpertId: string) => Promise<{ xpert: DBXpert | null }>;
  resetXperts: () => void;
  fetchXperts: () => void;
  fetchXpertOptimized: () => void;
  fetchXpertOptimizedFiltered: (
    replacing?: boolean
  ) => Promise<{ xperts: DBXpertOptimized[] }>;
  fetchSpecificXpert: (xpertId: string) => void;
  deleteXpert: (xpertId: string, xpertGeneratedId: string) => void;
};

export const useXpertStore = create<XpertState>((set, get) => ({
  loading: true,
  xperts: null,
  xpertsOptimized: null,
  activeFilters: {
    jobTitles: '',
    availability: '',
    cv: '',
    countries: [],
    sortDate: '',
    firstname: '',
    generated_id: '',
    lastname: '',
  },
  setActiveFilters: (filter) => {
    set({ activeFilters: filter });
  },
  openedXpert: null,
  totalXpertOptimized: null,
  totalXperts: null,
  offset: 0,
  resetXperts: () => {
    set({ xpertsOptimized: null, offset: 0, totalXpertOptimized: 0 });
    get().fetchXpertOptimizedFiltered();
  },
  setOpenedXpert: (xpertId: string) => {
    const xperts = get().xperts || [];
    const openedXpert = xperts.find((xpert) => xpert.id === xpertId);
    set({ openedXpert });
  },
  fetchSpecificXpert: async (xpertId: string) => {
    set({ loading: true });
    const xpert = await getSpecificXpert(xpertId);
    const xpertsOptimized: DBXpertOptimized | null = xpert
      ? {
          country: xpert.country,
          firstname: xpert.firstname,
          generated_id: xpert.generated_id,
          id: xpert.id,
          created_at: xpert.created_at,
          cv_name: xpert.cv_name,
          profile_mission: xpert.profile_mission,
          lastname: xpert.lastname,
          mission: xpert.mission,
        }
      : null;
    if (!xpert) {
      set({ loading: false });
      return;
    }

    set({
      xpertsOptimized: xpertsOptimized ? [xpertsOptimized] : [],
      xperts: [xpert],
      loading: false,
      totalXpertOptimized: 1,
    });
  },
  fetchXperts: async () => {
    set({ loading: true });
    const offset = get().xperts?.length || 0;

    const { data, count } = await getAllXperts({ offset: offset - 1 });
    const xperts = get().xperts || [];
    const filterXpert = data.filter(
      (xpert) => !xperts.find((x) => x.generated_id === xpert.generated_id)
    );
    set({
      xperts: [...xperts, ...filterXpert],
      totalXperts: count,
      loading: false,
    });
  },

  fetchXpertOptimizedFiltered: async (replacing) => {
    set({ loading: true });

    const filter = get().activeFilters;

    const offset = replacing ? 0 : get().xpertsOptimized?.length || 0;

    const { data, count } = await getXpertsOptimized({
      offset: offset,
      filters: filter,
    });

    const xperts = get().xpertsOptimized || [];
    set({
      xpertsOptimized: replacing ? data : [...xperts, ...data],
      totalXpertOptimized: count,
      loading: false,
    });
    return { xperts };
  },

  fetchXpertOptimized: async () => {
    set({ loading: true });
    const offset = get().xpertsOptimized?.length || 0;

    const { data, count } = await getXpertsOptimized({ offset: offset });
    const xperts = get().xpertsOptimized || [];

    set({
      xpertsOptimized: [...xperts, ...data],
      totalXpertOptimized: count,
      loading: false,
    });
  },

  getXpertSelected: async (xpertId: string) => {
    const xperts = get().xperts || [];
    const xpertSelected = xperts.find(
      (xpert) => xpert.generated_id === xpertId
    );
    if (!xpertSelected) {
      const specificXpert = await getSpecificXpert(xpertId);
      if (specificXpert) {
        set({ xperts: [specificXpert, ...xperts] });
      }
      return { xpert: specificXpert };
    }
    return { xpert: xpertSelected };
  },

  deleteXpert: async (xpertId: string, xpertGeneratedId: string) => {
    set({ loading: true });
    const { errorMessage } = await deleteXpert(xpertId);
    if (errorMessage) {
      toast.error("Une erreur est survenue lors de la suppression de l'XPERT");
    } else {
      toast.success(`L'XPERT ${xpertGeneratedId} a été supprimé avec succès`);
      set((state) => ({
        xpertsOptimized: state.xpertsOptimized?.filter(
          (xpert) => xpert.generated_id !== xpertGeneratedId
        ),
        totalXpertOptimized: state.totalXpertOptimized
          ? state.totalXpertOptimized - 1
          : 0,
        xperts: state.xperts?.filter(
          (xpert) => xpert.generated_id !== xpertGeneratedId
        ),
      }));
    }
    set({ loading: false });
  },
}));
