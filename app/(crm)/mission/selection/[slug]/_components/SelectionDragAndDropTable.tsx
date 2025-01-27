'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import { FilterButton } from '@/components/FilterButton';
import React, { useEffect, useState } from 'react';
import SelectionDragAndDropColumns from './SelectionDragAndDropColumns';
import type { ColumnStatus, DBMissionXpertsSelection } from '@/types/typesDb';
import { getXpertsSelection } from '../../selection.action';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMissionStore } from '@/store/mission';
import CreatableSelect from '@/components/CreatableSelect';

export default function SelectionDragAndDropTable({
  missionId,
}: {
  missionId: number;
}) {
  const { updateSelectionMission } = useMissionStore();

  const [xpertsSelection, setXpertsSelection] = useState<
    DBMissionXpertsSelection[]
  >([]);
  const [pendingUpdates, setPendingUpdates] = useState<
    {
      selectionId: number;
      newStatus: ColumnStatus;
    }[]
  >([]);

  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const xpertSelection = xpertsSelection.find(
      (xpert) => xpert.xpert_id === draggableId
    );

    if (!xpertSelection) return;

    const updatedXperts = xpertsSelection.map((xpert) => {
      if (xpert.xpert_id === draggableId) {
        return { ...xpert, column_status: destination.droppableId };
      }
      return xpert;
    });

    const sortedUpdatedXperts = [...updatedXperts].sort(
      (a, b) => b.matching_score - a.matching_score
    );

    setXpertsSelection(sortedUpdatedXperts);

    setPendingUpdates((prev) => [
      ...prev,
      {
        selectionId: xpertSelection.id,
        newStatus: destination.droppableId,
      },
    ]);
  };

  const handleSaveUpdates = async () => {
    try {
      await Promise.all(
        pendingUpdates.map((update) =>
          updateSelectionMission(
            update.selectionId,
            update.newStatus,
            missionId,
            xpertsSelection.find((xpert) => xpert.id === update.selectionId)
              ?.xpert_id ?? ''
          )
        )
      );

      toast.success('Modifications enregistrées avec succès');
      setPendingUpdates([]);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des modifications");
    }
  };

  useEffect(() => {
    const fetchMatchedXperts = async () => {
      if (missionId) {
        const data = await getXpertsSelection(missionId);
        if (data) {
          const sortedData = [...data].sort(
            (a, b) => b.matching_score - a.matching_score
          );
          setXpertsSelection(sortedData as DBMissionXpertsSelection[]);
        }
      }
    };

    fetchMatchedXperts();
  }, [missionId]);

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-8 gap-3">
          <FilterButton placeholder="Postulant" />
          <FilterButton
            placeholder={`${xpertsSelection.filter((xpert) => xpert.column_status === 'matching').length} matching`}
          />
          <FilterButton placeholder="A l'étude" filter={false} />
          <FilterButton placeholder="Non retenu par XPERT ONE" filter={false} />
          <FilterButton placeholder="En discussions" filter={false} />
          <FilterButton placeholder="XPERT proposés" filter={false} />
          <FilterButton placeholder="XPERT Refusés" filter={false} />
          <FilterButton placeholder="XPERT Validés" filter={false} />
        </div>

        <div className="grid grid-cols-8 gap-3">
          <SelectionDragAndDropColumns xpertsSelection={xpertsSelection} />
        </div>
      </DragDropContext>

      {pendingUpdates.length > 0 && (
        <div className="fixed bottom-10 right-10">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={handleSaveUpdates}
          >
            Enregistrer
          </Button>
        </div>
      )}
    </>
  );
}
