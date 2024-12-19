'use client';

import React, { use, useEffect, useState } from 'react';
import { useMissionStore } from '@/store/mission';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import HeaderCalendar from './_components/HeaderCalendar';
import XpertGestionFacturationTable from './_components/XpertGestionFacturationTable';
import FournisseurGestionFacturationTable from './_components/FournisseurGestionFacturationTable';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';
import MissionGestionFacturationTable from './_components/MissionGestionFacturationTable';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { getFileTypeByStatusFacturation } from './_utils/getFileTypeByStatusFacturation';

export default function GestionDesFacturationsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const missionNumber = params.slug.replaceAll('-', ' ');
  const router = useRouter();
  const { missions, fetchMissions } = useMissionStore();
  const { fileStatusesByMission, checkAllFiles } =
    useFileStatusFacturationStore();

  const [pendingChanges, setPendingChanges] = useState<{
    validations: { [key: string]: boolean };
    deletions: { [key: string]: boolean };
  }>({
    validations: {},
    deletions: {},
  });

  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  const [selectedYear, setSelectedYear] = useState<number>(
    missionData?.start_date
      ? new Date(missionData.start_date).getFullYear()
      : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    missionData?.start_date
      ? new Date(missionData.start_date).getMonth()
      : new Date().getMonth()
  );
  const fileStatuses = fileStatusesByMission[missionNumber] || {};

  const isBeforeMissionStart =
    selectedYear < new Date(missionData?.start_date ?? '').getFullYear() ||
    (selectedYear === new Date(missionData?.start_date ?? '').getFullYear() &&
      selectedMonth < new Date(missionData?.start_date ?? '').getMonth());

  const isAfterMissionEnd =
    selectedYear > new Date(missionData?.end_date ?? '').getFullYear() ||
    (selectedYear === new Date(missionData?.end_date ?? '').getFullYear() &&
      selectedMonth > new Date(missionData?.end_date ?? '').getMonth());

  const handleDateChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const handlePendingChange = (
    type: 'validation' | 'deletion',
    key: string,
    value: boolean
  ) => {
    setPendingChanges((prev) => ({
      ...prev,
      [type === 'validation' ? 'validations' : 'deletions']: {
        ...prev[type === 'validation' ? 'validations' : 'deletions'],
        [key]: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    const supabase = createSupabaseFrontendClient();

    try {
      for (const [key, isValidated] of Object.entries(
        pendingChanges.validations
      )) {
        if (isValidated) {
          const [missionNumber, xpertId, year, month] = key.split('|');
          const basePath = `${missionNumber}/${xpertId}/facturation/${year}/${month}/${getFileTypeByStatusFacturation(
            'presence_sheet_signed',
            missionData?.xpert_associated_status || ''
          )}`;

          const { data: files } = await supabase.storage
            .from('mission_files')
            .list(basePath);

          if (files && files.length > 0) {
            const mostRecentFile = files[0];
            const sourceFilePath = `${basePath}/${mostRecentFile.name}`;
            const validatedFilePath = sourceFilePath.replace(
              `${getFileTypeByStatusFacturation(
                'presence_sheet_signed',
                missionData?.xpert_associated_status || ''
              )}`,
              `${getFileTypeByStatusFacturation(
                'presence_sheet_validated',
                missionData?.xpert_associated_status || ''
              )}`
            );
            await supabase.storage
              .from('mission_files')
              .copy(sourceFilePath, validatedFilePath);
          }
        }
      }

      for (const [key, isDeleted] of Object.entries(pendingChanges.deletions)) {
        if (isDeleted) {
          const [missionNumber, xpertId, year, month] = key.split('|');
          const basePath = `${missionNumber}/${xpertId}/facturation/${year}/${month}/${getFileTypeByStatusFacturation(
            'presence_sheet_signed',
            missionData?.xpert_associated_status || ''
          )}`;

          const { data: files } = await supabase.storage
            .from('mission_files')
            .list(basePath);

          if (files && files.length > 0) {
            const mostRecentFile = files[0];
            const filePath = `${basePath}/${mostRecentFile.name}`;
            await supabase.storage.from('mission_files').remove([filePath]);
          }
        }
      }

      toast.success('Modifications enregistrées avec succès');
      setPendingChanges({ validations: {}, deletions: {} });
      if (missionData) {
        checkAllFiles(missionData);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error("Erreur lors de l'enregistrement des modifications");
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  useEffect(() => {
    if (missionData) {
      checkAllFiles(missionData);
    }
  }, [missionData, checkAllFiles]);

  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
      <HeaderCalendar
        startDate={
          missionData?.start_date ? new Date(missionData.start_date) : undefined
        }
        endDate={
          missionData?.end_date ? new Date(missionData.end_date) : undefined
        }
        onDateChange={handleDateChange}
        fileStatuses={fileStatuses}
        missionXpertAssociatedStatus={
          missionData?.xpert_associated_status ?? ''
        }
      />
      <div className="flex w-1/2">
        <MissionGestionFacturationTable
          missionData={missionData}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </div>

      {missionData && !isBeforeMissionStart && !isAfterMissionEnd ? (
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
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onPendingChange={handlePendingChange}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col justify-center gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
              <h3 className="text-center text-md font-medium text-[#222222]">
                FOURNISSEUR
              </h3>
              <FournisseurGestionFacturationTable
                missionData={missionData}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </div>
          </div>
        </>
      ) : (
        <p>
          Vous ne pouvez pas modifier les gérer les documents de facturation
          avant la date de début de la mission
        </p>
      )}
      <div className="flex justify-between">
        <Button
          className="bg-primary px-spaceLarge py-spaceContainer text-white"
          onClick={() => router.push('/facturation/etats-des-facturations')}
        >
          Vers état de facturation
        </Button>
        {(Object.keys(pendingChanges.validations).length > 0 ||
          Object.keys(pendingChanges.deletions).length > 0) && (
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={handleSaveChanges}
          >
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  );
}
