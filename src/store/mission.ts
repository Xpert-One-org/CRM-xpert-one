import { create } from 'zustand';
import type {
  ColumnStatus,
  DBMission,
  DBMissionCheckpoint,
  DBMissionState,
  ReasonMissionDeletion,
} from '@/types/typesDb';
import {
  getAllMissions,
  getLastMissionNumber,
  getMissionState,
  getSpecificMission,
  searchMission,
  updateMissionState,
  updateShowOnWebsite,
} from '@functions/missions';
import { updateSelectionMission } from '../../app/(crm)/mission/selection/selection.action';
import { updateXpertAssociatedStatus } from '../../app/(crm)/mission/activation-des-missions/activation-mission.action';
import { toast } from 'sonner';

export type FilterMission = {
  mission_number: string[];
  client: string[];
  xpert: string[];
  start_date: string;
  end_date: string;
};

type MissionState = {
  missions: DBMission[];
  lastMissionNumber: string;
  setLastMissionNumber: (missionNumber: string) => void;
  lastMissionNumberFacturation: string;
  missionsNumbers: {
    mission_number: string | null;
    job_title: string | null;
  }[];
  totalMissions: number;
  isLoading: boolean;
  page: number;
  setIsLoading: (loading: boolean) => void;
  fetchMissions: () => Promise<void>;
  fetchUniqueMission: (missionId: string) => Promise<DBMission>;
  fetchLastMissionNumber: () => Promise<void>;
  resetPagination: () => void;
  fetchMissionsState: (selectedState: DBMissionState | null) => Promise<void>;
  searchMissions: (missionId: string) => Promise<void>;
  updateMission: (
    missionId: string,
    state: DBMissionState,
    reason_deletion?: ReasonMissionDeletion,
    detail_deletion?: string
  ) => Promise<void>;
  updateMissionWebsiteVisibility: (
    missionId: number,
    showOnWebsite: boolean
  ) => Promise<void>;
  updateSelectionMission: (
    selectionId: number,
    columnStatus: ColumnStatus,
    missionId: number,
    xpertId: string
  ) => Promise<void>;
  updateXpertAssociatedStatus: (
    missionId: number,
    status: string
  ) => Promise<void>;
  updateMissionCheckpoints: (
    missionId: number,
    newValues: Partial<
      Pick<
        DBMissionCheckpoint,
        | 'point_j_moins_10_f'
        | 'point_j_moins_10_x'
        | 'point_j_plus_10_f'
        | 'point_j_plus_10_x'
        | 'point_j_plus_10_referent'
        | 'point_rh_fin_j_plus_10_f'
        | 'point_fin_j_moins_30'
      >
    >
  ) => void;
  updateMissionInStore: (updatedMission: DBMission) => void;
  activeFilters: FilterMission;
  setActiveFilters: (filters: FilterMission) => void;
  hasMore: boolean;
};

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  lastMissionNumber: '',
  setLastMissionNumber: (missionNumber: string) =>
    set({ lastMissionNumber: missionNumber }),
  lastMissionNumberFacturation: '',
  missionsNumbers: [],
  totalMissions: 0,
  isLoading: false,
  page: 1,
  hasMore: true,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  activeFilters: {
    mission_number: [],
    client: [],
    xpert: [],
    start_date: '',
    end_date: '',
  },
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  resetPagination: () => set({ page: 1, missions: [] }),

  updateMissionWebsiteVisibility: async (
    missionId: number,
    showOnWebsite: boolean
  ) => {
    try {
      const { error } = await updateShowOnWebsite(missionId, showOnWebsite);

      if (error) {
        throw new Error('Failed to update mission visibility');
      }

      set((state) => ({
        missions: state.missions.map((mission) =>
          mission.id === missionId
            ? { ...mission, show_on_website: showOnWebsite }
            : mission
        ),
      }));
    } catch (error) {
      console.error('Error updating mission visibility:', error);
      throw error;
    }
  },

  fetchUniqueMission: async (missionNumber: string): Promise<DBMission> => {
    const formattedMissionNumber = missionNumber.replace('-', ' ');
    const missionsAlreadyFetched = get().missions;
    const existingMission = missionsAlreadyFetched.find(
      (m) => m.mission_number === missionNumber
    );
    if (existingMission) {
      return existingMission;
    }

    const { data } = await getSpecificMission(formattedMissionNumber);
    if (!data) {
      throw new Error('Mission not found');
    }

    set({
      missions: [...missionsAlreadyFetched, data],
    });
    return data;
  },

  fetchLastMissionNumber: async () => {
    const { data } = await getLastMissionNumber();
    const { data: dataFacturation } = await getLastMissionNumber(true);
    set({
      lastMissionNumber: data ?? '',
      lastMissionNumberFacturation: dataFacturation ?? data ?? '',
    });
  },

  searchMissions: async (missionId: string) => {
    set({ isLoading: true });
    try {
      const { data } = await searchMission(missionId);
      set({ missionsNumbers: data });
    } catch (error) {
      console.error('Error searching missions:', error);
      toast.error('Erreur lors de la recherche des missions');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMissions: async () => {
    const { page, totalMissions, missions, isLoading } = get();

    if (isLoading) return;

    set({ isLoading: true });

    try {
      if (missions.length >= totalMissions && totalMissions !== 0) {
        set({ hasMore: false });
        return;
      }

      const response = await getAllMissions(page, 10, {
        sortBy: {
          column: 'start_date',
          ascending: true,
          nullsLast: true,
        },
        states: ['open', 'open_all', 'in_progress', 'finished'],
      });

      if (page === 1) {
        set({
          missions: response.missions,
          totalMissions: response.total,
          hasMore:
            response.missions.length > 0 &&
            response.missions.length < response.total,
          page: page + 1,
        });
      } else {
        if (response.missions.length === 0) {
          set({ hasMore: false });
          return;
        }

        set((state) => {
          const existingMissionIds = new Set(state.missions.map((m) => m.id));
          const newMissions = response.missions.filter(
            (mission) => !existingMissionIds.has(mission.id)
          );

          if (newMissions.length === 0) {
            return { hasMore: false };
          }

          const updatedMissions = [...state.missions, ...newMissions];
          return {
            missions: updatedMissions,
            totalMissions: response.total,
            hasMore: updatedMissions.length < response.total,
            page: state.page + 1,
          };
        });
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error('Erreur lors du chargement des missions');
      set({ hasMore: false });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMissionsState: async (selectedState: DBMissionState | null) => {
    if (selectedState) {
      set({ isLoading: true });
      try {
        const fetchedMissions = await getMissionState(selectedState);
        set({ missions: fetchedMissions });
      } catch (error) {
        console.error('Error fetching missions state:', error);
        toast.error('Erreur lors du chargement des missions');
      } finally {
        set({ isLoading: false });
      }
    }
  },

  updateMission: async (
    missionId: string,
    state: DBMissionState,
    reason_deletion?: ReasonMissionDeletion,
    detail_deletion?: string
  ) => {
    try {
      await updateMissionState(
        missionId,
        state,
        reason_deletion,
        detail_deletion
      );

      set({
        missions: get().missions.map((mission: DBMission) =>
          mission.id.toString() === missionId
            ? {
                ...mission,
                state,
                reason_deletion:
                  state === 'refused' && reason_deletion
                    ? reason_deletion
                    : null,
                detail_deletion:
                  state === 'refused' && detail_deletion
                    ? detail_deletion
                    : null,
              }
            : mission
        ),
      });
    } catch (error) {
      console.error('Error updating mission state:', error);
      toast.error('Erreur lors de la mise à jour de la mission');
      throw error;
    }
  },

  updateSelectionMission: async (
    selectionId: number,
    columnStatus: ColumnStatus,
    missionId: number,
    xpertId: string
  ) => {
    await updateSelectionMission(selectionId, columnStatus, missionId, xpertId);

    if (columnStatus === 'valides') {
      set({
        missions: get().missions.map((mission: DBMission) =>
          mission.id === missionId
            ? { ...mission, xpert_associated_id: xpertId, state: 'in_progress' }
            : mission
        ),
      });
    } else {
      set({
        missions: get().missions.map((mission: DBMission) =>
          mission.id === missionId
            ? { ...mission, xpert_associated_id: null, state: 'open' }
            : mission
        ),
      });
    }
  },

  updateXpertAssociatedStatus: async (missionId: number, status: string) => {
    const { error } = await updateXpertAssociatedStatus(missionId, status);

    if (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      return;
    } else {
      toast.success('Statut mis à jour avec succès');
    }

    set({
      missions: get().missions.map((mission: DBMission) =>
        mission.id === missionId
          ? { ...mission, xpert_associated_status: status }
          : mission
      ),
    });
  },

  updateMissionCheckpoints: (missionId, newValues) => {
    set((state) => {
      const updatedMissions = state.missions.map((mission) => {
        if (mission.id === missionId) {
          const currentCheckpoints = mission.checkpoints?.[0] || {
            mission_id: missionId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            point_j_moins_10_f: false,
            point_j_moins_10_x: false,
            point_j_plus_10_f: false,
            point_j_plus_10_x: false,
            point_j_plus_10_referent: false,
            point_rh_fin_j_plus_10_f: false,
            point_fin_j_moins_30: false,
          };

          return {
            ...mission,
            checkpoints: [
              {
                ...currentCheckpoints,
                ...newValues,
                updated_at: new Date().toISOString(),
              },
            ],
          } as DBMission;
        }
        return mission;
      });

      return {
        ...state,
        missions: updatedMissions,
      };
    });
  },

  updateMissionInStore: (updatedMission) => {
    set((state) => {
      const existingIndex = state.missions.findIndex(
        (m) => m.id === updatedMission.id
      );
      if (existingIndex >= 0) {
        // Mettre à jour la mission existante
        return {
          missions: state.missions.map((mission) =>
            mission.id === updatedMission.id ? updatedMission : mission
          ),
        };
      } else {
        // Ajouter la mission si elle n'existe pas encore
        return {
          missions: [...state.missions, updatedMission],
        };
      }
    });
  },
}));
