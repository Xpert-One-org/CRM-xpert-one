'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useEffect, useState } from 'react';
import { useXpertStore } from '@/store/xpert';
import XpertGestionCollaborateursRow from './XpertGestionCollaborateursRow';
import { Checkbox } from '@/components/ui/checkbox';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import Loader from '@/components/Loader';
import type { DBReferentType } from '@/types/typesDb';

type XpertGestionCollaborateursTableProps = {
  pendingChanges: { id: string; affected_referent_id: string | null }[];
  setPendingChanges: React.Dispatch<
    React.SetStateAction<{ id: string; affected_referent_id: string | null }[]>
  >;
  setGroupPendingChanges: React.Dispatch<
    React.SetStateAction<
      { post: string; affected_referent: DBReferentType | null }[]
    >
  >;
};

export default function XpertGestionCollaborateursTable({
  setPendingChanges,
  setGroupPendingChanges,
}: XpertGestionCollaborateursTableProps) {
  const {
    xpertsOptimized,
    totalXpertOptimized,
    totalXpertLastJobs,
    loading,
    fetchXpertOptimizedFiltered,
    fecthXpertLastJob,
    xpertLastJobs,
  } = useXpertStore();
  const [isGroupSelection, setIsGroupSelection] = useState(false);

  const handleReferentChange = ({
    referent,
    xpertId,
    jobName,
  }: {
    referent: DBReferentType | null;
    xpertId?: string;
    jobName?: string;
  }) => {
    if (xpertId) {
      setPendingChanges((prev) => {
        const filtered = prev.filter((change) => change.id !== xpertId);
        return [
          ...filtered,
          { id: xpertId, affected_referent_id: referent?.id ?? null },
        ];
      });
    } else if (jobName) {
      setGroupPendingChanges((prev) => {
        const filtered = prev.filter((change) => change.post !== jobName);
        return [...filtered, { post: jobName, affected_referent: referent }];
      });
    }
  };

  const hasMore = !isGroupSelection
    ? xpertsOptimized && totalXpertOptimized
      ? xpertsOptimized.length < totalXpertOptimized
      : totalXpertOptimized === 0
        ? false
        : true
    : xpertLastJobs && totalXpertLastJobs
      ? xpertLastJobs.length < totalXpertLastJobs
      : totalXpertLastJobs === 0
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
        // className={`grid ${isGroupSelection ? 'grid-cols-3 col-span-2' : 'grid-cols-6'} gap-3`}
        className={`grid grid-cols-6 gap-3`}
      >
        {isGroupSelection && (
          <FilterButton
            className="col-span-2"
            options={[]}
            onValueChange={() => {}}
            placeholder="Prénom(s) & Nom(s) du/des référent(s)"
          />
        )}
        {!isGroupSelection && (
          <FilterButton
            options={[]}
            onValueChange={() => {}}
            placeholder="Prénom du référent"
          />
        )}
        {!isGroupSelection && (
          <FilterButton
            options={[]}
            onValueChange={() => {}}
            placeholder="Nom du référent"
          />
        )}
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
          className={isGroupSelection ? 'col-span-2' : ''}
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Réaffectation"
          // className={isGroupSelection ? 'col-span-1' : 'col-span-2'}
          className={'col-span-2'}
        />
      </div>
      {isGroupSelection
        ? xpertLastJobs?.map((job, index) => (
            <div className="my-3" key={index}>
              <XpertGestionCollaborateursRow
                job={job}
                isGroupSelection={isGroupSelection}
                onReferentChange={handleReferentChange}
              />
            </div>
          ))
        : xpertsOptimized?.map((xpert) => (
            <div className="my-3" key={xpert.id}>
              <XpertGestionCollaborateursRow
                xpert={xpert}
                isGroupSelection={isGroupSelection}
                onReferentChange={handleReferentChange}
              />
            </div>
          ))}

      <InfiniteScroll
        hasMore={hasMore}
        next={
          isGroupSelection ? fecthXpertLastJob : fetchXpertOptimizedFiltered
        }
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
        {(isGroupSelection && xpertLastJobs?.length === 0) ||
          (!isGroupSelection && xpertsOptimized?.length === 0 && (
            <div className="mt-4 flex w-full items-center justify-center">
              <p className="text-gray-secondary text-center text-sm">
                Aucun résultat
              </p>
            </div>
          ))}
      </InfiniteScroll>
    </div>
  );
}
