'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import EtatFacturationsTable from './_components/EtatFacturationsTable';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import { FilterButton } from '@/components/FilterButton';
import { useMissionStore } from '@/store/mission';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import type { DBMission } from '@/types/typesDb';

export default function EtatsFacturationsPage() {
  const { missions, fetchMissionsState } = useMissionStore();
  const { fileStatusesByMission, checkAllMissionsFiles } =
    useFileStatusFacturationStore();

  const filteredMissions: DBMission[] = useMemo(() => {
    return missions
      .filter((m) => m.state === 'in_progress')
      .sort((a, b) => {
        const dateA = new Date(a.start_date || '').getTime();
        const dateB = new Date(b.start_date || '').getTime();
        return dateA - dateB;
      });
  }, [missions]);

  const shouldUpdateFileStatuses = useCallback(
    (ms: DBMission[]) => {
      if (ms.length === 0) return false;
      if (Object.keys(fileStatusesByMission).length === 0) return true;
      return ms.some((m) => !fileStatusesByMission[m.mission_number || '']);
    },
    [fileStatusesByMission]
  );

  useEffect(() => {
    fetchMissionsState('in_progress');
  }, [fetchMissionsState]);

  useEffect(() => {
    if (shouldUpdateFileStatuses(filteredMissions)) {
      checkAllMissionsFiles(filteredMissions);
    }
  }, [filteredMissions, checkAllMissionsFiles, shouldUpdateFileStatuses]);

  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern']}>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-10 gap-3">
          <FilterButton
            className="col-span-3 font-bold text-black"
            placeholder="Traité / À traiter"
            filter={false}
          />
          <FilterButton
            className="col-span-5 font-bold text-black"
            placeholder="XPERT"
            filter={false}
          />
          <FilterButton
            className="col-span-2 font-bold text-black"
            placeholder="FOURNISSEUR"
            filter={false}
          />
        </div>

        <EtatFacturationsTable missions={filteredMissions} />
      </div>
    </ProtectedRoleRoutes>
  );
}
