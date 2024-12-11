'use client';

import React, { use, useEffect } from 'react';
import { useMissionStore } from '@/store/mission';
import HeaderCalendar from './_components/HeaderCalendar';
import XpertGestionFacturationTable from './_components/XpertGestionFacturationTable';
import FournisseurGestionFacturationTable from './_components/FournisseurGestionFacturationTable';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';
import MissionGestionFacturationTable from './_components/MissionGestionFacturationTable';

export default function GestionDesFacturationsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const missionNumber = params.slug.replaceAll('-', ' ');
  const { missions, fetchMissions } = useMissionStore();

  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
      <HeaderCalendar />
      <div className="flex w-1/2">
        <MissionGestionFacturationTable missionData={missionData} />
      </div>

      {missionData && (
        <>
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
              <h3 className="text-center text-md font-medium text-[#222222]">
                XPERT
                {missionData.xpert_associated_status === 'cdi'
                  ? ` - ${convertStatusXpertValue(
                      missionData.xpert_associated_status
                    )}`
                  : ' - FREELANCE / PORTÉ'}
                {missionData.xpert_associated_status === 'cdi' ? (
                  <span> - ( XPERT ONE )</span>
                ) : null}
              </h3>
              <XpertGestionFacturationTable
                status={missionData.xpert_associated_status}
                missionData={missionData}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
              <h3 className="text-center text-md font-medium text-[#222222]">
                FOURNISSEUR
              </h3>
              <FournisseurGestionFacturationTable missionData={missionData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
