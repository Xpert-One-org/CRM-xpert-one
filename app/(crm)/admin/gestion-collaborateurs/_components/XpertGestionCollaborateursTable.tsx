'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useState } from 'react';
import { useXpertStore } from '@/store/xpert';
import XpertGestionCollaborateursRow from './XpertGestionCollaborateursRow';
import { Checkbox } from '@/components/ui/checkbox';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import Loader from '@/components/Loader';

type XpertGestionCollaborateursTableProps = {
  pendingChanges: { id: string; affected_referent_id: string | null }[];
  setPendingChanges: React.Dispatch<
    React.SetStateAction<{ id: string; affected_referent_id: string | null }[]>
  >;
};

export default function XpertGestionCollaborateursTable({
  pendingChanges,
  setPendingChanges,
}: XpertGestionCollaborateursTableProps) {
  const {
    xpertsOptimized,
    totalXpertOptimized,
    loading,
    fetchXpertOptimizedFiltered,
  } = useXpertStore();
  const [isGroupSelection, setIsGroupSelection] = useState(false);

  const handleReferentChange = (id: string, referentId: string | null) => {
    setPendingChanges((prev) => {
      const filtered = prev.filter((change) => change.id !== id);
      return [...filtered, { id, affected_referent_id: referentId }];
    });
  };

  const getPendingReferent = (xpertId: string) => {
    return pendingChanges.find((change) => change.id === xpertId)
      ?.affected_referent_id;
  };

  const hasMore =
    xpertsOptimized && totalXpertOptimized
      ? xpertsOptimized.length < totalXpertOptimized
      : totalXpertOptimized === 0
        ? false
        : true;

  return (
    <div className="rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <div className="mb-4 flex items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isGroupSelection}
            onCheckedChange={(checked) => setIsGroupSelection(!!checked)}
          />
          <label className="text-sm font-medium">
            Passer en sélection groupé : "Dernier poste"
          </label>
        </div>
        <div className="flex-1 text-center">
          <div className="text-lg font-bold text-[#222222]">XPERTS</div>
        </div>
        <div className="w-[250px]" />
      </div>

      <div
        className={`grid ${isGroupSelection ? 'grid-cols-5' : 'grid-cols-6'} gap-3`}
      >
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Prénom du référent"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Nom du référent"
        />
        {!isGroupSelection && (
          <FilterButton
            options={[]}
            onValueChange={() => {}}
            placeholder="N° d'identification"
          />
        )}
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Dernier poste"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Réaffectation"
          className={isGroupSelection ? 'col-span-2' : 'col-span-2'}
        />
      </div>

      {xpertsOptimized?.map((xpert) => (
        <div className="my-3" key={xpert.id}>
          <XpertGestionCollaborateursRow
            xpert={xpert}
            isGroupSelection={isGroupSelection}
            onReferentChange={handleReferentChange}
            pendingReferentId={getPendingReferent(xpert.id)}
          />
        </div>
      ))}

      <InfiniteScroll
        hasMore={hasMore}
        next={fetchXpertOptimizedFiltered}
        isLoading={false}
      >
        {hasMore && (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        )}
        {!hasMore && loading && (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        )}
        {xpertsOptimized?.length === 0 && (
          <div className="mt-4 flex w-full items-center justify-center">
            <p className="text-gray-secondary text-center text-sm">
              Aucun résultat
            </p>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
