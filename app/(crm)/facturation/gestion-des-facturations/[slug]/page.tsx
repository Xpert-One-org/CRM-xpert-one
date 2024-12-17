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
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

export default function GestionDesFacturationsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(props.params);
  const missionNumber = params.slug.replaceAll('-', ' ');
  const router = useRouter();
  const { missions, fetchMissions } = useMissionStore();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [fileStatuses, setFileStatuses] = useState<FileStatuses>({});
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

  const handleDateChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const checkAllFiles = useCallback(async () => {
    if (!missionData) return;

    const filesToCheck = [
      'presence_sheet_signed',
      'presence_sheet_validated',
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

    setFileStatuses(newFileStatuses);
  }, [missionData]);

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
          const basePath = `${missionNumber}/${xpertId}/facturation/${year}/${month}/presence_sheet_signed`;

          const { data: files } = await supabase.storage
            .from('mission_files')
            .list(basePath);

          if (files && files.length > 0) {
            const mostRecentFile = files[0];
            const sourceFilePath = `${basePath}/${mostRecentFile.name}`;
            const validatedFilePath = sourceFilePath.replace(
              'presence_sheet_signed',
              'presence_sheet_validated'
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
          const basePath = `${missionNumber}/${xpertId}/facturation/${year}/${month}/presence_sheet_signed`;

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
      checkAllFiles();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error("Erreur lors de l'enregistrement des modifications");
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  useEffect(() => {
    checkAllFiles();
  }, [checkAllFiles]);

  console.log(pendingChanges);

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
                fileStatuses={fileStatuses}
                onFileUpdate={checkAllFiles}
              />
            </div>
          </div>
        </>
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
