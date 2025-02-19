import type {
  DBProfile,
  DBProfileExpertise,
  DBProfileMission,
  DBProfileStatus,
  DBReferentType,
  DBUserAlerts,
  DBXpert,
  DBXpertLastPost,
  DBXpertOptimized,
} from '@/types/typesDb';
import { create } from 'zustand';
import {
  deleteXpert,
  getSpecificXpert,
  getXpertIdByJobName,
  getXpertLastJobs,
  getXpertsOptimized,
  updateProfile,
  updateProfileExpertise,
  updateProfileMission,
  updateProfileStatus,
  updateUserAlerts,
} from '../../app/(crm)/xpert/xpert.action';
import { toast } from 'sonner';
import type { FilterXpert } from '@/types/types';
import { updateCollaboratorReferent } from '../../app/(crm)/admin/gestion-collaborateurs/gestion-collaborateurs.action';
import { useDebouncedCallback } from 'use-debounce';

type NestedTableKey =
  | 'profile_expertise'
  | 'profile_mission'
  | 'profile_status';

type XpertState = {
  loading: boolean;
  xperts: DBXpert[] | null;
  activeFilters: FilterXpert;
  setActiveFilters: (filter: Partial<FilterXpert>) => void;
  xpertFilterKey: number;
  setXpertFilterKey: () => void;
  xpertsOptimized: DBXpertOptimized[] | null;
  totalXperts: number | null;
  totalXpertOptimized: number | null;
  totalXpertLastJobs: number | null;
  offset: number;
  openedXpert: DBXpert | null;
  openedXpertNotSaved: DBXpert | null;
  setOpenedXpert: (xpertId: string) => void;
  setOpenedXpertNotSaved: (xpert: DBXpert | null) => void;
  getXpertSelected: (xpertId: string) => Promise<{ xpert: DBXpert | null }>;
  resetXperts: () => void;
  fetchXpertOptimized: () => void;
  fetchXpertOptimizedFiltered: (
    replacing?: boolean
  ) => Promise<{ xperts: DBXpertOptimized[] }>;
  xpertLastJobs: DBXpertLastPost[] | null;
  fecthXpertLastJob: () => Promise<{ posts: DBXpertLastPost[] }>;
  updateXpertGroupReferent: (
    jobName: string | undefined,
    affected_referent: DBReferentType | null
  ) => Promise<void>;
  fetchSpecificXpert: (xpertId: string) => void;
  deleteXpert: (
    xpertId: string,
    xpertGeneratedId: string,
    reason: string
  ) => void;
  keyDBProfileChanged: [keyof DBProfile][] | [];
  keyDBProfileMissionChanged: [keyof DBProfileMission][] | [];
  keyDBProfileStatusChanged: [keyof DBProfileStatus][] | [];
  keyDBProfileExpertiseChanged: [keyof DBProfileExpertise][] | [];
  keyDBUserAlertsChanged: (keyof DBUserAlerts)[];
  setKeyDBProfileChanged: (keys: [keyof DBProfile][]) => void;
  setKeyDBProfileMissionChanged: (keys: [keyof DBProfileMission][]) => void;
  setKeyDBProfileStatusChanged: (keys: [keyof DBProfileStatus][]) => void;
  setKeyDBProfileExpertiseChanged: (keys: [keyof DBProfileExpertise][]) => void;
  setKeyDBUserAlertsChanged: (keys: (keyof DBUserAlerts)[]) => void;

  handleSaveUpdatedXpert: () => void;
  hasReferentReassign: boolean;
  setHasReferentReassign: (value: boolean) => void;

  updateXpertReferent: (
    xpertId: string,
    affected_referent_id: string | null
  ) => Promise<void>;
};

