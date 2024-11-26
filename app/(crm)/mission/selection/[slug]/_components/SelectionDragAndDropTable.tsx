import { FilterButton } from '@/components/FilterButton';
import React from 'react';

export default function SelectionDragAndDropTable() {
  return (
    <div className="grid grid-cols-8 gap-3">
      <FilterButton placeholder="Postulant" />
      <FilterButton placeholder="52 matching" />
      <FilterButton placeholder="A l’étude" filter={false} />
      <FilterButton placeholder="Non retenu par XPERT ONE" filter={false} />
      <FilterButton placeholder="En discussions" filter={false} />
      <FilterButton placeholder="XPERT proposés" filter={false} />
      <FilterButton placeholder="XPERT Refusés" filter={false} />
      <FilterButton placeholder="XPERT Validés" filter={false} />
    </div>
  );
}
