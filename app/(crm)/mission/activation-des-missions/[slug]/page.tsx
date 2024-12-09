'use client';

import React, { use, useEffect } from 'react';
import MissionActivationTable from './_components/MissionActivationTable';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';
import XpertActivationMissionTable from './_components/XpertActivationMissionTable';
import { useMissionStore } from '@/store/mission';
import FournisseurActivationMissionTable from './_components/FournisseurActivationMissionTable';

export default function ActivationPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const missionNumber = params.slug.replaceAll('-', ' ');

  const { missions, fetchMissions } = useMissionStore();

  useEffect(() => {
    fetchMissions();
  }, []);

  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
      <div className="flex w-3/4">
        <MissionActivationTable missionData={missionData} />
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
          <h3 className="text-center text-md font-medium text-[#222222]">
            XPERT -{' '}
            {convertStatusXpertValue(
              missionData?.xpert?.profile_status?.status ?? ''
            )}
          </h3>

          <XpertActivationMissionTable
            status={missionData?.xpert?.profile_status?.status ?? ''}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
          <h3 className="text-center text-md font-medium text-[#222222]">
            FOURNISSEUR
          </h3>

          <FournisseurActivationMissionTable />
        </div>
      </div>
    </div>
  );
}
