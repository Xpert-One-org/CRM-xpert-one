import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatFinishedRow from './MissionEtatFinishedRow';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatFinishedTable() {
  const { missions } = useMissionStore();

  return (
    <div className="grid grid-cols-8 gap-3">
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Créer le"
      />
      <FilterButton placeholder="N° de fournisseur" filter={false} />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Référent Xpert One" filter={false} />
      <FilterButton placeholder="N° XPERT" filter={false} />
      <FilterButton
        className="col-span-2"
        placeholder="Terminée le"
        options={[]}
        onValueChange={() => {}}
      />
      <FilterButton
        placeholder="Mission dupliquée"
        options={[]}
        onValueChange={() => {}}
      />
      {missions.map((mission) => (
        <MissionEtatFinishedRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
