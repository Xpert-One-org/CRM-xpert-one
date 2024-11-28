import { FilterButton } from '@/components/FilterButton';
import React, { useState } from 'react';
import type { DBXpert } from '@/types/typesDb';
import ComboBoxXpert from '@/components/combobox/ComboBoxXpert';
import { useSearchParams } from 'next/navigation';

const sortDateOptions = [
  { label: 'Ancien', value: 'asc' },
  { label: 'Récent', value: 'desc' },
  { label: 'Aucun filtre', value: '' },
];

export default function XpertFilter({
  xperts,
  onSortedDataChange,
}: {
  xperts: DBXpert[];
  onSortedDataChange: (data: DBXpert[]) => void;
}) {
  const searchParams = useSearchParams();
  const [selectedXpertId, setSelectedXpertId] = useState<string | null>(
    searchParams.get('id') || null
  );

  const handleClear = () => {
    setSelectedXpertId(null);
  };

  return (
    <>
      <FilterButton
        options={sortDateOptions}
        placeholder="Date d'inscription"
        sortable
        data={xperts}
        sortKey="created_at"
        onSort={onSortedDataChange}
      />
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <ComboBoxXpert
          searchType="lastname"
          selectedXpertId={selectedXpertId}
          onXpertSelect={setSelectedXpertId}
          onClear={handleClear}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <ComboBoxXpert
          searchType="firstname"
          selectedXpertId={selectedXpertId}
          onXpertSelect={setSelectedXpertId}
          onClear={handleClear}
        />
      </div>
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Poste"
        className="col-span-2 font-bold text-black"
      />
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Nationalité"
      />
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <ComboBoxXpert
          searchType="generated_id"
          selectedXpertId={selectedXpertId}
          onXpertSelect={setSelectedXpertId}
          onClear={handleClear}
        />
      </div>
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Disponible le"
      />
      <FilterButton options={[]} onValueChange={() => {}} placeholder="CV" />
      <FilterButton
        className="font-bold"
        placeholder="Fiche détaillée"
        filter={false}
      />
    </>
  );
}
