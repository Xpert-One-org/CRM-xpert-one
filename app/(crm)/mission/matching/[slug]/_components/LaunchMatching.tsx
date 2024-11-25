import { Button } from '@/components/ui/button';
import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { Eye } from 'lucide-react';
import Loader from '@/components/Loader';
import React, { useState } from 'react';
import { getAllMatchedXperts } from '../matching.action';
import MatchingXpertsTable from './MatchingXpertsTable';

export default function LaunchMatching({
  missionData,
  excludedCriteria,
}: {
  missionData: DBMission;
  excludedCriteria: Record<string, string[]>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [matchingResults, setMatchingResults] = useState<
    DBMatchedXpert[] | null
  >(null);

  const handleLaunchMatching = async () => {
    setIsLoading(true);
    const { data } = await getAllMatchedXperts(missionData, excludedCriteria);
    setMatchingResults(data);
    setIsLoading(false);
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
          />
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-spaceSmall">
        <Button className="w-full bg-[#92C6B0] text-white hover:bg-[#92C6B0]/80">
          Envoyer vers DRAG & DROP
        </Button>
        <Button className="w-full text-white">
          Récap des besoins fournisseur <Eye className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  );
}
