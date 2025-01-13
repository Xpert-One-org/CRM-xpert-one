import { create } from 'zustand';
import type { DBMission } from '@/types/typesDb';
import { toast } from 'sonner';
import { updateMission } from './mission.action';

type UpdateMissionData = Omit<Partial<DBMission>, 'id'> & {
  id?: never;
};

type EditMissionState = {
  loading: boolean;
  openedMission: DBMission | null;
  openedMissionNotSaved: DBMission | null;
  keyDBMissionChanged: (keyof DBMission)[];
  hasChanges: boolean;

  setKeyDBMissionChanged: (keys: (keyof DBMission)[]) => void;
  setOpenedMission: (mission: DBMission | null) => void;
  setOpenedMissionNotSaved: (mission: DBMission | null) => void;
  handleUpdateField: (field: keyof DBMission, value: any) => void;
  handleSaveUpdatedMission: () => Promise<void>;
  resetEditMission: () => void;
};

export const useEditMissionStore = create<EditMissionState>((set, get) => ({
  loading: false,
  openedMission: null,
  openedMissionNotSaved: null,
  keyDBMissionChanged: [],
  hasChanges: false,

  setKeyDBMissionChanged: (keys) =>
    set({
      keyDBMissionChanged: keys,
      hasChanges: keys.length > 0,
    }),

  setOpenedMission: (mission) =>
    set({
      openedMission: mission,
      openedMissionNotSaved: mission,
      keyDBMissionChanged: [],
      hasChanges: false,
    }),

  setOpenedMissionNotSaved: (mission) =>
    set({
      openedMissionNotSaved: mission,
      hasChanges: false,
    }),

  handleUpdateField: (field, value) => {
    const missionNotSaved = get().openedMissionNotSaved;
    const originalMission = get().openedMission;

    if (!missionNotSaved || !originalMission) return;

    const hasChanged = originalMission[field] !== value;

    set({
      openedMissionNotSaved: {
        ...missionNotSaved,
        [field]: value,
      },
      keyDBMissionChanged: hasChanged
        ? [...get().keyDBMissionChanged.filter((k) => k !== field), field]
        : get().keyDBMissionChanged.filter((k) => k !== field),
      hasChanges: hasChanged || get().keyDBMissionChanged.length > 0,
    });
  },

  handleSaveUpdatedMission: async () => {
    const missionNotSaved = get().openedMissionNotSaved;
    const keyDBMissionChanged = get().keyDBMissionChanged;

    if (!missionNotSaved || !get().hasChanges) return;

    set({ loading: true });

    const newDataMission = Object.keys(missionNotSaved)
      .filter(
        (key) =>
          key !== 'id' && keyDBMissionChanged.includes(key as keyof DBMission)
      )
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: missionNotSaved[key as keyof DBMission],
        }),
        {} as UpdateMissionData
      );

    if (Object.keys(newDataMission).length > 0) {
      const { error } = await updateMission({
        mission_id: missionNotSaved.id,
        newData: newDataMission,
      });

      if (error) {
        toast.error('Erreur lors de la sauvegarde');
        set({ loading: false });
        return;
      }
    }

    set({
      openedMission: missionNotSaved,
      openedMissionNotSaved: missionNotSaved,
      keyDBMissionChanged: [],
      loading: false,
      hasChanges: false,
    });

    toast.success('Modifications enregistrées');
  },

  resetEditMission: () => {
    set({
      openedMission: null,
      openedMissionNotSaved: null,
      keyDBMissionChanged: [],
      loading: false,
      hasChanges: false,
    });
  },
}));
