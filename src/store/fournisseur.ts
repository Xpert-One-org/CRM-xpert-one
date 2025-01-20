import type {
  DBFournisseur,
  DBProfile,
  DBProfileMission,
  DBProfileStatus,
} from '@/types/typesDb';
import { create } from 'zustand';
import {
  deleteFournisseur,
  getAllFournisseurs,
  getSpecificFournisseur,
  updateProfile,
  updateProfileMission,
  updateProfileStatus,
} from '../../app/(crm)/fournisseur/fournisseur.action';
import { toast } from 'sonner';
import { updateCollaboratorReferent } from '../../app/(crm)/admin/gestion-collaborateurs/gestion-collaborateurs.action';

type FournisseurState = {
  loading: boolean;
  fournisseurs: DBFournisseur[] | null;
  totalFournisseurs: number | null;
  offset: number;
  openedFournisseur: DBFournisseur | null;
  openedFournisseurNotSaved: DBFournisseur | null;
  keyDBProfileChanged: (keyof DBProfile)[];
  keyDBProfileMissionChanged: (keyof DBProfileMission)[];
  keyDBProfileStatusChanged: (keyof DBProfileStatus)[];

  setKeyDBProfileChanged: (keys: (keyof DBProfile)[]) => void;
  setKeyDBProfileMissionChanged: (keys: (keyof DBProfileMission)[]) => void;
  setKeyDBProfileStatusChanged: (keys: (keyof DBProfileStatus)[]) => void;
  setOpenedFournisseur: (fournisseurId: string) => void;
  setOpenedFournisseurNotSaved: (fournisseur: DBFournisseur | null) => void;

  fetchFournisseurs: () => void;
  fetchSpecificFournisseur: (id: string) => void;
  handleSaveUpdatedFournisseur: () => void;
  deleteFournisseur: (
    fournisseurId: string,
    fournisseurGeneratedId: string
  ) => void;
  resetFournisseurs: () => void;
  hasReferentReassign: boolean;
  setHasReferentReassign: (value: boolean) => void;
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
  openedFournisseur: null,
  openedFournisseurNotSaved: null,
  keyDBProfileChanged: [],
  keyDBProfileMissionChanged: [],
  keyDBProfileStatusChanged: [],

  setKeyDBProfileChanged: (keys) => set({ keyDBProfileChanged: keys }),
  setKeyDBProfileMissionChanged: (keys) =>
    set({ keyDBProfileMissionChanged: keys }),
  setKeyDBProfileStatusChanged: (keys) =>
    set({ keyDBProfileStatusChanged: keys }),

  setOpenedFournisseur: (fournisseurId) => {
    const fournisseurs = get().fournisseurs || [];
    const openedFournisseur = fournisseurs.find((f) => f.id === fournisseurId);
    set({ openedFournisseur });
  },

  setOpenedFournisseurNotSaved: (fournisseur) => {
    set({ openedFournisseurNotSaved: fournisseur });
  },

  fetchSpecificFournisseur: async (fournisseurId: string) => {
    const fournisseurs = get().fournisseurs || [];
    const findFournisseur = fournisseurs.find(
      (f) => f.generated_id === fournisseurId
    );
    if (findFournisseur) {
      set({
        openedFournisseur: findFournisseur,
        openedFournisseurNotSaved: findFournisseur,
      });
      return;
    }

    set({ loading: true });
    const fournisseur = await getSpecificFournisseur(fournisseurId);
    if (!fournisseur) {
      set({ loading: false });
      return;
    }

    set({
      fournisseurs: [fournisseur, ...fournisseurs],
      loading: false,
      openedFournisseur: fournisseur,
      openedFournisseurNotSaved: fournisseur,
    });
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

  handleSaveUpdatedFournisseur: async () => {
    const fournisseurNotSaved = get().openedFournisseurNotSaved;
    if (!fournisseurNotSaved) return;

    // Pour profile
    const newDataProfile = Object.keys(fournisseurNotSaved)
      .filter((key) => (get().keyDBProfileChanged as any).includes(key))
      .map((key) => ({
        [key]: fournisseurNotSaved[key as keyof DBFournisseur],
      }));

    // Pour profile_status
    const newDataProfileStatus = fournisseurNotSaved.profile_status
      ? Object.keys(fournisseurNotSaved.profile_status)
          .filter((key) =>
            (get().keyDBProfileStatusChanged as any).includes(key)
          )
          .map((key) => ({
            [key]:
              fournisseurNotSaved.profile_status?.[
                key as keyof DBProfileStatus
              ],
          }))
      : [];

    // Appliquer les mises à jour
    if (newDataProfileStatus.length > 0) {
      const { error } = await updateProfileStatus({
        fournisseur_id: fournisseurNotSaved.id,
        newData: newDataProfileStatus,
      });
      if (error) {
        toast.error('Erreur lors de la sauvegarde');
        return;
      }
    }

    if (newDataProfile.length > 0) {
      const { error } = await updateProfile({
        fournisseur_id: fournisseurNotSaved.id,
        newData: newDataProfile,
      });
      if (error) {
        toast.error('Erreur lors de la sauvegarde');
        return;
      }
    }

    set({
      openedFournisseur: fournisseurNotSaved,
      openedFournisseurNotSaved: fournisseurNotSaved,
      fournisseurs: get().fournisseurs?.map((fournisseur) =>
        fournisseur.id === fournisseurNotSaved.id
          ? fournisseurNotSaved
          : fournisseur
      ),
    });

    toast.success('Modifications enregistrées');
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
      openedFournisseur: null,
      openedFournisseurNotSaved: null,
      keyDBProfileChanged: [],
      keyDBProfileMissionChanged: [],
      keyDBProfileStatusChanged: [],
    });
  },
  hasReferentReassign: false,

  setHasReferentReassign: (value) => {
    set({ hasReferentReassign: value });
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
