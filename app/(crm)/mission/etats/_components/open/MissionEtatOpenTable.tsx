import React, { useState } from 'react';
import { FilterButton } from '@/components/FilterButton';
import MissionEtatOpenRow from './MissionEtatOpenRow';
import { useMissionStore } from '@/store/mission';
import { sortDateOptions } from '@/data/filter';

export default function MissionEtatOpenTable() {
  const { missions } = useMissionStore();
  const [sortedMissions, setSortedMissions] = useState(missions);

  const handleSortDateChange = (value: string) => {
    const filteredMissions = missions.filter(
      (mission) => mission.state === 'open' || mission.state === 'open_all'
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
      : missions.filter(
          (mission) => mission.state === 'open' || mission.state === 'open_all'
        );

  return (
    <div className="grid grid-cols-[repeat(17,_minmax(0,_1fr))] gap-2">
      <FilterButton
        options={sortDateOptions}
        onValueChange={handleSortDateChange}
        placeholder="Créer le"
        showSelectedOption={true}
        sortable
        data={missions}
        sortKey="created_at"
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

      {filteredMissions.map((mission) => (
        <MissionEtatOpenRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
