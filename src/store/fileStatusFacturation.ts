import { create } from 'zustand';
import type { FileStatuses } from '@/types/mission';
import type { DBMission } from '@/types/typesDb';
import { checkFileExistsFacturations } from '../../app/(crm)/facturation/gestion-des-facturations/[slug]/_utils/check-file-mission.action';
import { getFileTypeByStatusFacturation } from '../../app/(crm)/facturation/gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';

type FileStatusFacturationStore = {
  fileStatusesByMission: Record<string, FileStatuses>;
  cache: Record<string, FileStatuses>;
  cacheTimestamp: number;
  checkAllFiles: (mission: DBMission) => Promise<void>;
  checkAllMissionsFiles: (missions: DBMission[]) => Promise<void>;
  invalidateCache: () => void;
  isLoadingFiles: boolean;
};

export const useFileStatusFacturationStore = create<FileStatusFacturationStore>(
  (set, get) => ({
    fileStatusesByMission: {},
    cache: {},
    cacheTimestamp: 0,
    isLoadingFiles: false,
    checkAllFiles: async (mission: DBMission) => {
      if (!mission || !mission.mission_number) return;

      const filesToCheck = [
        getFileTypeByStatusFacturation(
          'presence_sheet_signed',
          mission.xpert_associated_status || ''
        ),
        getFileTypeByStatusFacturation(
          'presence_sheet_validated',
          mission.xpert_associated_status || ''
        ),
        getFileTypeByStatusFacturation(
          mission.xpert_associated_status === 'cdi'
            ? 'salary_sheet'
            : 'invoice_received',
          mission.xpert_associated_status || ''
        ),
        getFileTypeByStatusFacturation(
          'invoice_validated',
          mission.xpert_associated_status || ''
        ),
        getFileTypeByStatusFacturation(
          'invoice',
          mission.xpert_associated_status || ''
        ),
      ];

      // Exécuter les vérifications de fichiers en parallèle
      const fileChecks = await Promise.all(
        filesToCheck.map((fileType) =>
          checkFileExistsFacturations(fileType, mission)
        )
      );

      // Construire l'objet de résultats
      const newFileStatuses: FileStatuses = {};
      filesToCheck.forEach((fileType, index) => {
        newFileStatuses[fileType] = fileChecks[index];
      });

      set((state) => ({
        fileStatusesByMission: {
          ...state.fileStatusesByMission,
          [mission.mission_number ?? '']: newFileStatuses,
        },
        cache: {
          ...state.cache,
          [mission.mission_number ?? '']: newFileStatuses,
        },
      }));
    },

    checkAllMissionsFiles: async (missions: DBMission[]) => {
      if (get().isLoadingFiles) {
        return;
      }
      console.log('Checking all missions files');
      set({ isLoadingFiles: true });
      const now = Date.now();
      const cachedData = get().cache;
      const cacheTimestamp = get().cacheTimestamp;
      const cacheExpiration = 5 * 60 * 1000; // 5 minutes

      // Si le cache est récent et complet, l'utiliser
      const missionNumbers = missions
        .map((m) => m.mission_number)
        .filter(Boolean);
      const cachedMissions = Object.keys(cachedData);
      const allMissionsCached = missionNumbers.every((num) =>
        cachedMissions.includes(num as string)
      );

      if (
        cacheTimestamp > 0 &&
        now - cacheTimestamp < cacheExpiration &&
        allMissionsCached
      ) {
        console.log('Using cached data');
        set({ fileStatusesByMission: cachedData, isLoadingFiles: false });
        console.timeEnd('checkAllMissionsFiles');
        return;
      }

      // Préparer toutes les promesses en parallèle
      const missionPromises = missions.map(async (mission) => {
        if (!mission || !mission.mission_number) return null;

        const filesToCheck = [
          getFileTypeByStatusFacturation(
            'presence_sheet_signed',
            mission.xpert_associated_status || ''
          ),
          getFileTypeByStatusFacturation(
            'presence_sheet_validated',
            mission.xpert_associated_status || ''
          ),
          getFileTypeByStatusFacturation(
            mission.xpert_associated_status === 'cdi'
              ? 'salary_sheet'
              : 'invoice_received',
            mission.xpert_associated_status || ''
          ),
          getFileTypeByStatusFacturation(
            'invoice_validated',
            mission.xpert_associated_status || ''
          ),
          getFileTypeByStatusFacturation(
            'invoice',
            mission.xpert_associated_status || ''
          ),
        ];

        // Exécuter les vérifications de fichiers en parallèle pour chaque mission
        const fileChecks = await Promise.all(
          filesToCheck.map((fileType) =>
            checkFileExistsFacturations(fileType, mission)
          )
        );

        // Construire l'objet de résultats
        const newFileStatuses: FileStatuses = {};
        filesToCheck.forEach((fileType, index) => {
          newFileStatuses[fileType] = fileChecks[index];
        });

        return {
          missionNumber: mission.mission_number,
          statuses: newFileStatuses,
        };
      });

      // Attendre que toutes les missions soient traitées
      const results = await Promise.all(missionPromises);

      // Construire l'objet final
      const newFileStatusesByMission: Record<string, FileStatuses> = {};
      results.forEach((result) => {
        if (result) {
          newFileStatusesByMission[result.missionNumber] = result.statuses;
        }
      });

      set({
        fileStatusesByMission: newFileStatusesByMission,
        cache: newFileStatusesByMission,
        cacheTimestamp: now,
        isLoadingFiles: false,
      });
    },

    invalidateCache: () => {
      set({ cacheTimestamp: 0 });
    },
  })
);