export const useXpertStore = create<XpertState>((set, get) => ({
  loading: true,
  xperts: null,
  xpertsOptimized: null,
  keyDBProfileChanged: [],
  keyDBProfileMissionChanged: [],
  keyDBProfileStatusChanged: [],
  keyDBProfileExpertiseChanged: [],
  keyDBUserAlertsChanged: [],

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
  setKeyDBUserAlertsChanged: (keys) => {
    set({ keyDBUserAlertsChanged: keys });
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
    iam: '',
    sectors: [],
  },
  setActiveFilters: (filter: Partial<FilterXpert>) => {
    console.log('Setting filters:', filter);
    console.log('Current filters:', get().activeFilters);

    const newFilters = {
      ...get().activeFilters,
      ...filter,
    };

    console.log('New filters:', newFilters);
    set({ activeFilters: newFilters });

    console.log('Updated filters:', get().activeFilters);
    get().fetchXpertOptimizedFiltered(true);
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
  totalXpertLastJobs: null,
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
        iam: '',
        sectors: [],
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

  xpertLastJobs: null,

  fecthXpertLastJob: async () => {
    set({ loading: true });
    const offset = get().xpertLastJobs?.length || 0;

    const { data: posts, count } = await getXpertLastJobs({ offset });
    const last_jobs = get().xpertLastJobs || [];

    set({
      loading: false,
      totalXpertLastJobs: count,
      xpertLastJobs: [...last_jobs, ...posts],
    });
    return { posts };
  },

  fetchSpecificXpert: async (xpertId: string) => {
    set({ loading: true });
    const xpert = await getSpecificXpert(xpertId);
    const xpertsOptimized: DBXpertOptimized | null = xpert
      ? {
          country: xpert.country,
          firstname: xpert.firstname,
          admin_opinion: xpert.admin_opinion,
          profile_experience: xpert.profile_expertise?.experiences[0]?.post
            ? {
                post: xpert.profile_expertise.experiences[0].post,
                post_other: xpert.profile_expertise.experiences[0].post_other,
              }
            : null,
          generated_id: xpert.generated_id,
          id: xpert.id,
          created_at: xpert.created_at,
          cv_name: xpert.cv_name,
          profile_mission: xpert.profile_mission,
          lastname: xpert.lastname,
          mission: xpert.mission,
          affected_referent_id: xpert.affected_referent_id,
          profile_status: xpert.profile_status,
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

  deleteXpert: async (
    xpertId: string,
    xpertGeneratedId: string,
    reason: string
  ) => {
    set({ loading: true });
    const { errorMessage } = await deleteXpert(
      xpertId,
      xpertGeneratedId,
      reason
    );
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

    const newDataProfile = Object.keys(xpertNotSaved)
      .filter((key) => (get().keyDBProfileChanged as any).includes(key))
      .map((key) => {
        return {
          [key]: xpertNotSaved[key as keyof DBXpert],
        };
      });

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
          })
      : [];

    const newDataProfileStatus = xpertNotSaved.profile_status
      ? Object.keys(xpertNotSaved.profile_status)
          .filter((key) =>
            (get().keyDBProfileStatusChanged as any).includes(key)
          )
          .map((key) => {
            return {
              [key]:
                xpertNotSaved.profile_status?.[
                  key as keyof typeof xpertNotSaved.profile_status
                ],
            };
          })
      : [];

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
          })
      : [];

    const newDataUserAlerts = xpertNotSaved.user_alerts
      ? Object.keys(xpertNotSaved.user_alerts)
          .filter((key) =>
            get().keyDBUserAlertsChanged.includes(key as keyof DBUserAlerts)
          )
          .map((key) => ({
            [key]: xpertNotSaved.user_alerts?.[key as keyof DBUserAlerts],
          }))
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

    if (newDataUserAlerts.length > 0) {
      const transformedUserAlerts = newDataUserAlerts.reduce(
        (acc, item) => ({
          ...acc,
          ...item,
        }),
        {}
      );

      const { error } = await updateUserAlerts({
        xpert_id: xpertNotSaved.id,
        userAlerts: transformedUserAlerts, // Change newData to userAlerts
      });
      if (error) {
        toast.error('Erreur lors de la sauvegarde');
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

  hasReferentReassign: false,

  setHasReferentReassign: (value) => {
    set({ hasReferentReassign: value });
  },

  updateXpertGroupReferent: async (
    jobName: string | undefined,
    affected_referent: DBReferentType | null
  ) => {
    if (!jobName) return;
    const { data } = await getXpertIdByJobName(jobName);
    if (!data) return;
    await Promise.all(
      data.map(async (xpert) => {
        if (!xpert.profile_id) return;
        return updateCollaboratorReferent(
          xpert.profile_id,
          affected_referent ? affected_referent.id : null
        );
      })
    );

    set((state) => ({
      xpertsOptimized: state.xpertsOptimized?.map((xpert) =>
        data.find((d) => d.profile_id === xpert.id)
          ? { ...xpert, affected_referent_id: affected_referent?.id ?? null }
          : xpert
      ),
      xpertLastJobs: state.xpertLastJobs?.map((job) =>
        job.post === jobName
          ? {
              ...job,
              referents: [
                {
                  id: affected_referent?.id ?? null,
                  firstname: affected_referent?.firstname ?? null,
                  lastname: affected_referent?.lastname ?? null,
                },
              ],
            }
          : job
      ),
    }));
  },

  updateXpertReferent: async (
    xpertId: string,
    affected_referent_id: string | null
  ) => {
    const { error } = await updateCollaboratorReferent(
      xpertId,
      affected_referent_id
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    set((state) => ({
      xpertsOptimized: state.xpertsOptimized?.map((xpert) =>
        xpert.id === xpertId ? { ...xpert, affected_referent_id } : xpert
      ),
    }));
  },
}));
