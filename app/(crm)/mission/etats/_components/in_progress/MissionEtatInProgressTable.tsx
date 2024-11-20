import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatInProgressRow from './MissionEtatInProgressRow';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatInProgressTable() {
  const { missions } = useMissionStore();
  const signUpDateOptions = [
    { label: 'Toutes', value: '' },
    { label: '1 semaine', value: '1_week' },
    { label: '2 semaines', value: '2_weeks' },
    { label: '3 semaines', value: '3_weeks' },
    { label: '4 semaines', value: '4_weeks' },
  ];

  return (
    <>
      <div className="grid grid-cols-9 gap-3">
        <FilterButton
          options={signUpDateOptions}
          onValueChange={() => {}}
          placeholder="Créer le"
        />
        <FilterButton placeholder="N° de fournisseur" filter={false} />
        <FilterButton placeholder="N° de mission" filter={false} />
        <FilterButton placeholder="Référent Xpert One" filter={false} />
        <FilterButton
          placeholder="Temps avant début de mission"
          filter={false}
        />
        <FilterButton placeholder="N° XPERT" filter={false} />
        <FilterButton placeholder="Xpert: Documents mission" />
        <FilterButton placeholder="Xpert : Commande / Devis / CDI" />
        <FilterButton placeholder="Fournisseur : Commande" />
        {missions.map((mission) => (
          <MissionEtatInProgressRow key={mission.id} mission={mission} />
        ))}
      </div>
    </>
  );
}
