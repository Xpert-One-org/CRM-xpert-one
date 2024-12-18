'use client';

import React, { use, useEffect, useState, useCallback } from 'react';
import MissionActivationTable from './_components/MissionActivationTable';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';
import XpertActivationMissionTable from './_components/XpertActivationMissionTable';
import { useMissionStore } from '@/store/mission';
import FournisseurActivationMissionTable from './_components/FournisseurActivationMissionTable';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getFileTypeByStatus } from './_utils/getFileTypeByStatus';
import { checkFileExists } from '@functions/check-file-mission';

export default function MissionActivationPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const missionNumber = params.slug.replaceAll('-', ' ');
  const { missions, fetchMissions } = useMissionStore();
  const router = useRouter();
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);
  const [fileStatuses, setFileStatuses] = useState<
    Record<string, { exists: boolean; createdAt?: string }>
  >({});

  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  const checkAllFilesStatus = useCallback(async () => {
    if (!missionData?.xpert_associated_status) return;

    // Check XPERT files
    const xpertFilesToCheck = [
      getFileTypeByStatus('recap_mission', missionData.xpert_associated_status),
      getFileTypeByStatus(
        'recap_mission_signed',
        missionData.xpert_associated_status
      ),
      getFileTypeByStatus(
        missionData.xpert_associated_status === 'cdi'
          ? 'contrat'
          : missionData.xpert_associated_status === 'freelance'
            ? 'commande_societe'
            : 'devis',
        missionData.xpert_associated_status
      ),
      getFileTypeByStatus(
        missionData.xpert_associated_status === 'cdi'
          ? 'contrat_signed'
          : missionData.xpert_associated_status === 'freelance'
            ? 'commande_societe_signed'
            : 'commande',
        missionData.xpert_associated_status
      ),
    ];

    // Check Fournisseur files
    const fournisseurFilesToCheck = [
      getFileTypeByStatus('devis', missionData.xpert_associated_status),
      getFileTypeByStatus('devis_signed', missionData.xpert_associated_status),
      getFileTypeByStatus(
        'contrat_commande',
        missionData.xpert_associated_status
      ),
    ];

    const newFileStatuses: Record<
      string,
      { exists: boolean; createdAt?: string }
    > = {};

    // Check XPERT files
    for (const fileType of xpertFilesToCheck) {
      const result = await checkFileExists(fileType, missionData);
      newFileStatuses[fileType] = result;
    }

    // Check Fournisseur files
    for (const fileType of fournisseurFilesToCheck) {
      const result = await checkFileExists(fileType, missionData, true);
      newFileStatuses[fileType] = result;
    }

    setFileStatuses(newFileStatuses);

    const allFilesExist = [...Object.values(newFileStatuses)].every(
      (result) => result.exists
    );

    setAllFilesUploaded(allFilesExist);
  }, [missionData]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  useEffect(() => {
    checkAllFilesStatus();
  }, [checkAllFilesStatus]);

  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
      <MissionActivationTable missionData={missionData} />

      {missionData?.xpert_associated_status && (
        <>
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
              <h3 className="text-center text-md font-medium text-[#222222]">
                XPERT
                {missionData.xpert_associated_status
                  ? ` - ${convertStatusXpertValue(missionData.xpert_associated_status)}`
                  : null}
                {missionData.xpert_associated_status === 'cdi' ? (
                  <span> - ( XPERT ONE )</span>
                ) : null}
              </h3>
              <XpertActivationMissionTable
                missionData={missionData}
                fileStatuses={fileStatuses}
                onFileUpload={checkAllFilesStatus}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
              <h3 className="text-center text-md font-medium text-[#222222]">
                FOURNISSEUR
              </h3>
              <FournisseurActivationMissionTable
                missionData={missionData}
                fileStatuses={fileStatuses}
                onFileUpload={checkAllFilesStatus}
              />
            </div>
          </div>
        </>
      )}

      {!missionData?.xpert_associated_status && (
        <div className="mt-4 text-center text-gray-500">
          Veuillez sélectionner et enregistrer un statut pour l'expert avant de
          continuer
        </div>
      )}

      {allFilesUploaded && (
        <div className="pt-4">
          <Button
            className="px-spaceLarge py-spaceContainer text-white"
            onClick={() =>
              router.push(
                `/facturation/gestion-des-facturations/${params.slug}`
              )
            }
          >
            Vers gestion de facturation
          </Button>
        </div>
      )}
    </div>
  );
}
