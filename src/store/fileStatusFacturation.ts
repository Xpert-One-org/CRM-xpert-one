import { create } from 'zustand';
import type { FileStatuses } from '@/types/mission';
import type { DBMission } from '@/types/typesDb';
import { checkFileExistsFacturations } from '../../app/(crm)/facturation/gestion-des-facturations/[slug]/_utils/check-file-mission.action';

type FileStatusFacturationStore = {
  fileStatusesByMission: Record<string, FileStatuses>;
  checkAllFiles: (mission: DBMission) => Promise<void>;
  checkAllMissionsFiles: (missions: DBMission[]) => Promise<void>;
};

export const useFileStatusFacturationStore = create<FileStatusFacturationStore>(
  (set) => ({
    fileStatusesByMission: {},

    checkAllFiles: async (mission: DBMission) => {
      if (!mission) return;

      const filesToCheck = [
        'presence_sheet_signed',
        'presence_sheet_validated',
        mission.xpert_associated_status === 'cdi'
          ? 'salary_sheet'
          : 'invoice_received',
        'invoice',
      ];

      const newFileStatuses: FileStatuses = {};

      for (const fileType of filesToCheck) {
        const result = await checkFileExistsFacturations(fileType, mission);
        newFileStatuses[fileType] = result;
      }

      set((state) => ({
        fileStatusesByMission: {
          ...state.fileStatusesByMission,
          [mission.mission_number || '']: newFileStatuses,
        },
      }));
    },

    checkAllMissionsFiles: async (missions: DBMission[]) => {
      const newFileStatusesByMission: Record<string, FileStatuses> = {};

      for (const mission of missions) {
        if (!mission) continue;

        const filesToCheck = [
          'presence_sheet_signed',
          'presence_sheet_validated',
          mission.xpert_associated_status === 'cdi'
            ? 'salary_sheet'
            : 'invoice_received',
          'invoice',
        ];

        const newFileStatuses: FileStatuses = {};

        for (const fileType of filesToCheck) {
          const result = await checkFileExistsFacturations(fileType, mission);
          newFileStatuses[fileType] = result;
        }

        newFileStatusesByMission[mission.mission_number || ''] =
          newFileStatuses;
      }

      set({ fileStatusesByMission: newFileStatusesByMission });
    },
  })
);
