import type { DBXpert } from '@/types/typesDb';
import { create } from 'zustand';
import {
  deleteXpert,
  getAllXperts,
  getSpecificXpert,
} from '../../app/(crm)/xpert/xpert.action';
import { toast } from 'sonner';

type XpertState = {
  loading: boolean;
  xperts: DBXpert[] | null;
  totalXperts: number | null;
  offset: number;
  fetchXperts: () => void;
  fetchSpecificXpert: (xpertId: string) => void;
  deleteXpert: (xpertId: string, xpertGeneratedId: string) => void;
};

export const useXpertStore = create<XpertState>((set, get) => ({
  loading: false,
  xperts: null,
  totalXperts: null,
  offset: 0,
  fetchSpecificXpert: async (xpertId: string) => {
    const xperts = get().xperts || [];
    const findXpert = xperts.find((xpert) => xpert.generated_id === xpertId);
    if (findXpert) {
      return;
    }
    set({ loading: true });
    const xpert = await getSpecificXpert(xpertId);
    if (!xpert) {
      set({ loading: false });
      return;
    }

    set({ xperts: [xpert, ...xperts], loading: false });
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
  deleteXpert: async (xpertId: string, xpertGeneratedId: string) => {
    set({ loading: true });
    const { errorMessage } = await deleteXpert(xpertId);
    if (errorMessage) {
      toast.error("Une erreur est survenue lors de la suppression de l'XPERT");
    } else {
      toast.success(`L'XPERT ${xpertGeneratedId} a été supprimé avec succès`);
      set((state) => ({
        xperts: state.xperts?.filter(
          (xpert) => xpert.generated_id !== xpertGeneratedId
        ),
      }));
    }
    set({ loading: false });
  },
}));
