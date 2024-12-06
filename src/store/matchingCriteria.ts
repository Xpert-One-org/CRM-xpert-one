import { toast } from 'sonner';
import { create } from 'zustand';

type MatchingCriteriaStore = {
  excludedCriteria: Record<string, string[]>;
  additionalCriteria: Record<string, string[]>;
  setExcludedCriteria: (
    updaterOrValue:
      | Record<string, string[]>
      | ((prev: Record<string, string[]>) => Record<string, string[]>)
  ) => void;
  setAdditionalCriteria: (
    updaterOrValue:
      | Record<string, string[]>
      | ((prev: Record<string, string[]>) => Record<string, string[]>)
  ) => void;
  saveCriteria: (missionNumber: string) => void;
  loadCriteria: (missionNumber: string) => void;
};

export const useMatchingCriteriaStore = create<MatchingCriteriaStore>(
  (set, get) => ({
    excludedCriteria: {},
    additionalCriteria: {},

    setExcludedCriteria: (updaterOrValue) =>
      set((state) => ({
        excludedCriteria:
          typeof updaterOrValue === 'function'
            ? updaterOrValue(state.excludedCriteria)
            : updaterOrValue,
      })),

    setAdditionalCriteria: (updaterOrValue) =>
      set((state) => ({
        additionalCriteria:
          typeof updaterOrValue === 'function'
            ? updaterOrValue(state.additionalCriteria)
            : updaterOrValue,
      })),

    saveCriteria: (missionNumber) => {
      const { excludedCriteria, additionalCriteria } = get();
      const criteriaToStore = {
        excluded: excludedCriteria,
        additional: additionalCriteria,
      };
      localStorage.setItem(
        `mission-criteria-${missionNumber}`,
        JSON.stringify(criteriaToStore)
      );
      toast.success('Critères enregistrés');
    },

    loadCriteria: (missionNumber) => {
      const storedCriteria = localStorage.getItem(
        `mission-criteria-${missionNumber}`
      );
      if (storedCriteria) {
        const { excluded, additional } = JSON.parse(storedCriteria);
        set({
          excludedCriteria: excluded,
          additionalCriteria: additional,
        });
      }
    },
  })
);
