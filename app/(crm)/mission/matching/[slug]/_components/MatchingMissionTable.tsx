import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MatchingMissionRow from './MatchingMissionRow';
import type { DBMission } from '@/types/typesDb';

export default function MatchingMissionTable({
  missionData,
  slug,
}: {
  missionData: DBMission;
  slug: string;
}) {
  return (
    <div className="grid grid-cols-6 gap-3">
      <FilterButton placeholder="Mission" filter={true} />
      <FilterButton placeholder="N° de fournisseur" filter={false} />
      <FilterButton placeholder="Fournisseur" filter={false} />
      <FilterButton placeholder="Nom fournisseur" filter={false} />
      <FilterButton placeholder="Prénom fournisseur" filter={false} />
      <FilterButton placeholder="Poste ouvert à tous" filter={false} />

      <MatchingMissionRow
        key={missionData.id}
        mission={missionData}
        slug={slug}
      />
    </div>
  );
}
