import { create } from 'zustand';
import type { DBMission } from '@/types/typesDb';
import { getMissionState, updateMissionState } from '@functions/missions';

type MissionState = {
  missions: DBMission[];
  fetchMissions: (selectedState: string | null) => Promise<void>;
  updateMission: (
    missionId: string,
    state: DBMission['state']
  ) => Promise<void>;
  isLoading: boolean;
};

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  isLoading: false,
  fetchMissions: async (selectedState) => {
    if (selectedState) {
      set({ isLoading: true });
      const state = selectedState.replace('-', '_');
      const fetchedMissions = await getMissionState(state);
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
