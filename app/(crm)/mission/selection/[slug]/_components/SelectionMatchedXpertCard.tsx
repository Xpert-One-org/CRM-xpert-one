'use client';

import { Button } from '@/components/ui/button';
import type { DBMissionXpertsSelection } from '@/types/typesDb';
import { uppercaseFirstLetter } from '@/utils/string';
import { Draggable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelectionMatchedXpertCard({
  xpertsSelection,
  index,
}: {
  xpertsSelection: DBMissionXpertsSelection;
  index: number;
}) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRedirect = () => {
    router.push(`/xpert?id=${xpertsSelection.xpert.generated_id}`);
  };

  return (
    <Draggable draggableId={xpertsSelection.xpert_id} index={index}>
      {(provided, snapshot) => (
        <div
          className="flex h-fit w-full flex-col"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className={`flex flex-col gap-2 rounded-lg bg-white p-3 ${
              xpertsSelection.is_candidate && xpertsSelection.is_matched
                ? 'border-[3px] border-primary'
                : xpertsSelection.is_candidate
                  ? 'border-[3px] border-dashed border-primary'
                  : ''
            }`}
          >
            <div className="flex gap-2">
              <div
                className={`flex items-center rounded p-[10px] text-white ${
                  xpertsSelection.matching_score === 100
                    ? 'bg-[#92C6B0]'
                    : xpertsSelection.matching_score > 50
                      ? 'bg-accent'
                      : 'bg-[#D64242]'
                }`}
              >
                {xpertsSelection.matching_score}%
              </div>
              <div className="text-start">
                <p className="font-normal">
                  {uppercaseFirstLetter(xpertsSelection.xpert.firstname ?? '')}
                </p>
                <p className="font-medium">
                  {uppercaseFirstLetter(xpertsSelection.xpert.lastname ?? '')}
                </p>
              </div>
            </div>
            {isExpanded && (
              <div className="my-2">
                <Button
                  className="w-full rounded-[12px] border-2 border-gray-200 p-2 text-white"
                  onClick={handleRedirect}
                >
                  {xpertsSelection.xpert.generated_id}
                </Button>
              </div>
            )}
          </div>
          <div className="-mt-3 flex w-full justify-center">
            {isExpanded ? (
              <ChevronUp
                className="size-6 cursor-pointer rounded-full border-2 border-gray-200 bg-white p-1"
                onClick={() => setIsExpanded(false)}
              />
            ) : (
              <ChevronDown
                className="size-6 cursor-pointer rounded-full border-2 border-gray-200 bg-white p-1"
                onClick={() => setIsExpanded(true)}
              />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
