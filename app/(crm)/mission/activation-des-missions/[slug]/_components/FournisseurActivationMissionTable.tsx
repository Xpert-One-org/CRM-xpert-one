import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import FournisseurActivationMissionRow from './FournisseurActivationMissionRow';
import type { DBMission } from '@/types/typesDb';

export default function FournisseurActivationMissionTable({
  missionData,
}: {
  missionData: DBMission;
}) {
  return (
    <>
      <div className="grid grid-cols-6 gap-3">
        <FilterButton
          className="col-span-3"
          placeholder="Document"
          filter={false}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Modèle"
          filter={false}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Load manuel"
          filter={false}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Etat"
          filter={false}
        />

        <FournisseurActivationMissionRow missionData={missionData} />
      </div>
    </>
  );
}
