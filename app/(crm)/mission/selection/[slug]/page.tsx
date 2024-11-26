'use client';

import { useMissionStore } from '@/store/mission';
import React, { use, useEffect } from 'react';
import MatchingMissionTable from '../../matching/[slug]/_components/MatchingMissionTable';
import SelectionDragAndDropTable from './_components/SelectionDragAndDropTable';

export default function SelectionPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { missions, fetchMissions } = useMissionStore();
  const params = use(props.params);
  const { slug } = params;

  const missionNumber = slug.replace('-', ' ');
  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full">
        {missionData && (
          <MatchingMissionTable missionData={missionData} slug={'selection'} />
        )}
      </div>
      <div className="flex w-full">
        <SelectionDragAndDropTable />
      </div>
    </div>
  );
}
