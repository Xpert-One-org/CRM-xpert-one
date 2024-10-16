import React from 'react';
import MissionEtatOpenRowSkeleton from './MissionEtatOpenRowSkeleton';
import { FilterButton } from '@/components/FilterButton';

export default function MissionEtatOpenTableSkeleton() {
  return (
    <>
      <div className="grid grid-cols-11 gap-3">
        <FilterButton
          defaultSelectedKeys=""
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
        <FilterButton
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Remise des candidatures"
        />
        <FilterButton placeholder="Poste" filter={false} />
        <FilterButton placeholder="Matching" filter={false} />
        <FilterButton placeholder="Discussion" filter={false} />
        <FilterButton placeholder="Proposés" filter={false} />
        <FilterButton placeholder="Refusés" filter={false} />

        {Array.from({ length: 3 }).map((_, index) => (
          <MissionEtatOpenRowSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
