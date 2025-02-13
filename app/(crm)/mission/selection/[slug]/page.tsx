'use client';

import { useMissionStore } from '@/store/mission';
import React, { use, useEffect } from 'react';
import MatchingMissionTable from '../../matching/[slug]/_components/MatchingMissionTable';
import SelectionDragAndDropTable from './_components/SelectionDragAndDropTable';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import Link from 'next/link';

import { ChevronLeft } from 'lucide-react';
import Button from '@/components/Button';

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
  const missionSlugNumber = missionData?.mission_number?.replace(' ', '-');

  useEffect(() => {
    fetchUniqueMission(missionNumber);
  }, [fetchUniqueMission]);

  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <div className="flex h-full flex-col gap-6">
        <Link href={`/mission/fiche/${missionSlugNumber}`} className="w-fit">
          <Button variant="primary" className="flex items-center gap-2">
            Voir la fiche mission
          </Button>
        </Link>
        <div className="flex w-full items-center justify-between">
          {missionData && (
            <>
              <MatchingMissionTable
                missionData={missionData}
                slug={'selection'}
              />
            </>
          )}
        </div>
        <div className="flex size-full flex-col gap-3">
          <SelectionDragAndDropTable missionId={missionData?.id || 0} />
        </div>
      </div>
    </ProtectedRoleRoutes>
  );
}
