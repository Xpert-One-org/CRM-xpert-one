'use client';

import { Button } from '@/components/ui/button';
import type { DBXpert } from '@/types/typesDb';
import { uppercaseFirstLetter } from '@/utils/string';
import { Draggable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SelectionMatchedXpertCard({
  xpert,
  index,
}: {
  xpert: DBXpert;
  index: number;
}) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRedirect = () => {
    router.push(`/xpert?id=${xpert.generated_id}`);
  };

  return (
    <Draggable draggableId={xpert.id} index={index}>
      {(provided, snapshot) => (
        <div
          className="flex h-fit w-full flex-col"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex flex-col gap-2 rounded-lg bg-white p-3">
            <div className="flex gap-2">
              <div className="flex items-center rounded bg-[#92C6B0] p-[10px] text-white">
                100%
              </div>
              <div className="text-start">
                <p className="font-normal">
                  {uppercaseFirstLetter(xpert.firstname ?? '')}
                </p>
                <p className="font-medium">
                  {uppercaseFirstLetter(xpert.lastname ?? '')}
                </p>
              </div>
            </div>
            {isExpanded && (
              <div className="my-2">
                <Button
                  className="w-full rounded-[12px] border-2 border-gray-200 p-2 text-white"
                  onClick={handleRedirect}
                >
                  {xpert.generated_id}
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
