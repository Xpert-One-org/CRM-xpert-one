'use client';

import React, { use, useEffect } from 'react';
import MatchingMissionTable from './_components/MatchingMissionTable';
import { useMissionStore } from '@/store/mission';
import MatchingLeftSide from './_components/MatchingLeftSide';
import LaunchMatching from './_components/LaunchMatching';
import type { DBMission } from '@/types/typesDb';
import { useMatchingCriteriaStore } from '@/store/matchingCriteria';
import MatchingLeftSideSecond from './_components/MatchingLeftSideSecond';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function MissionMatchingPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { missions, fetchUniqueMission } = useMissionStore();
  const params = use(props.params);
  const { slug } = params;
  const missionNumber = slug.replace('-', ' ');
  const missionData = missions.find(
    (mission: DBMission) => mission.mission_number === missionNumber
  );

  const { loadCriteria } = useMatchingCriteriaStore();

  useEffect(() => {
    fetchUniqueMission(missionNumber);
    loadCriteria(missionData?.mission_number ?? '');
  }, [fetchUniqueMission, loadCriteria, missionData?.mission_number]);

  return (
    <>
      <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
        {missionData && (
          <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
            <MatchingMissionTable missionData={missionData} slug={'matching'} />
            <div className="relative flex flex-col gap-y-spaceSmall">
              {missionData.state != 'open' &&
                missionData.state != 'open_all' && (
                  <>
                    <div className="absolute inset-0 z-[49] bg-white opacity-85" />
                    <div className="absolute top-20 z-50 flex w-full justify-center text-primary">
                      {missionData.state === 'refused' && (
                        <h3 className="text-2xl font-bold">
                          La mission a été refusée, vous ne pouvez pas lancer le
                          matching.
                        </h3>
                      )}
                      {missionData.state === 'deleted' && (
                        <h3 className="text-2xl font-bold">
                          La mission a été supprimée, vous ne pouvez pas lancer
                          le matching.
                        </h3>
                      )}
                      {missionData.state === 'finished' && (
                        <h3 className="text-2xl font-bold">
                          La mission est terminée, vous ne pouvez pas lancer le
                          matching.
                        </h3>
                      )}
                      {missionData.state === 'to_validate' ||
                        missionData.state === 'open_all_to_validate' ||
                        (missionData.state === 'in_process' && (
                          <h3 className="text-2xl font-bold">
                            La mission est en cours de validation, vous ne
                            pouvez pas lancer le matching.
                          </h3>
                        ))}
                      {missionData.state === 'in_progress' && (
                        <h3 className="text-2xl font-bold">
                          La mission est déjà en cours, vous ne pouvez pas
                          lancer le matching.
                        </h3>
                      )}
                    </div>
                  </>
                )}

              <div className="flex h-3/4 w-full gap-3">
                <div className="flex w-1/2 flex-col overflow-y-auto">
                  <MatchingLeftSide missionData={missionData} />
                </div>
                <div className="flex max-h-[70vh] w-1/2 overflow-y-auto">
                  <LaunchMatching missionData={missionData} />
                </div>
              </div>
              <MatchingLeftSideSecond
                missionNumber={missionData.mission_number ?? ''}
              />
            </div>
          </div>
        )}
      </ProtectedRoleRoutes>
    </>
  );
}
