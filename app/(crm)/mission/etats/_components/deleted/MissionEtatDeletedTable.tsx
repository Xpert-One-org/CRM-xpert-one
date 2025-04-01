import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
import MissionEtatDeletedRow from './MissionEtatDeletedRow';
import { useMissionStore } from '@/store/mission';
import { sortDateOptions } from '@/data/filter';

export default function MissionEtatDeletedTable() {
  const { missions } = useMissionStore();
  const [sortedMissions, setSortedMissions] = useState(missions);

  // Trier les missions par défaut selon deleted_at, de la plus récente à la plus ancienne
  useEffect(() => {
    const filteredMissions = missions.filter(
      (mission) => mission.state === 'deleted' || mission.state === 'refused'
    );

    // Tri par défaut: du plus récent au plus ancien (descendant) selon deleted_at
    const sorted = [...filteredMissions].sort((a, b) => {
      // Si deleted_at n'existe pas, utiliser created_at comme fallback
      const dateA = a.deleted_at
        ? new Date(a.deleted_at).getTime()
        : new Date(a.created_at).getTime();
      const dateB = b.deleted_at
        ? new Date(b.deleted_at).getTime()
        : new Date(b.created_at).getTime();
      return dateB - dateA; // Ordre descendant (plus récent d'abord)
    });

    setSortedMissions(sorted);
  }, [missions]);

  const handleSortDateChange = (value: string) => {
    const filteredMissions = missions.filter(
      (mission) => mission.state === 'deleted' || mission.state === 'refused'
    );
    if (value === '') {
      // Quand aucune valeur n'est sélectionnée, revenir au tri par défaut (descendant) selon deleted_at
      const defaultSorted = [...filteredMissions].sort((a, b) => {
        const dateA = a.deleted_at
          ? new Date(a.deleted_at).getTime()
          : new Date(a.created_at).getTime();
        const dateB = b.deleted_at
          ? new Date(b.deleted_at).getTime()
          : new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      setSortedMissions(defaultSorted);
      return;
    }

    const sorted = [...filteredMissions].sort((a, b) => {
      // Utiliser deleted_at pour le tri au lieu de created_at
      const dateA = a.deleted_at
        ? new Date(a.deleted_at).getTime()
        : new Date(a.created_at).getTime();
      const dateB = b.deleted_at
        ? new Date(b.deleted_at).getTime()
        : new Date(b.created_at).getTime();
      return value === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setSortedMissions(sorted);
  };

  // Utiliser directement les missions triées
  const filteredMissions = sortedMissions;

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
      <FilterButton placeholder="Perdu / Supprimée le" />
      <FilterButton placeholder="Motif" filter={false} />
      <FilterButton
        placeholder="Commentaire"
        filter={false}
        className="col-span-2"
      />

      {filteredMissions.map((mission) => (
        <MissionEtatDeletedRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
