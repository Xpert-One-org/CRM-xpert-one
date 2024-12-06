'use client';

import { Button } from '@/components/ui/button';
import type { DBMissionXpertsSelection } from '@/types/typesDb';
import { uppercaseFirstLetter } from '@/utils/string';
import { Draggable } from '@hello-pangea/dnd';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateMissionXpertAssociated } from '../../selection.action';
import { toast } from 'sonner';

export default function SelectionMatchedXpertCard({
  xpertsSelection,
  index,
  showActivationButton,
}: {
  xpertsSelection: DBMissionXpertsSelection;
  index: number;
  showActivationButton: boolean;
}) {
  const params = useParams<{ slug: string }>();
  const { slug } = params;
  const missionNumber = slug.replace('-', ' ');

  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleRedirect = () => {
    router.push(`/xpert?id=${xpertsSelection.xpert.generated_id}`);
  };

  const handleActivation = async () => {
    try {
      setIsActivating(true);
      await updateMissionXpertAssociated(
        xpertsSelection.mission_id,
        xpertsSelection.xpert_id
      );
      toast.success("L'expert a été activé à la mission avec succès");
      router.push(
        `/mission/activation-des-missions/${missionNumber.replace(' ', '-')}`
      );
    } catch (error) {
      toast.error("Erreur lors de l'activation de l'expert");
    } finally {
      setIsActivating(false);
    }
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
              <div className="my-2 flex flex-col gap-2">
                <Button
                  className="w-full rounded-[12px] border-2 border-gray-200 p-2 text-white"
                  onClick={handleRedirect}
                >
                  {xpertsSelection.xpert.generated_id}
                </Button>
                {showActivationButton && (
                  <Button
                    className="w-full rounded-[12px] bg-[#92C6B0] p-2 text-white hover:bg-[#92C6B0]/80"
                    onClick={handleActivation}
                    disabled={isActivating}
                  >
                    {isActivating ? 'Activation...' : 'Activation de mission'}
                  </Button>
                )}
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
