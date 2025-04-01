import { FilterButton } from '@/components/FilterButton';
import React, { useState } from 'react';
import MissionEtatFinishedRow from './MissionEtatFinishedRow';
import { useMissionStore } from '@/store/mission';
import { sortDateOptions } from '@/data/filter';

export default function MissionEtatFinishedTable() {
  const { missions } = useMissionStore();
  const [sortedMissions, setSortedMissions] = useState(missions);

  const handleSortDateChange = (value: string) => {
    const filteredMissions = missions.filter(
      (mission) => mission.state === 'finished'
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
      : missions.filter((mission) => mission.state === 'finished');

  return (
    <div className="grid grid-cols-8 gap-3">
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
      {filteredMissions.map((mission) => (
        <MissionEtatFinishedRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
