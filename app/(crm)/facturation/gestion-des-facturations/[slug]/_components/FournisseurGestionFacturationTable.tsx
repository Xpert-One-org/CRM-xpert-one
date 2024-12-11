import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import type { DBMission } from '@/types/typesDb';
import FournisseurGestionFacturationRow from './FournisseurGestionFacturationRow';

export default function FournisseurGestionFacturationTable({
  missionData,
}: {
  missionData: DBMission;
}) {
  return (
    <div className="grid grid-cols-6 gap-3">
      <FilterButton
        className="col-span-3"
        placeholder="Document"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Load manuel"
        filter={false}
      />
      <FilterButton className="col-span-1" placeholder="Etat" filter={false} />
      <FilterButton
        className="col-span-1"
        placeholder="N° de commande à rappeler"
        filter={false}
      />

      <FournisseurGestionFacturationRow missionData={missionData} />
    </div>
  );
}
