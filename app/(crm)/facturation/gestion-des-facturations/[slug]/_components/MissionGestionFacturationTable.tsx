import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import type { DBMission } from '@/types/typesDb';
import MissionGestionFacturationRow from './MissionGestionFacturationRow';

export default function MissionGestionFacturationTable({
  missionData,
  selectedYear,
  selectedMonth,
}: {
  missionData: DBMission | undefined;
  selectedYear: number;
  selectedMonth: number;
}) {
  return (
    <div className="grid grid-cols-7 gap-3">
      <FilterButton
        placeholder="État de la mission"
        filter={true}
        options={[]}
        onValueChange={() => {}}
      />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Référent Xpert One" filter={false} />
      <FilterButton placeholder="Date de début de mission" filter={false} />
      <FilterButton placeholder="Date de fin de mission" filter={false} />
      <FilterButton placeholder="Mois / Année sélectionné" filter={false} />

      <FilterButton
        placeholder="TJM Vendu GD + Charges incluses"
        filter={false}
      />

      {missionData && (
        <MissionGestionFacturationRow
          key={missionData.id}
          mission={missionData}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      )}
    </div>
  );
}
