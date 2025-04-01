import { FilterButton } from '@/components/FilterButton';
import React, { useState } from 'react';
import MissionEtatInProgressRow from './MissionEtatInProgressRow';
import { useMissionStore } from '@/store/mission';
import { sortDateOptions } from '@/data/filter';

// Ajout d'un tableau local avec une option de réinitialisation
const sortDateOptionsWithReset = [
  ...sortDateOptions,
  { label: 'Réinitialiser', value: '' },
];

export default function MissionEtatInProgressTable() {
  const { missions } = useMissionStore();
  const [sortedMissions, setSortedMissions] = useState(missions);

  const handleSortDateChange = (value: string) => {
    const filteredMissions = missions.filter(
      (mission) => mission.state === 'in_progress'
    );
    if (value === '') {
      setSortedMissions(filteredMissions);
      return;
    }

    const sorted = [...filteredMissions].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return value === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setSortedMissions(sorted);
  };

  // Filtrer les missions initiales
  const filteredMissions =
    sortedMissions.length > 0
      ? sortedMissions
      : missions.filter((mission) => mission.state === 'in_progress');

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
        <FilterButton
          options={sortDateOptionsWithReset}
          onValueChange={handleSortDateChange}
          placeholder="Créer le"
          showSelectedOption={true}
          filter={true}
          data={missions}
          sortKey="created_at"
        />
        <FilterButton placeholder="N° de fournisseur" filter={false} />
        <FilterButton placeholder="N° de mission" filter={false} />
        <FilterButton placeholder="Référent Xpert One" filter={false} />
        <FilterButton
          placeholder="Temps avant début de mission"
          filter={false}
        />
        <FilterButton placeholder="N° XPERT" filter={false} />
        <FilterButton
          className="col-span-2"
          placeholder="Xpert: Documents mission"
        />
        <FilterButton placeholder="Xpert : Commande / Devis / CDI" />
        <FilterButton placeholder="Fournisseur : Commande" />
        <FilterButton placeholder="Activation" filter={false} />
        <FilterButton placeholder="Facturation" filter={false} />
        {filteredMissions.map((mission) => (
          <MissionEtatInProgressRow key={mission.id} mission={mission} />
        ))}
      </div>
    </>
  );
}
