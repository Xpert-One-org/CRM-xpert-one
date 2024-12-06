import { create } from 'zustand';
import type { DBMission, DBMissionState } from '@/types/typesDb';
import {
  getAllMissions,
  getMissionState,
  searchMission,
  updateMissionState,
} from '@functions/missions';

type MissionState = {
  missions: DBMission[];
  missionsNumbers: { mission_number: string | null }[];
  fetchMissions: () => Promise<void>;
  fetchMissionsState: (selectedState: DBMissionState | null) => Promise<void>;
  searchMissions: (missionId: string) => Promise<void>;
  updateMission: (missionId: string, state: DBMissionState) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  missionsNumbers: [],
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  searchMissions: async (missionId: string) => {
    set({ isLoading: true });
    const { data } = await searchMission(missionId);
    set({ missionsNumbers: data, isLoading: false });
  },
  fetchMissions: async () => {
    set({ isLoading: true });
    const fetchedMissions = await getAllMissions();
    set({ missions: fetchedMissions, isLoading: false });
  },
  fetchMissionsState: async (selectedState: DBMissionState | null) => {
    if (selectedState) {
      set({ isLoading: true });

      const fetchedMissions = await getMissionState(selectedState);
      set({ missions: fetchedMissions, isLoading: false });
    }
  },
  updateMission: async (missionId: string, state: DBMission['state']) => {
    await updateMissionState(missionId, state);

    set({
      missions: get().missions.map((mission: DBMission) =>
        mission.id.toString() === missionId ? { ...mission, state } : mission
      ),
    });
  },
}));
