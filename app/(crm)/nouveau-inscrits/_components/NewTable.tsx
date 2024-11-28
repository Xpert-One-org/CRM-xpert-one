'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useEffect, useState } from 'react';
import type { DBProfile } from '@/types/typesDb';
import { useRouter } from 'next/navigation';
import { getNewUsersLastMonth } from '../action';
import NewRow from './NewRow';
import Loader from '@/components/Loader';

export default function NewsXpertFournisseursTable({ role }: { role: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [newUsersLastMonth, setNewUsersLastMonth] = useState<DBProfile[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(
    role === 'company' ? 'Fournisseur' : 'Xpert'
  );

  const getLastMonthNewUsers = async (role: string) => {
    setLoading(true);
    const { newUsersLastMonth } = await getNewUsersLastMonth(role);
    setNewUsersLastMonth(newUsersLastMonth);
    setLoading(false);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    if (value === 'Fournisseur') {
      router.push('/nouveau-inscrits?role=company');
    } else {
      router.push('/nouveau-inscrits?role=xpert');
    }
  };

  useEffect(() => {
    if (selectedRole === 'Fournisseur') {
      getLastMonthNewUsers('company');
    } else {
      getLastMonthNewUsers('xpert');
    }
  }, [selectedRole]);

  useEffect(() => {
    if (role) {
      getLastMonthNewUsers(role);
    }
  }, [role]);

  return (
    <div className="grid grid-cols-1 flex-col gap-4">
      <div className="grid grid-cols-7 gap-3">
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Date d'inscription"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="N° identification"
        />
        <FilterButton
          options={[
            {
              label: 'Fournisseur',
              value: 'Fournisseur',
            },
            {
              label: 'Xpert',
              value: 'Xpert',
            },
          ]}
          onValueChange={handleRoleChange}
          placeholder="Rôle"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="État de la fiche"
        />
        <FilterButton options={[]} placeholder="Call de bienvenue" />
        <FilterButton
          options={[]}
          placeholder="Éléments supplémentaires à nous communiquer"
        />
        <FilterButton options={[]} placeholder="Référent Xpert One" />
      </div>
      <div className="grid gap-4">
        {loading ? (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        ) : newUsersLastMonth.length > 0 ? (
          newUsersLastMonth.map((user) => (
            <NewRow
              key={user.id}
              user={user}
              isOpen={false}
              onClick={() => router.push(`/xpert?id=${user.generated_id}`)}
            />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">
            Aucun nouveaux {role === 'company' ? 'Fournisseur' : 'Xpert'} se
            sont inscrits le dernier mois avec une
          </p>
        )}
      </div>
    </div>
  );
}
