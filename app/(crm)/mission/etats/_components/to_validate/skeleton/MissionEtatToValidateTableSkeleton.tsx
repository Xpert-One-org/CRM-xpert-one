import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatToValidateRowSkeleton from './MissionEtatToValidateRowSkeleton';

export default function MissionEtatToValidateTableSkeleton() {
  return (
    <>
      <div className="grid grid-cols-8 gap-3">
        <FilterButton
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Créer le"
        />
        <FilterButton placeholder="N° de fournisseur" filter={false} />
        <FilterButton placeholder="N° de mission" filter={false} />
        <FilterButton
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Référent Xpert One"
          filter={false}
        />
        <FilterButton
          placeholder="Temps avant début de mission"
          filter={false}
        />
        <FilterButton placeholder="Poste" filter={false} />
        <FilterButton placeholder="Ouverte à tous" filter={false} />
        <FilterButton placeholder="Valider la mission ?" filter={false} />

        {Array.from({ length: 3 }).map((_, index) => (
          <MissionEtatToValidateRowSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
