'use client';

import React, { use, useEffect, useState } from 'react';
import MatchingMissionTable from './_components/MatchingMissionTable';
import { useMissionStore } from '@/store/mission';
import MatchingLeftSide from './_components/MatchingLeftSide';
import LaunchMatching from './_components/LaunchMatching';

export default function MissionMatchingPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { missions, fetchMissions } = useMissionStore();
  const params = use(props.params);
  const { slug } = params;
  const [excludedCriteria, setExcludedCriteria] = useState<
    Record<string, string[]>
  >({});

  const missionNumber = slug.replace('-', ' ');
  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  const handleCriteriaChange = (criteria: Record<string, string[]>) => {
    setExcludedCriteria(criteria);
  };

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return (
    <>
      {missionData && (
        <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
          <MatchingMissionTable missionData={missionData} slug={'matching'} />
          <div className="flex h-[calc(100vh-200px)] w-full gap-3">
            <div className="flex w-1/2 overflow-y-auto">
              <MatchingLeftSide
                missionData={missionData}
                onCriteriaChange={handleCriteriaChange}
              />
            </div>
            <div className="flex w-1/2 overflow-y-auto">
              <LaunchMatching
                missionData={missionData}
                excludedCriteria={excludedCriteria}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
