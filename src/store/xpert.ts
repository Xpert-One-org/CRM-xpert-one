import type {
  DBProfile,
  DBProfileExpertise,
  DBProfileMission,
  DBProfileStatus,
  DBXpert,
  DBXpertOptimized,
} from '@/types/typesDb';
import { create } from 'zustand';
import {
  deleteXpert,
  getAllXperts,
  getSpecificXpert,
  getXpertsOptimized,
  updateProfile,
  updateProfileExpertise,
  updateProfileMission,
  updateProfileStatus,
} from '../../app/(crm)/xpert/xpert.action';
import { toast } from 'sonner';
import type { FilterXpert } from '@/types/types';

type XpertState = {
  loading: boolean;
  xperts: DBXpert[] | null;
  activeFilters: FilterXpert;
  setActiveFilters: (filter: FilterXpert) => void;
  xpertFilterKey: number;
  setXpertFilterKey: () => void;
  xpertsOptimized: DBXpertOptimized[] | null;
  totalXperts: number | null;
  totalXpertOptimized: number | null;
  offset: number;
  openedXpert: DBXpert | null;
  openedXpertNotSaved: DBXpert | null;
  setOpenedXpert: (xpertId: string) => void;
  setOpenedXpertNotSaved: (xpert: DBXpert | null) => void;
  getXpertSelected: (xpertId: string) => Promise<{ xpert: DBXpert | null }>;
  resetXperts: () => void;
  fetchXperts: () => void;
  fetchXpertOptimized: () => void;
  fetchXpertOptimizedFiltered: (
    replacing?: boolean
  ) => Promise<{ xperts: DBXpertOptimized[] }>;
  fetchSpecificXpert: (xpertId: string) => void;
  deleteXpert: (xpertId: string, xpertGeneratedId: string) => void;
  keyDBProfileChanged: [keyof DBProfile][] | [];
  keyDBProfileMissionChanged: [keyof DBProfileMission][] | [];
  keyDBProfileStatusChanged: [keyof DBProfileStatus][] | [];
  keyDBProfileExpertiseChanged: [keyof DBProfileExpertise][] | [];
  setKeyDBProfileChanged: (keys: [keyof DBProfile][]) => void;
  setKeyDBProfileMissionChanged: (keys: [keyof DBProfileMission][]) => void;
  setKeyDBProfileStatusChanged: (keys: [keyof DBProfileStatus][]) => void;
  setKeyDBProfileExpertiseChanged: (keys: [keyof DBProfileExpertise][]) => void;

  handleSaveUpdatedXpert: () => void;
};

