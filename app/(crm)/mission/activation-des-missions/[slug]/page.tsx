'use client';

import React, { use, useEffect, useState } from 'react';
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
  const [showTables, setShowTables] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  useEffect(() => {
    if (missionData?.xpert_associated_status) {
      setShowTables(true);
    } else {
      setShowTables(false);
    }
  }, [missionData?.xpert_associated_status]);

  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
      <div className="flex w-3/4">
        <MissionActivationTable missionData={missionData} />
      </div>

      {showTables && (
        <>
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
              <h3 className="text-center text-md font-medium text-[#222222]">
                XPERT
                {missionData?.xpert_associated_status
                  ? ` - ${convertStatusXpertValue(
                      missionData?.xpert_associated_status ?? ''
                    )}`
                  : null}
                {missionData?.xpert_associated_status === 'cdi' ? (
                  <span> - ( XPERT ONE )</span>
                ) : null}
              </h3>

              <XpertActivationMissionTable
                status={missionData?.xpert_associated_status ?? ''}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
              <h3 className="text-center text-md font-medium text-[#222222]">
                FOURNISSEUR
              </h3>

              <FournisseurActivationMissionTable
                status={missionData?.xpert_associated_status ?? ''}
              />
            </div>
          </div>
        </>
      )}

      {!showTables && (
        <div className="mt-4 text-center text-gray-500">
          Veuillez sélectionner et enregistrer un statut pour l'expert avant de
          continuer
        </div>
      )}
    </div>
  );
}
