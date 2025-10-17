import { create } from 'zustand';
import type { FileStatuses } from '@/types/mission';
import type { DBMission } from '@/types/typesDb';
import { getFileTypeByStatusFacturation } from '../../app/(crm)/facturation/gestion-des-facturations/[slug]/_utils/getFileTypeByStatusFacturation';

type FileStatusFacturationStore = {
  fileStatusesByMission: Record<string, FileStatuses>;
  cache: Record<string, FileStatuses>;
  cacheTimestamp: number;
  loadingByMission: Record<string, boolean>;
  checkAllMissionsFiles: (missions: DBMission[]) => Promise<void>;
  checkAllFiles: (mission: DBMission) => Promise<void>;
  invalidateCache: () => void;
};

export const useFileStatusFacturationStore = create<FileStatusFacturationStore>(
  (set, get) => ({
    fileStatusesByMission: {},
    cache: {},
    cacheTimestamp: 0,
    loadingByMission: {},

    /**
     * Rafraîchir les fichiers pour UNE mission
     */
    checkAllFiles: async (mission: DBMission) => {
      if (!mission?.mission_number) return;

      const missionNumber = mission.mission_number;
      set((state) => ({
        loadingByMission: { ...state.loadingByMission, [missionNumber]: true },
      }));

      try {
        const status = mission.xpert_associated_status || '';

        // Types pertinents pour CETTE mission (via helper)
        const types = [
          getFileTypeByStatusFacturation('presence_sheet_signed', status),
          getFileTypeByStatusFacturation('presence_sheet_validated', status),
          getFileTypeByStatusFacturation(
            mission.xpert_associated_status === 'cdi'
              ? 'salary_sheet'
              : 'invoice_received',
            status
          ),
          getFileTypeByStatusFacturation('invoice_validated', status),
          getFileTypeByStatusFacturation('invoice', status),
        ].filter(Boolean) as string[];

        const res = await fetch('/api/facturation/statuses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            missions: [
              {
                mission_number: mission.mission_number,
                xpert_generated_id: mission.xpert?.generated_id ?? null,
                supplier_generated_id: mission.supplier?.generated_id ?? null,
                start_date: mission.start_date ?? null,
              },
            ],
            types,
          }),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const { data } = (await res.json()) as {
          data: Record<string, FileStatuses>;
        };

        // La route renvoie déjà FileStatuses pour la mission
        const newFileStatuses = (data?.[missionNumber] ?? {}) as FileStatuses;

        set((state) => ({
          fileStatusesByMission: {
            ...state.fileStatusesByMission,
            [missionNumber]: newFileStatuses,
          },
          cache: { ...state.cache, [missionNumber]: newFileStatuses },
          loadingByMission: {
            ...state.loadingByMission,
            [missionNumber]: false,
          },
        }));
      } catch (err) {
        console.error('Erreur checkAllFiles:', err);
        set((state) => ({
          loadingByMission: {
            ...state.loadingByMission,
            [mission.mission_number!]: false,
          },
        }));
      }
    },

    /**
     * Rafraîchir les fichiers pour TOUTES les missions visibles
     * (appelle la route serveur une seule fois, avec l’union des types)
     */
    checkAllMissionsFiles: async (missions: DBMission[]) => {
      const now = Date.now();
      const { cache, cacheTimestamp } = get();
      const cacheExpiration = 5 * 60 * 1000; // 5 min

      const missionNumbers = missions
        .map((m) => m.mission_number)
        .filter(Boolean) as string[];

      const cachedAll = missionNumbers.every((n) => !!cache[n]);
      if (
        cacheTimestamp > 0 &&
        now - cacheTimestamp < cacheExpiration &&
        cachedAll
      ) {
        set({ fileStatusesByMission: cache });
        return;
      }

      // Marquer toutes les missions "en cours"
      set((state) => ({
        loadingByMission: missionNumbers.reduce<Record<string, boolean>>(
          (acc, n) => ({ ...acc, [n]: true }),
          { ...state.loadingByMission }
        ),
      }));

      try {
        // Payload missions pour l’API
        const payload = missions
          .filter((m) => !!m.mission_number)
          .map((m) => ({
            mission_number: m.mission_number!,
            xpert_generated_id: m.xpert?.generated_id ?? null,
            supplier_generated_id: m.supplier?.generated_id ?? null,
            start_date: m.start_date ?? null,
            xpert_associated_status: m.xpert_associated_status ?? '',
          }));

        // Union des types calculés via helper (CDI / freelance…)
        const typeSet = new Set<string>();
        for (const m of missions) {
          const status = m.xpert_associated_status || '';
          [
            getFileTypeByStatusFacturation('presence_sheet_signed', status),
            getFileTypeByStatusFacturation('presence_sheet_validated', status),
            getFileTypeByStatusFacturation(
              m.xpert_associated_status === 'cdi'
                ? 'salary_sheet'
                : 'invoice_received',
              status
            ),
            getFileTypeByStatusFacturation('invoice_validated', status),
            getFileTypeByStatusFacturation('invoice', status),
          ]
            .filter(Boolean)
            .forEach((t) => typeSet.add(t as string));
        }
        const allTypes = Array.from(typeSet);

        const res = await fetch('/api/facturation/statuses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            missions: payload,
            types: allTypes,
          }),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const { data } = (await res.json()) as {
          data: Record<string, FileStatuses>;
        };

        // data est déjà: Record<mission_number, FileStatuses>
        const fileStatusesByMission = (data ?? {}) as Record<
          string,
          FileStatuses
        >;

        set({
          fileStatusesByMission,
          cache: fileStatusesByMission,
          cacheTimestamp: Date.now(),
          loadingByMission: {}, // terminé
        });
      } catch (err) {
        console.error('Erreur checkAllMissionsFiles:', err);
        set({ loadingByMission: {} });
      }
    },

    invalidateCache: () => {
      set({ cacheTimestamp: 0 });
    },
  })
);
