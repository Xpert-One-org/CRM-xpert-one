'use client';

import { Box } from '@/components/ui/box';
import React from 'react';
import SelectionMatchedXpertCard from './SelectionMatchedXpertCard';
import { Droppable } from '@hello-pangea/dnd';
import type { ColumnStatus, DBMissionXpertsSelection } from '@/types/typesDb';

const columns: ColumnStatus[] = [
  'postulant',
  'matching',
  'etude',
  'non-retenu',
  'discussions',
  'proposes',
  'refuses',
  'valides',
];

export default function SelectionDragAndDropColumns({
  xpertsSelection,
}: {
  xpertsSelection: DBMissionXpertsSelection[];
}) {
  const xpertsByColumn = columns.reduce(
    (acc, column) => {
      acc[column] = xpertsSelection.filter((x) => x.column_status === column);
      return acc;
    },
    {} as Record<ColumnStatus, DBMissionXpertsSelection[]>
  );

  return (
    <>
      {columns.map((zone, index) => (
        <Box
          key={zone}
          className={`col-span-1 h-[700px] overflow-y-auto ${index === 0 ? 'bg-[#d1dde0]' : ''} ${index === 1 ? 'bg-[#bebec0]' : ''}`}
        >
          <Droppable droppableId={zone}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex size-full flex-col gap-2 ${
                  snapshot.isDraggingOver ? 'bg-gray-100' : ''
                } ${index === 0 ? 'bg-[#d1dde0]' : ''} ${
                  index === 1 ? 'bg-[#bebec0]' : ''
                }`}
              >
                {xpertsByColumn[zone]?.map((xpertSelection, idx) => (
                  <SelectionMatchedXpertCard
                    key={xpertSelection.id}
                    xpertsSelection={xpertSelection}
                    index={idx}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      ))}
    </>
  );
}
