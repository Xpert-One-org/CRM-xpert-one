'use client';

import React, { use, useEffect } from 'react';
import MatchingMissionTable from './_components/MatchingMissionTable';
import { useMissionStore } from '@/store/mission';
import MatchingLeftSide from './_components/MatchingLeftSide';
import LaunchMatching from './_components/LaunchMatching';
import MatchingLeftSideSecond from './_components/MatchingLeftSideSecond';

export default function MissionMatchingPage(props: {
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
    if (missions.length === 0) {
      fetchMissions();
    }
  }, [missions]);

  return (
    <>
      {missionData && (
        <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
          <MatchingMissionTable missionData={missionData} />
          <div className="grid grid-cols-6 gap-x-spaceSmall">
            <MatchingLeftSide missionData={missionData} />
            <LaunchMatching />
          </div>
          <div className="grid grid-cols-6 gap-x-spaceSmall">
            <div className="col-span-3">
              <div className="border-divider border-t border-black" />
              <p className="my-2 font-bold text-black">
                Recherche supplémentaire
              </p>
              <p className="my-2 font-thin text-black">
                Missions recherchées par les XPERTS
              </p>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-x-spaceSmall">
            <MatchingLeftSideSecond missionData={missionData} />
          </div>
        </div>
      )}
    </>
  );
}
