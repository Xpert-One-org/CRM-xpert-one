import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatInProgressRow from './MissionEtatInProgressRow';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatInProgressTable() {
  const { missions } = useMissionStore();

  return (
    <>
      <div className="grid grid-cols-9 gap-3">
        <FilterButton
          options={[]}
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
