import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import type { DBMission, DBProfileStatus } from '@/types/typesDb';
import XpertGestionFacturationRow from './XpertGestionFacturationRow';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';

export default function XpertGestionFacturationTable({
  status,
  missionData,
  selectedYear,
  selectedMonth,
  onPendingChange,
}: {
  status: DBProfileStatus['status'];
  missionData: DBMission;
  selectedYear: number;
  selectedMonth: number;
  onPendingChange?: (
    type: 'validation' | 'deletion',
    key: string,
    value: boolean
  ) => void;
}) {
  const { checkAllFiles } = useFileStatusFacturationStore();

  return (
    <div className="grid grid-cols-7 gap-3">
      <FilterButton
        className="col-span-3"
        placeholder="Document"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Modèle"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Load manuel"
        filter={false}
      />
      <FilterButton className="col-span-1" placeholder="Etat" filter={false} />
      <FilterButton
        className="col-span-1"
        placeholder="Validation"
        filter={false}
      />

      <XpertGestionFacturationRow
        status={status}
        missionData={missionData}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onFileUpdate={() => checkAllFiles(missionData)}
        onPendingChange={onPendingChange}
      />
    </div>
  );
}
