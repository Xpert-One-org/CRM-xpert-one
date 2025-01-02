import type { DBFournisseur } from '@/types/typesDb';
import { create } from 'zustand';
import {
  deleteFournisseur,
  getAllFournisseurs,
  getSpecificFournisseur,
} from '../../app/(crm)/fournisseur/fournisseur.action';
import { toast } from 'sonner';
import { updateCollaboratorReferent } from '../../app/(crm)/admin/gestion-collaborateurs/gestion-collaborateurs.action';

type FournisseurState = {
  loading: boolean;
  fournisseurs: DBFournisseur[] | null;
  totalFournisseurs: number | null;
  offset: number;
  fetchFournisseurs: () => void;
  fetchSpecificFournisseur: (id: string) => void;
  deleteFournisseur: (
    fournisseurId: string,
    fournisseurGeneratedId: string
  ) => void;
  resetFournisseurs: () => void;
  updateFournisseurReferent: (
    fournisseurId: string,
    affected_referent_id: string | null
  ) => Promise<void>;
};

export const useFournisseurStore = create<FournisseurState>((set, get) => ({
  loading: false,
  fournisseurs: null,
  totalFournisseurs: null,
  offset: 0,
  fetchSpecificFournisseur: async (fournisseurId: string) => {
    const fournisseurs = get().fournisseurs || [];
    const findFournisseur = fournisseurs.find(
      (f) => f.generated_id === fournisseurId
    );
    if (findFournisseur) {
      return;
    }
    set({ loading: true });
    const fournisseur = await getSpecificFournisseur(fournisseurId);
    if (!fournisseur) {
      set({ loading: false });
      return;
    }

    set({ fournisseurs: [fournisseur, ...fournisseurs], loading: false });
  },
  fetchFournisseurs: async () => {
    set({ loading: true });
    const offset = get().fournisseurs?.length || 0;

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
  deleteFournisseur: async (
    fournisseurId: string,
    fournisseurGeneratedId: string
  ) => {
    set({ loading: true });
    const { errorMessage } = await deleteFournisseur(fournisseurId);
    if (errorMessage) {
      toast.error(
        'Une erreur est survenue lors de la suppression du fournisseur'
      );
    } else {
      toast.success(
        `Le fournisseur ${fournisseurGeneratedId} a été supprimé avec succès`
      );
      set((state) => ({
        fournisseurs: state.fournisseurs?.filter(
          (f) => f.generated_id !== fournisseurGeneratedId
        ),
        totalFournisseurs: state.totalFournisseurs
          ? state.totalFournisseurs - 1
          : 0,
      }));
    }
    set({ loading: false });
  },
  resetFournisseurs: () => {
    set({
      fournisseurs: null,
      totalFournisseurs: null,
      offset: 0,
    });
  },
  updateFournisseurReferent: async (
    fournisseurId: string,
    affected_referent_id: string | null
  ) => {
    const { error } = await updateCollaboratorReferent(
      fournisseurId,
      affected_referent_id
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    set((state) => ({
      fournisseurs: state.fournisseurs?.map((fournisseur) =>
        fournisseur.id === fournisseurId
          ? { ...fournisseur, affected_referent_id }
          : fournisseur
      ),
    }));
  },
}));