export const useXpertStore = create<XpertState>((set, get) => ({
  loading: true,
  xperts: null,
  xpertsOptimized: null,
  keyDBProfileChanged: [],
  keyDBProfileMissionChanged: [],
  keyDBProfileStatusChanged: [],
  keyDBProfileExpertiseChanged: [],

  setKeyDBProfileChanged: (keys) => {
    set({ keyDBProfileChanged: keys });
  },
  setKeyDBProfileMissionChanged: (keys) => {
    set({ keyDBProfileMissionChanged: keys });
  },
  setKeyDBProfileStatusChanged: (keys) => {
    set({ keyDBProfileStatusChanged: keys });
  },
  setKeyDBProfileExpertiseChanged: (keys) => {
    set({ keyDBProfileExpertiseChanged: keys });
  },

  activeFilters: {
    jobTitles: '',
    availability: '',
    adminOpinion: '',
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
  openedXpertNotSaved: null,
  xpertFilterKey: new Date().getTime(),
  setXpertFilterKey: () => {
    set({ xpertFilterKey: new Date().getTime() });
  },

  setOpenedXpertNotSaved: (xpert: DBXpert | null) => {
    set({ openedXpertNotSaved: xpert });
  },

  totalXpertOptimized: null,
  totalXperts: null,
  offset: 0,

  resetXperts: () => {
    set({
      activeFilters: {
        adminOpinion: '',
        jobTitles: '',
        availability: '',
        cv: '',
        countries: [],
        sortDate: '',
        firstname: '',
        generated_id: '',
        lastname: '',
      },
      xpertFilterKey: new Date().getTime(),
    });

    get().fetchXpertOptimizedFiltered(true);
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
          admin_opinion: xpert.admin_opinion,
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

  handleSaveUpdatedXpert: async () => {
    const xpertNotSaved = get().openedXpertNotSaved;
    if (!xpertNotSaved) return;

    // Pour profile
    const newDataProfile = Object.keys(xpertNotSaved)
      .filter((key) => (get().keyDBProfileChanged as any).includes(key))
      .map((key) => {
        return {
          [key]: xpertNotSaved[key as keyof DBXpert],
        };
      }); // Récupération des valeurs

    // Pour profile_mission
    const newDataProfileMission = xpertNotSaved.profile_mission
      ? Object.keys(xpertNotSaved.profile_mission)
          .filter((key) =>
            (get().keyDBProfileMissionChanged as any).includes(key)
          )
          .map((key) => {
            return {
              [key]:
                xpertNotSaved.profile_mission?.[
                  key as keyof typeof xpertNotSaved.profile_mission
                ],
            };
          }) // Récupération des valeurs
      : [];

    // Pour profile_status
    const newDataProfileStatus = xpertNotSaved.profile_status
      ? Object.keys(xpertNotSaved.profile_status)
          .filter((key) =>
            (get().keyDBProfileStatusChanged as any).includes(key)
          )
          .map(
            (key) => {
              return {
                [key]:
                  xpertNotSaved.profile_status?.[
                    key as keyof typeof xpertNotSaved.profile_status
                  ],
              };
            } // return object {key: value}
          ) // Récupération des valeurs
      : [];

    // Pour profile_expertise

    const newDataProfileExpertise = xpertNotSaved.profile_expertise
      ? Object.keys(xpertNotSaved.profile_expertise)
          .filter((key) =>
            (get().keyDBProfileExpertiseChanged as any).includes(key)
          )
          .map((key) => {
            return {
              [key]: xpertNotSaved.profile_expertise?.[
                key as keyof DBProfileExpertise
              ] as any,
            };
          }) // Récupération des valeurs
      : [];

    if (newDataProfileExpertise.length > 0) {
      const { error } = await updateProfileExpertise({
        xpert_id: xpertNotSaved.id,
        newData: newDataProfileExpertise,
      });
      if (error) {
        toast.error('Erreur lors de la sauvegarde');
        console.error('Error updating profile expertise:', error);
        return;
      }
    }
    if (newDataProfileStatus.length > 0) {
      const { error } = await updateProfileStatus({
        xpert_id: xpertNotSaved.id,
        newData: newDataProfileStatus,
      });
      if (error) {
        toast.error('Erreur lors de la sauvegarde');
        console.error('Error updating profile status:', error);
        return;
      }
    }
    if (newDataProfileMission.length > 0) {
      const { error } = await updateProfileMission({
        xpert_id: xpertNotSaved.id,
        newData: newDataProfileMission,
      });
      if (error) {
        toast.error('Erreur lors de la sauvegarde');
        console.error('Error updating profile mission:', error);
        return;
      }
    }
    if (newDataProfile.length > 0) {
      const { error } = await updateProfile({
        xpert_id: xpertNotSaved.id,
        newData: newDataProfile,
      });
      if (error) {
        toast.error('Erreur lors de la sauvegarde');
        console.error('Error updating profile:', error);
        return;
      }
    }
    set({ openedXpert: xpertNotSaved });
    set({
      xperts: get().xperts?.map((xpert) => {
        if (xpert.id === xpertNotSaved.id) {
          return xpertNotSaved;
        }
        return xpert;
      }),
    });
    set({ openedXpertNotSaved: null });
    toast.success('Modifications enregistrées');
  },
}));
