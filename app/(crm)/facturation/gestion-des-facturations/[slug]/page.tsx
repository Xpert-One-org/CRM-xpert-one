'use client';

import React, { use, useEffect, useState, useCallback } from 'react';
import { useMissionStore } from '@/store/mission';
import HeaderCalendar from './_components/HeaderCalendar';
import XpertGestionFacturationTable from './_components/XpertGestionFacturationTable';
import FournisseurGestionFacturationTable from './_components/FournisseurGestionFacturationTable';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';
import MissionGestionFacturationTable from './_components/MissionGestionFacturationTable';
import { checkFileExistsFacturations } from './_utils/check-file-mission.action';
import type { FileStatuses } from '@/types/mission';

export default function GestionDesFacturationsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const missionNumber = params.slug.replaceAll('-', ' ');
  const { missions, fetchMissions } = useMissionStore();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [fileStatuses, setFileStatuses] = useState<FileStatuses>({});

  const missionData = missions.find(
    (mission) => mission.mission_number === missionNumber
  );

  const handleDateChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const checkAllFiles = useCallback(async () => {
    if (!missionData) return;

    const filesToCheck = [
      'presence_sheet_signed',
      missionData.xpert_associated_status === 'cdi'
        ? 'salary_sheet'
        : 'invoice_received',
      'invoice',
    ];

    const newFileStatuses: FileStatuses = {};

    for (const fileType of filesToCheck) {
      const result = await checkFileExistsFacturations(fileType, missionData);
      newFileStatuses[fileType] = result;
    }

    console.log('All files status:', newFileStatuses);
    setFileStatuses(newFileStatuses);
  }, [missionData]);

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  useEffect(() => {
    checkAllFiles();
  }, [checkAllFiles, selectedYear, selectedMonth]);

  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer md:px-0">
      <HeaderCalendar
        startDate={missionData?.start_date ?? undefined}
        onDateChange={handleDateChange}
        fileStatuses={fileStatuses}
        status={missionData?.xpert_associated_status ?? ''}
      />
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
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                fileStatuses={fileStatuses}
                onFileUpdate={checkAllFiles}
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
                fileStatuses={fileStatuses}
                onFileUpdate={checkAllFiles}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
