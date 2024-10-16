import { create } from 'zustand';
import type { DBMission, DBMissionState } from '@/types/typesDb';
import {
  getMissionState,
  searchMission,
  updateMissionState,
} from '@functions/missions';

type MissionState = {
  missions: DBMission[];
  missionsNumbers: { mission_number: string | null }[];
  fetchMissions: (selectedState: DBMissionState | null) => Promise<void>;
  searchMissions: (missionId: string) => Promise<void>;
  updateMission: (missionId: string, state: DBMissionState) => Promise<void>;
  isLoading: boolean;
};

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  missionsNumbers: [],
  isLoading: false,
  searchMissions: async (missionId) => {
    set({ isLoading: true });
    const { data } = await searchMission(missionId);
    set({ missionsNumbers: data, isLoading: false });
  },
  fetchMissions: async (selectedState) => {
    if (selectedState) {
      set({ isLoading: true });

      const fetchedMissions = await getMissionState(selectedState);
      set({ missions: fetchedMissions, isLoading: false });
    }
  },
  updateMission: async (missionId, state: DBMission['state']) => {
    await updateMissionState(missionId, state);

    set({
      missions: get().missions.map((mission) =>
        mission.id.toString() === missionId ? { ...mission, state } : mission
      ),
    });
  },
}));
