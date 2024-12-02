import { DragDropContext } from '@hello-pangea/dnd';
import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import SelectionDragAndDropColumns from './SelectionDragAndDropColumns';

export default function SelectionDragAndDropTable() {
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    console.log(
      `Moved from ${source.droppableId} to ${destination.droppableId}`
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-8 gap-3">
        <FilterButton placeholder="Postulant" />
        <FilterButton placeholder="52 matching" />
        <FilterButton placeholder="A l'étude" filter={false} />
        <FilterButton placeholder="Non retenu par XPERT ONE" filter={false} />
        <FilterButton placeholder="En discussions" filter={false} />
        <FilterButton placeholder="XPERT proposés" filter={false} />
        <FilterButton placeholder="XPERT Refusés" filter={false} />
        <FilterButton placeholder="XPERT Validés" filter={false} />
      </div>
      <div className="grid h-full grid-cols-8 gap-3">
        <SelectionDragAndDropColumns />
      </div>
    </DragDropContext>
  );
}
