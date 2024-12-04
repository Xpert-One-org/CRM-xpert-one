'use client';

import { Box } from '@/components/ui/box';
import React, { useEffect } from 'react';
import SelectionMatchedXpertCard from './SelectionMatchedXpertCard';
import { useXpertStore } from '@/store/xpert';
import { Droppable } from '@hello-pangea/dnd';

const dropZones = [
  'postulant',
  'matching',
  'etude',
  'non-retenu',
  'discussions',
  'proposes',
  'refuses',
  'valides',
];

export default function SelectionDragAndDropColumns() {
  const { xperts, fetchXperts } = useXpertStore();

  useEffect(() => {
    fetchXperts();
  }, []);

  return (
    <>
      {dropZones.map((zone, index) => (
        <Box key={zone} className="col-span-1 h-full">
          <Droppable droppableId={zone}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex size-full ${
                  snapshot.isDraggingOver ? 'bg-gray-100' : ''
                }`}
              >
                {xperts?.[index] && (
                  <SelectionMatchedXpertCard
                    xpert={xperts[index]}
                    index={index}
                  />
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Box>
      ))}
    </>
  );
}
