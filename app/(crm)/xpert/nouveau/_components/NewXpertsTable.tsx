'use client';

import { FilterButton } from '@/components/FilterButton';
import React from 'react';
import NewXpertsRow from './NewXpertsRow';
import type { DBProfile } from '@/types/typesDb';
import { useRouter } from 'next/navigation';

type NewXpertsTableProps = {
  signUpDateOptions: { label: string; value: string }[];
  identificationNumberOptions: { label: string; value: string }[];
  roleOptions: { label: string; value: string }[];
  totaleProgressionOptions: { label: string; value: string }[];
  referantXpertOneOptions: { label: string; value: string }[];
  newUsersLastWeek: DBProfile[];
};

export default function NewXpertsTable({
  signUpDateOptions,
  identificationNumberOptions,
  roleOptions,
  totaleProgressionOptions,
  referantXpertOneOptions,
  newUsersLastWeek,
}: NewXpertsTableProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 flex-col gap-4">
      <div className="grid grid-cols-7 gap-3">
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Date d'inscription"
        />
        <FilterButton
          options={identificationNumberOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="N° identification"
        />
        <FilterButton
          options={roleOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Rôle"
        />
        <FilterButton
          options={totaleProgressionOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="État de la fiche"
        />
        <FilterButton
          options={totaleProgressionOptions}
          defaultSelectedKeys=""
          placeholder="Call de bienvenue"
        />
        <FilterButton
          options={totaleProgressionOptions}
          defaultSelectedKeys=""
          placeholder="Éléments supplémentaires à nous communiquer"
        />
        <FilterButton
          options={referantXpertOneOptions}
          defaultSelectedKeys=""
          placeholder="Référent Xpert One"
        />
      </div>
      <div className="grid gap-4">
        {newUsersLastWeek.map((user) => (
          <NewXpertsRow
            key={user.id}
            user={user}
            isOpen={false}
            onClick={() => router.push(`/xpert?id=${user.generated_id}`)}
          />
        ))}
      </div>
    </div>
  );
}
