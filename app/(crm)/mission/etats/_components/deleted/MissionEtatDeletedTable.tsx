import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatDeletedRow from './MissionEtatDeletedRow';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatDeletedTable() {
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
        onValueChange={() => {}}
        placeholder="Créer le"
      />
      <FilterButton placeholder="N° de fournisseur" filter={false} />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Référent Xpert One" filter={false} />
      <FilterButton placeholder="Perdu / Supprimée le" />
      <FilterButton placeholder="Motif" filter={false} />
      <FilterButton
        placeholder="Commentaire"
        filter={false}
        className="col-span-2"
      />

      {missions.map((mission) => (
        <MissionEtatDeletedRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
