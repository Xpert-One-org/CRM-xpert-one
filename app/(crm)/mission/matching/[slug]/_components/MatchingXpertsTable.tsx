import React from 'react';
import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { FilterButton } from '@/components/FilterButton';
import MatchingXpertsRow from './MatchingXpertsRow';

export default function MatchingXpertsTable({
  matchingResults,
  missionData,
}: {
  matchingResults: DBMatchedXpert[];
  missionData: DBMission;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-6 gap-spaceSmall">
        <div className="col-span-2">
          <FilterButton
            className="size-full"
            placeholder={`${matchingResults.length} XPERTS correspondants`}
          />
        </div>
        <div className="col-span-2">
          <FilterButton className="size-full" placeholder="Non matching" />
        </div>
        <div className="col-span-1">
          <FilterButton
            className="size-full"
            placeholder="XPERT disponible ?"
          />
        </div>
        <div className="col-span-1">
          <FilterButton
            className="size-full font-bold"
            placeholder="Envoyer vers Drag & Drop"
            filter={false}
          />
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto">
        <div className="grid grid-cols-6 gap-spaceSmall">
          {matchingResults.map((matchedXpert) => (
            <MatchingXpertsRow
              key={matchedXpert.id}
              matchedXpert={matchedXpert}
              missionData={missionData}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
