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
  getMissionState,
  searchMission,
  updateMissionState,
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
  missionsNumbers: { mission_number: string | null }[];
  totalMissions: number;
  isLoading: boolean;
  page: number;
  setIsLoading: (loading: boolean) => void;
  fetchMissions: () => Promise<void>;
  resetPagination: () => void;
  fetchMissionsState: (selectedState: DBMissionState | null) => Promise<void>;
  searchMissions: (missionId: string) => Promise<void>;
  updateMission: (
    missionId: string,
    state: DBMissionState,
    reason_deletion?: ReasonMissionDeletion,
    detail_deletion?: string
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
  activeFilters: FilterMission;
  setActiveFilters: (filters: FilterMission) => void;
};

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  inProgressMissions: [],
  missionsNumbers: [],
  totalMissions: 0,
  isLoading: false,
  page: 1,
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
    const { page } = get();
    set({ isLoading: true });
    try {
      const response = await getAllMissions(page);
      if (page === 1) {
        set({ missions: response.missions, totalMissions: response.total });
      } else {
        set((state) => {
          // Créer un Set des IDs des missions existantes
          const existingMissionIds = new Set(state.missions.map((m) => m.id));
          // Filtrer les nouvelles missions pour ne garder que celles qui n'existent pas déjà
          const newMissions = response.missions.filter(
            (mission) => !existingMissionIds.has(mission.id)
          );
          return {
            missions: [...state.missions, ...newMissions],
            totalMissions: response.total,
          };
        });
      }
      // N'incrémente la page que si on a reçu de nouvelles missions
      if (response.missions.length > 0) {
        set((state) => ({ page: state.page + 1 }));
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      toast.error('Erreur lors du chargement des missions');
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

      // Ne pas déclencher de rechargement complet, juste mettre à jour la mission spécifique
      return {
        ...state,
        missions: updatedMissions,
      };
    });
  },
}));
