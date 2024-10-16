import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatFinishedRow from './MissionEtatFinishedRow';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatFinishedTable() {
  const { missions } = useMissionStore();
  const signUpDateOptions = [
    { label: 'Toutes', value: '' },
    { label: '1 semaine', value: '1_week' },
    { label: '2 semaines', value: '2_weeks' },
    { label: '3 semaines', value: '3_weeks' },
    { label: '4 semaines', value: '4_weeks' },
  ];

  return (
    <div className="grid grid-cols-8 gap-3">
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
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
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
      />
      <FilterButton
        placeholder="Mission dupliquée"
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
      />
      {missions.map((mission) => (
        <MissionEtatFinishedRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
