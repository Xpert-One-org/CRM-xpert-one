'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useEffect, useState } from 'react';
import type { DBProfile } from '@/types/typesDb';
import { useRouter } from 'next/navigation';
import { signUpDateOptions } from '@/data/constant';
import { getNewUsersLastWeek } from '../action';
import NewRow from './NewRow';

export default function NewsXpertFournisseursTable({ role }: { role: string }) {
  const router = useRouter();
  const [newUsersLastWeek, setNewUsersLastWeek] = useState<DBProfile[]>([]);

  const getLastWeekNewUsers = async (role: string) => {
    const { newUsersLastWeek } = await getNewUsersLastWeek(role);
    setNewUsersLastWeek(newUsersLastWeek);
  };

  useEffect(() => {
    getLastWeekNewUsers(role);
  }, [role]);

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
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="N° identification"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Rôle"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="État de la fiche"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          placeholder="Call de bienvenue"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          placeholder="Éléments supplémentaires à nous communiquer"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          placeholder="Référent Xpert One"
        />
      </div>
      <div className="grid gap-4">
        {newUsersLastWeek.map((user) => (
          <NewRow
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
