'use client';

import { useMissionStore } from '@/store/mission';
import React, { use, useEffect } from 'react';
import MatchingMissionTable from '../../matching/[slug]/_components/MatchingMissionTable';
import SelectionDragAndDropTable from './_components/SelectionDragAndDropTable';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function SelectionPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { missions, fetchUniqueMission } = useMissionStore();
  const params = use(props.params);
  const { slug } = params;

  const missionNumber = slug.replace('-', ' ');
  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  useEffect(() => {
    fetchUniqueMission(missionNumber);
  }, [fetchUniqueMission]);

  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <div className="flex h-full flex-col gap-6">
        <div className="flex w-full">
          {missionData && (
            <MatchingMissionTable
              missionData={missionData}
              slug={'selection'}
            />
          )}
        </div>
        <div className="flex size-full flex-col gap-3">
          <SelectionDragAndDropTable missionId={missionData?.id || 0} />
        </div>
      </div>
    </ProtectedRoleRoutes>
  );
}
