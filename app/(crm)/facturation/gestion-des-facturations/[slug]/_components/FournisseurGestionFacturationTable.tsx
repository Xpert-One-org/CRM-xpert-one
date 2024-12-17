import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import type { DBMission } from '@/types/typesDb';
import FournisseurGestionFacturationRow from './FournisseurGestionFacturationRow';
import type { FileStatuses } from '@/types/mission';

export default function FournisseurGestionFacturationTable({
  missionData,
  selectedYear,
  selectedMonth,
  fileStatuses,
  onFileUpdate,
}: {
  missionData: DBMission;
  selectedYear: number;
  selectedMonth: number;
  fileStatuses: FileStatuses;
  onFileUpdate: () => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-6 gap-3">
      <FilterButton
        className="col-span-3"
        placeholder="Document"
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
        placeholder="N° de commande à rappeler"
        filter={false}
      />

      <FournisseurGestionFacturationRow
        missionData={missionData}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        fileStatuses={fileStatuses}
        onFileUpdate={onFileUpdate}
      />
    </div>
  );
}
