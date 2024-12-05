'use client';

import { Button } from '@/components/ui/button';
import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import Loader from '@/components/Loader';
import React, { useState } from 'react';
import { getAllMatchedXperts } from '../matching.action';
import MatchingXpertsTable from './MatchingXpertsTable';
import RecapMissionDialog from '@/components/dialogs/RecapMissionDialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { sendMatchedXpertsToSelectionBoard } from '../../../selection/selection.action';

export default function LaunchMatching({
  missionData,
  excludedCriteria,
  additionalCriteria,
}: {
  missionData: DBMission;
  excludedCriteria: Record<string, string[]>;
  additionalCriteria: Record<string, string[]>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [matchingResults, setMatchingResults] = useState<
    DBMatchedXpert[] | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedXperts, setSelectedXperts] = useState<Set<string>>(new Set());
  const [matchingScoresMap, setMatchingScoresMap] = useState<
    Record<string, number>
  >({});
  const router = useRouter();

  const handleLaunchMatching = async () => {
    setIsLoading(true);
    const { data } = await getAllMatchedXperts(
      missionData,
      excludedCriteria,
      additionalCriteria
    );
    setMatchingResults(data);
    setIsLoading(false);
  };

  const handleXpertSelection = (
    xpertId: string,
    checked: boolean,
    matchingScore?: number
  ) => {
    setSelectedXperts((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(xpertId);
        if (matchingScore !== undefined) {
          setMatchingScoresMap((prev) => ({
            ...prev,
            [xpertId]: matchingScore,
          }));
        }
      } else {
        newSet.delete(xpertId);
        setMatchingScoresMap((prev) => {
          const newMap = { ...prev };
          delete newMap[xpertId];
          return newMap;
        });
      }
      return newSet;
    });
  };

  const handleSendToSelection = async () => {
    if (selectedXperts.size === 0) {
      toast.error('Please select at least one expert');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!matchingResults) {
        throw new Error('No matching results available');
      }

      const selectedXpertsList = matchingResults.filter((x) =>
        selectedXperts.has(x.id)
      );

      await sendMatchedXpertsToSelectionBoard(
        selectedXpertsList,
        missionData,
        matchingScoresMap
      );

      toast.success(`${selectedXpertsList.length} experts envoyés avec succès`);
      router.push(
        `/mission/selection/${missionData.mission_number?.replace(' ', '-')}`
      );
    } catch (error) {
      toast.error('Failed to add experts to selection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex size-full flex-col rounded border p-3">
      <Button className="w-full text-white" onClick={handleLaunchMatching}>
        LANCER LE MATCHING
      </Button>

      {isLoading && (
        <div className="flex w-full items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="mt-3 overflow-hidden">
        {matchingResults && (
          <MatchingXpertsTable
            matchingResults={matchingResults}
            missionData={missionData}
            excludedCriteria={excludedCriteria}
            additionalCriteria={additionalCriteria}
            selectedXperts={selectedXperts}
            onXpertSelection={handleXpertSelection}
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-spaceSmall">
        <Button
          className="w-full bg-[#92C6B0] text-white hover:bg-[#92C6B0]/80"
          onClick={handleSendToSelection}
          disabled={selectedXperts.size === 0 || isSubmitting}
        >
          Envoyer vers DRAG & DROP
        </Button>
        <RecapMissionDialog missionsData={missionData} />
      </div>
    </div>
  );
}
