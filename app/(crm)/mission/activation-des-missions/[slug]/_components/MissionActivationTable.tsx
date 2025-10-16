import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionActivationRow from './MissionActivationRow';
import type { DBMission } from '@/types/typesDb';

export default function MissionActivationTable({
  missionData,
}: {
  missionData: DBMission | undefined;
}) {
  return (
    <div className="grid grid-cols-8 gap-3">
      <FilterButton
        placeholder="État de la mission"
        filter={true}
        options={[]}
        onValueChange={() => {}}
      />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Référent Xpert One" filter={false} />
      <FilterButton placeholder="Statut de l'XPERT" filter={false} />
      <FilterButton placeholder="Date de début prévisionnelle" filter={false} />
      <FilterButton placeholder="Date de début définitive" filter={false} />
      <FilterButton placeholder="Fournisseur" filter={false} />
      <FilterButton placeholder="XPERT" filter={false} />

      {missionData && (
        <MissionActivationRow key={missionData.id} mission={missionData} />
      )}
    </div>
  );
}
