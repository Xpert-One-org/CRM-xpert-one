import type { DBFournisseur} from '@/types/typesDb';
import { DBXpert } from '@/types/typesDb';
import { create } from 'zustand';
import {
  getAllXperts,
  getSpecificXpert,
} from '../../app/(crm)/xpert/xpert.action';
import { limitXpert } from '@/data/constant';
import {
  getAllFournisseurs,
  getSpecificFournisseur,
} from '../../app/(crm)/fournisseur/fournisseur.action';

type XpertState = {
  loading: boolean;
  fournisseurs: DBFournisseur[] | null;
  totalFournisseurs: number | null;
  offset: number;
  fetchFournisseurs: () => void;
  fetchSpecificFournisseur: (id: string) => void;
}

export const useFournisseurStore = create<XpertState>((set, get) => ({
  loading: false,
  fournisseurs: null,
  totalFournisseurs: null,
  offset: 0,
  fetchSpecificFournisseur: async (xpertId: string) => {
    const xperts = get().fournisseurs || [];
    const findXpert = xperts.find((xpert) => xpert.generated_id === xpertId);
    if (findXpert) {
      return;
    }
    set({ loading: true });
    const fournisseur = await getSpecificFournisseur(xpertId);
    if (!fournisseur) {
      set({ loading: false });
      return;
    }

    set({ fournisseurs: [fournisseur, ...xperts], loading: false });
  },
  fetchFournisseurs: async () => {
    set({ loading: true });
    const offset = get().fournisseurs?.length || 0;
    console.log(offset, limitXpert);

    const { data, count } = await getAllFournisseurs({ offset: offset - 1 });
    const fournisseurs = get().fournisseurs || [];
    const filterFournisseurs = data.filter(
      (fournisseur) =>
        !fournisseurs.find((f) => f.generated_id === fournisseur.generated_id)
    );
    set({
      fournisseurs: [...fournisseurs, ...filterFournisseurs],
      totalFournisseurs: count,
      loading: false,
    });
  },
}));
