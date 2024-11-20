import React from 'react';
import { FilterButton } from '@/components/FilterButton';
import MissionEtatOpenRow from './MissionEtatOpenRow';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatOpenTable() {
  const { missions } = useMissionStore();
  const signUpDateOptions = [
    { label: 'Toutes', value: '' },
    { label: '1 semaine', value: '1_week' },
    { label: '2 semaines', value: '2_weeks' },
    { label: '3 semaines', value: '3_weeks' },
    { label: '4 semaines', value: '4_weeks' },
  ];

  return (
    <div className="grid grid-cols-11 gap-3">
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="Créer le"
      />
      <FilterButton placeholder="N° de fournisseur" filter={false} />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Référent Xpert One" filter={false} />
      <FilterButton placeholder="Temps avant début de mission" filter={false} />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="Remise des candidatures"
      />
      <FilterButton placeholder="Poste" filter={false} />
      <FilterButton placeholder="Matching" filter={false} />
      <FilterButton placeholder="Discussion" filter={false} />
      <FilterButton placeholder="Proposés" filter={false} />
      <FilterButton placeholder="Refusés" filter={false} />

      {missions.map((mission) => (
        <MissionEtatOpenRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
