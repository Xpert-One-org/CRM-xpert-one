import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import MissionEtatDeletedRowSkeleton from './MissionEtatDeletedRowSkeleton';

export default function MissionEtatDeletedTableSkeleton() {
  return (
    <div className="grid grid-cols-8 gap-3">
      <FilterButton
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Créer le"
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

      {Array.from({ length: 3 }).map((_, index) => (
        <MissionEtatDeletedRowSkeleton key={index} />
      ))}
    </div>
  );
}
