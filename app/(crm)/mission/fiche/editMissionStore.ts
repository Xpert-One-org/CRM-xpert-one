import { create } from 'zustand';
import type { DBMission, DBProfile } from '@/types/typesDb';
import { toast } from 'sonner';
import { getMissionDetails, updateMission } from './mission.action';
import { updateMissionSupplier } from './mission.action';
import { updateXpertEvaluation } from './profile.action';

type UpdateMissionData = Omit<Partial<DBMission>, 'id'> & {
  id?: never;
};

type XpertEvaluation = {
  evaluation_score?: number | null;
  self_evaluation_score?: number | null;
};

type EditMissionState = {
  loading: boolean;
  openedMission: DBMission | null;
  openedMissionNotSaved: DBMission | null;
  keyDBMissionChanged: (keyof DBMission)[];
  xpertEvaluationChanged: XpertEvaluation | null;
  hasChanges: boolean;

  setKeyDBMissionChanged: (keys: (keyof DBMission)[]) => void;
  setOpenedMission: (mission: DBMission | null) => void;
  setOpenedMissionNotSaved: (mission: DBMission | null) => void;
  handleUpdateField: (field: keyof DBMission, value: any) => void;
  handleUpdateXpertEvaluation: (
    evaluationScore?: number | null,
    selfEvaluationScore?: number | null
  ) => void;
  handleSaveUpdatedMission: () => Promise<void>;
  handleUpdateSupplier: (supplierId: string) => Promise<void>;
  resetEditMission: () => void;
};

export const useEditMissionStore = create<EditMissionState>((set, get) => ({
  loading: false,
  openedMission: null,
  openedMissionNotSaved: null,
  keyDBMissionChanged: [],
  xpertEvaluationChanged: null,
  hasChanges: false,

  setKeyDBMissionChanged: (keys) =>
    set({
      keyDBMissionChanged: keys,
      hasChanges: keys.length > 0 || get().xpertEvaluationChanged !== null,
    }),

  setOpenedMission: (mission) =>
    set({
      openedMission: mission,
      openedMissionNotSaved: mission,
      keyDBMissionChanged: [],
      xpertEvaluationChanged: null,
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
      hasChanges:
        hasChanged ||
        get().keyDBMissionChanged.length > 0 ||
        get().xpertEvaluationChanged !== null,
    });
  },

  // Mise à jour locale de l'évaluation de l'expert, sans sauvegarde immédiate
  handleUpdateXpertEvaluation: (
    evaluationScore?: number | null,
    selfEvaluationScore?: number | null
  ) => {
    const mission = get().openedMissionNotSaved;
    if (!mission || !mission.xpert) {
      toast.error('Aucun expert associé à cette mission');
      return;
    }

    // Créer une copie du profil de l'expert avec les modifications
    const updatedXpert = {
      ...mission.xpert,
    };

    let hasChanged = false;

    // Mettre à jour les scores d'évaluation si fournis
    if (evaluationScore !== undefined) {
      updatedXpert.evaluation_score = evaluationScore;
      hasChanged = true;
    }

    if (selfEvaluationScore !== undefined) {
      updatedXpert.self_evaluation_score = selfEvaluationScore;
      hasChanged = true;
    }

    // Mettre à jour l'état local
    if (hasChanged) {
      // Mettre à jour l'état d'évaluation modifiée
      const currentEvaluation = get().xpertEvaluationChanged || {};
      const newEvaluation = {
        ...currentEvaluation,
        evaluation_score:
          evaluationScore !== undefined
            ? evaluationScore
            : currentEvaluation.evaluation_score,
        self_evaluation_score:
          selfEvaluationScore !== undefined
            ? selfEvaluationScore
            : currentEvaluation.self_evaluation_score,
      };

      set({
        openedMissionNotSaved: {
          ...mission,
          xpert: updatedXpert,
        },
        xpertEvaluationChanged: newEvaluation,
        hasChanges: true,
      });
    }
  },

  handleSaveUpdatedMission: async () => {
    const missionNotSaved = get().openedMissionNotSaved;
    const keyDBMissionChanged = get().keyDBMissionChanged;
    const xpertEvaluationChanged = get().xpertEvaluationChanged;

    if (!missionNotSaved || !get().hasChanges) return;

    set({ loading: true });

    console.log('missionNotSaved', missionNotSaved);

    try {
      // 1. Mise à jour des données de la mission
      if (keyDBMissionChanged.length > 0) {
        const newDataMission = Object.keys(missionNotSaved)
          .filter(
            (key) =>
              key !== 'id' &&
              keyDBMissionChanged.includes(key as keyof DBMission)
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
      }

      // 2. Mise à jour de l'évaluation de l'expert si nécessaire
      if (xpertEvaluationChanged && missionNotSaved.xpert?.id) {
        const result = await updateXpertEvaluation(
          missionNotSaved.xpert.id,
          xpertEvaluationChanged.evaluation_score,
          xpertEvaluationChanged.self_evaluation_score
        );

        if (!result.success) {
          toast.error(
            result.error || "Erreur lors de la mise à jour de l'évaluation"
          );
          set({ loading: false });
          return;
        }
      }

      // Tout s'est bien passé, on met à jour l'état
      set({
        openedMission: missionNotSaved,
        openedMissionNotSaved: missionNotSaved,
        keyDBMissionChanged: [],
        xpertEvaluationChanged: null,
        loading: false,
        hasChanges: false,
      });

      toast.success('Modifications enregistrées');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
      set({ loading: false });
    }
  },

  // Fonction pour mettre à jour le fournisseur
  handleUpdateSupplier: async (supplierId: string) => {
    const mission = get().openedMissionNotSaved;
    if (!mission) return;

    set({ loading: true });

    const result = await updateMissionSupplier(mission.id, supplierId);

    if (!result.success) {
      toast.error(
        result.error || 'Erreur lors de la mise à jour du fournisseur'
      );
      set({ loading: false });
      return;
    }

    // Recharger les données complètes de la mission pour obtenir toutes les informations à jour
    try {
      // Récupération du numéro de mission pour appeler getMissionDetails
      const missionNumber = mission.mission_number;

      if (!missionNumber) {
        throw new Error('Numéro de mission manquant');
      }

      const updatedMission = await getMissionDetails(missionNumber);

      // Mettre à jour l'état avec les données complètes et actualisées
      set({
        openedMission: updatedMission,
        openedMissionNotSaved: updatedMission,
        keyDBMissionChanged: [],
        xpertEvaluationChanged: null,
        hasChanges: false,
        loading: false,
      });

      toast.success('Fournisseur de la mission mis à jour avec succès');
    } catch (error) {
      console.error(
        'Erreur lors du rechargement des données de la mission:',
        error
      );
      toast.error(
        'Le fournisseur a été mis à jour mais le rechargement des données a échoué'
      );
      set({ loading: false });
    }
  },

  resetEditMission: () => {
    set({
      openedMission: null,
      openedMissionNotSaved: null,
      keyDBMissionChanged: [],
      xpertEvaluationChanged: null,
      loading: false,
      hasChanges: false,
    });
  },
}));
