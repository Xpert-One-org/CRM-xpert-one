'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useState } from 'react';
import { useFournisseurStore } from '@/store/fournisseur';
import FournisseurGestionCollaborateursRow from './FournisseurGestionCollaborateursRow';
import { Checkbox } from '@/components/ui/checkbox';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import Loader from '@/components/Loader';

type FournisseurGestionCollaborateursTableProps = {
  pendingChanges: { id: string; affected_referent_id: string | null }[];
  setPendingChanges: React.Dispatch<
    React.SetStateAction<{ id: string; affected_referent_id: string | null }[]>
  >;
};

export default function FournisseurGestionCollaborateursTable({
  pendingChanges,
  setPendingChanges,
}: FournisseurGestionCollaborateursTableProps) {
  const { fournisseurs, totalFournisseurs, loading, fetchFournisseurs } =
    useFournisseurStore();

  const [isGroupSelection, setIsGroupSelection] = useState(false);

  const handleReferentChange = (id: string, referentId: string | null) => {
    setPendingChanges((prev) => {
      const filtered = prev.filter((change) => change.id !== id);
      return [...filtered, { id, affected_referent_id: referentId }];
    });
  };

  const getPendingReferent = (fournisseurId: string) => {
    return pendingChanges.find((change) => change.id === fournisseurId)
      ?.affected_referent_id;
  };

  const hasMore =
    fournisseurs && totalFournisseurs
      ? fournisseurs.length < totalFournisseurs
      : totalFournisseurs === 0
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
            Passer en sélection groupée : "Nom de l'entreprise"
          </label>
        </div>
        <div className="flex-1 text-center">
          <div className="text-lg font-bold text-[#222222]">FOURNISSEURS</div>
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
          placeholder="Nom de l'entreprise"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Réaffectation"
          className="col-span-2"
        />
      </div>

      {fournisseurs?.map((fournisseur) => (
        <div className="my-3" key={fournisseur.id}>
          <FournisseurGestionCollaborateursRow
            fournisseur={fournisseur}
            isGroupSelection={isGroupSelection}
            onReferentChange={handleReferentChange}
            pendingReferentId={getPendingReferent(fournisseur.id)}
          />
        </div>
      ))}

      <InfiniteScroll
        hasMore={hasMore}
        next={fetchFournisseurs}
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
        {fournisseurs?.length === 0 && (
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
