import React from 'react';
import { FilterButton } from '@/components/FilterButton';
import MissionEtatOpenRow from './MissionEtatOpenRow';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatOpenTable() {
  const { missions } = useMissionStore();

  return (
    <div className="grid grid-cols-[repeat(17,_minmax(0,_1fr))] gap-2">
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Créer le"
      />
      <FilterButton placeholder="N° de fournisseur" filter={false} />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Date de début" filter={false} />
      <FilterButton placeholder="Date de fin" filter={false} />
      <FilterButton placeholder="Temps avant début de mission" filter={false} />
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Remise des candidatures"
      />
      <FilterButton className="col-span-2" placeholder="Poste" filter={false} />
      <FilterButton placeholder="Lieu" filter={false} />
      <FilterButton placeholder="Matching" filter={false} />
      <FilterButton placeholder="Discussion" filter={false} />
      <FilterButton placeholder="Proposés" filter={false} />
      <FilterButton placeholder="Refusés" filter={false} />
      <FilterButton placeholder="Site vitrine" filter={false} />
      <FilterButton placeholder="Matching" filter={false} />
      <FilterButton placeholder="Selection" filter={false} />

      {missions.map((mission) => (
        <MissionEtatOpenRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
