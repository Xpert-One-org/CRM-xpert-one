import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatFinishedRowSkeleton from './MissionEtatFinishedRowSkeleton';

export default function MissionEtatFinishedTableSkeleton() {
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
        <FilterButton placeholder="Référent Xpert One" filter={false} />
        <FilterButton placeholder="N° XPERT" filter={false} />
        <FilterButton
          className="col-span-2"
          placeholder="Terminée le"
          defaultSelectedKeys=""
          onValueChange={() => {}}
        />
        <FilterButton
          placeholder="Mission dupliquée"
          defaultSelectedKeys=""
          onValueChange={() => {}}
        />
        {Array.from({ length: 3 }).map((_, index) => (
          <MissionEtatFinishedRowSkeleton key={index} />
        ))}
      </div>
    </>
  );
}
