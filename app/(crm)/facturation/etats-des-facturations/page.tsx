'use client';

import React, { useEffect, useCallback } from 'react';
import EtatFacturationsTable from './_components/EtatFacturationsTable';
import { useMissionStore } from '@/store/mission';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';

export default function EtatsFacturationsPage() {
  const { missions, fetchMissions } = useMissionStore();
  const { fileStatusesByMission, checkAllMissionsFiles } =
    useFileStatusFacturationStore();

  const filteredMissions = missions.filter(
    (mission) => mission.state === 'in_progress'
  );

  const shouldUpdateFileStatuses = useCallback(
    (missions: typeof filteredMissions) => {
      if (missions.length === 0) return false;

      if (Object.keys(fileStatusesByMission).length === 0) return true;

      return missions.some(
        (mission) => !fileStatusesByMission[mission.mission_number || '']
      );
    },
    [fileStatusesByMission]
  );

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  useEffect(() => {
    if (shouldUpdateFileStatuses(filteredMissions)) {
      checkAllMissionsFiles(filteredMissions);
    }
  }, [filteredMissions, checkAllMissionsFiles, shouldUpdateFileStatuses]);

  return (
    <div className="flex flex-col gap-4">
      <EtatFacturationsTable missions={filteredMissions} />
    </div>
  );
}
