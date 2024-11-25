import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import type { DBXpert } from '@/types/typesDb';
import ComboBoxXpert from '@/components/combobox/ComboBoxXpert';

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
        options={[]}
        onValueChange={() => {}}
        placeholder="Poste"
        className="col-span-2"
      />
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <ComboBoxXpert />
      </div>
      <FilterButton
        options={[]}
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
