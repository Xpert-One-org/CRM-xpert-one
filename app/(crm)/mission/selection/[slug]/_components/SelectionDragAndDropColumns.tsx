'use client';

import { Box } from '@/components/ui/box';
import React from 'react';
import SelectionMatchedXpertCard from './SelectionMatchedXpertCard';
import { Droppable } from '@hello-pangea/dnd';
import type { ColumnStatus, DBMissionXpertsSelection } from '@/types/typesDb';
import { columns } from '@/constants/columnStatus';
import { useIsIntern } from '@/hooks/useIsIntern';

export default function SelectionDragAndDropColumns({
  xpertsSelection,
}: {
  xpertsSelection: DBMissionXpertsSelection[];
}) {
  const isIntern = useIsIntern();
  const xpertsByColumn = columns.reduce(
    (acc, column) => {
      acc[column] = xpertsSelection.filter((x) => x.column_status === column);
      return acc;
    },
    {} as Record<ColumnStatus, DBMissionXpertsSelection[]>
  );

  const getColumnBackground = (
    columnIndex: number,
    isDraggingOver: boolean
  ) => {
    if (isDraggingOver) return 'bg-[#d1dde0]/20';
    if (columnIndex === 0) return 'bg-[#d1dde0]';
    if (columnIndex === 1) return 'bg-[#bebec0]';
    return '';
  };

  const isDropDisabled = (
    droppableId: string,
    xpertsByColumn: Record<ColumnStatus, DBMissionXpertsSelection[]>
  ) => {
    if (droppableId === 'valides' && xpertsByColumn['valides'].length >= 1) {
      return true;
    }
    return false;
  };

  return (
    <>
      {columns.map((zone, index) => {
        return (
          <Droppable
            key={zone}
            droppableId={zone}
            isDropDisabled={
              isDropDisabled(zone, xpertsByColumn) || isIntern ? false : true
            }
          >
            {(provided, snapshot) => (
              <Box
                className={`col-span-1 h-[700px] overflow-y-auto ${getColumnBackground(index, snapshot.isDraggingOver)}`}
              >
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex size-full flex-col gap-2`}
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
              </Box>
            )}
          </Droppable>
        );
      })}
    </>
  );
}
