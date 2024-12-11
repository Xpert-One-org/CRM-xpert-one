import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import type { DBMission } from '@/types/typesDb';
import MissionGestionFacturationRow from './MissionGestionFacturationRow';

export default function MissionGestionFacturationTable({
  missionData,
}: {
  missionData: DBMission | undefined;
}) {
  return (
    <div className="grid grid-cols-5 gap-3">
      <FilterButton
        placeholder="État de la mission"
        filter={true}
        options={[]}
        onValueChange={() => {}}
      />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Référent Xpert One" filter={false} />
      <FilterButton placeholder="Mois" filter={false} />
      <FilterButton
        placeholder="TJM Vendu GD + Charges incluses"
        filter={false}
      />

      {missionData && (
        <MissionGestionFacturationRow
          key={missionData.id}
          mission={missionData}
        />
      )}
    </div>
  );
}
