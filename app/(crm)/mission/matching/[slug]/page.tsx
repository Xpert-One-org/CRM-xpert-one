'use client';

import React, { use, useEffect } from 'react';
import MatchingMissionTable from './_components/MatchingMissionTable';
import { useMissionStore } from '@/store/mission';
import MatchingLeftSide from './_components/MatchingLeftSide';
import LaunchMatching from './_components/LaunchMatching';
import type { DBMission } from '@/types/typesDb';
import { useMatchingCriteriaStore } from '@/store/matchingCriteria';
import MatchingLeftSideSecond from './_components/MatchingLeftSideSecond';

export default function MissionMatchingPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { missions, fetchMissions } = useMissionStore();
  const params = use(props.params);
  const { slug } = params;
  const missionNumber = slug.replace('-', ' ');
  const missionData = missions.find(
    (mission: DBMission) => mission.mission_number === missionNumber
  );

  const { loadCriteria } = useMatchingCriteriaStore();

  useEffect(() => {
    fetchMissions();
    loadCriteria(missionData?.mission_number ?? '');
  }, [fetchMissions, loadCriteria, missionData?.mission_number]);

  return (
    <>
      {missionData && (
        <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
          <MatchingMissionTable missionData={missionData} slug={'matching'} />
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
      )}
    </>
  );
}
