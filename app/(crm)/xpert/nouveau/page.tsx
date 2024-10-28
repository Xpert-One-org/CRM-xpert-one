'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboard';
import NewXpertsRow from './_components/NewXpertsRow';
import { useRouter } from 'next/navigation';

export default function XpertNouveauPage() {
  const { newUsers, fetchLastSignUpNewUsersWeek } = useDashboardStore();
  const router = useRouter();

  useEffect(() => {
    if (newUsers.length === 0) {
      fetchLastSignUpNewUsersWeek();
    }
  }, []);

  const signUpDateOptions = newUsers.map((user) => ({
    label: user.created_at || '',
    value: user.created_at || '',
  }));

  const identificationNumberOptions = newUsers.map((user) => ({
    label: user.generated_id || '',
    value: user.generated_id || '',
  }));

  const roleOptions = newUsers.map((user) => ({
    label: user.role || '',
    value: user.role || '',
  }));

  const totaleProgressionOptions = newUsers.map((user) => ({
    label: user.totale_progression.toString() || '',
    value: user.totale_progression.toString() || '',
  }));

  const referantXpertOneOptions = newUsers.map((user) => ({
    label: user.firstname || '',
    value: user.firstname || '',
  }));

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
          onValueChange={() => {}}
          placeholder="Call de bienvenue"
        />
        <FilterButton
          options={totaleProgressionOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Éléments supplémentaires à nous communiquer"
        />
        <FilterButton
          options={referantXpertOneOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Référent Xpert One"
        />
      </div>
      <div className="grid gap-4">
        {newUsers.map((user) => (
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
