import { FilterButton } from '@/components/FilterButton';
import { signUpDateOptions } from '@/data/constant';
import React from 'react';
import type { DBXpert } from '@/types/typesDb';

const sortStringOptions = [
  { label: 'Ascendant', value: 'asc' },
  { label: 'Descendant', value: 'desc' },
  { label: 'Aucun tri', value: '' },
];

const sortDateOptions = [
  { label: 'Ancien', value: 'asc' },
  { label: 'Recent', value: 'desc' },
  { label: 'Aucun filtre', value: '' },
];

export default function XpertFilter({
  xperts,
  onSortedDataChange,
}: {
  xperts: DBXpert[];
  onSortedDataChange: (data: DBXpert[]) => void;
}) {
  return (
    <>
      <FilterButton
        options={sortDateOptions}
        onValueChange={() => {}}
        placeholder="Date d'inscription"
        sortable
        data={xperts}
        sortKey="created_at"
        onSort={onSortedDataChange}
      />
      <FilterButton
        options={sortStringOptions}
        placeholder="Nom"
        sortable
        data={xperts}
        sortKey="lastname"
        onSort={onSortedDataChange}
      />
      <FilterButton
        options={sortStringOptions}
        placeholder="Prénom"
        sortable
        data={xperts}
        sortKey="firstname"
        onSort={onSortedDataChange}
      />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="Poste"
        className="col-span-2"
      />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="N° identification"
      />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="Disponible le"
      />
      <FilterButton
        className="font-bold"
        placeholder="Fiche détaillée"
        filter={false}
      />
    </>
  );
}
