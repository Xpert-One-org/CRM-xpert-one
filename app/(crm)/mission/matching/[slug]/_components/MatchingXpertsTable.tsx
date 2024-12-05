import React, { useState, useEffect } from 'react';
import type { DBMatchedXpert } from '@/types/typesDb';
import { FilterButton } from '@/components/FilterButton';
import MatchingXpertsRow from './MatchingXpertsRow';

const availabilityOptions = [
  { label: 'Disponible', value: 'yes' },
  { label: 'Non disponible', value: 'no' },
  { label: 'Tous', value: '' },
];

export default function MatchingXpertsTable({
  matchingResults,
  selectedXperts,
  onXpertSelection,
}: {
  matchingResults: DBMatchedXpert[];
  selectedXperts: Set<string>;
  onXpertSelection: (
    xpertId: string,
    checked: boolean,
    matchingScore?: number
  ) => void;
}) {
  const [sortedMatchingResults, setSortedMatchingResults] =
    useState(matchingResults);
  const [filteredResults, setFilteredResults] = useState(matchingResults);

  useEffect(() => {
    setSortedMatchingResults(matchingResults);
    setFilteredResults(matchingResults);
  }, [matchingResults]);

  const handleSort = (sortedData: DBMatchedXpert[]) => {
    setSortedMatchingResults(sortedData);
    setFilteredResults(sortedData);
  };

  const handleAvailabilityFilter = (value: string) => {
    if (value === '') {
      setFilteredResults(sortedMatchingResults);
      return;
    }

    const filtered = sortedMatchingResults.filter((xpert) => {
      const availability =
        xpert.profile_mission && xpert.profile_mission.availability;
      const isAvailable = availability && new Date(availability) > new Date();

      return value === 'yes' ? isAvailable : !isAvailable;
    });

    setFilteredResults(filtered);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-7 gap-spaceSmall">
        <div className="col-span-2">
          <FilterButton
            className="size-full"
            placeholder={`${filteredResults.length} XPERTS correspondants`}
            sortable
            data={filteredResults}
            sortKey="matchingScore"
            onSort={handleSort}
            options={[
              { label: 'Ascendant', value: 'asc' },
              { label: 'Descendant', value: 'desc' },
            ]}
          />
        </div>
        <div className="col-span-2">
          <FilterButton
            className="size-full"
            placeholder="Non matching"
            filter={false}
          />
        </div>
        <div className="col-span-2">
          <FilterButton
            className="size-full"
            placeholder="XPERT disponible ?"
            options={availabilityOptions}
            onValueChange={handleAvailabilityFilter}
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
        <div className="grid grid-cols-7 gap-spaceSmall">
          {filteredResults.map((matchedXpert) => (
            <MatchingXpertsRow
              key={matchedXpert.id}
              matchedXpert={matchedXpert}
              onXpertSelection={(xpertId, checked) =>
                onXpertSelection(xpertId, checked, matchedXpert.matchingScore)
              }
              isSelected={selectedXperts.has(matchedXpert.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
