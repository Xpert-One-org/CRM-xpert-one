import React, { useEffect, useState } from 'react';
import { FilterButton } from '@/components/FilterButton';
import type { DBProfile } from '@/types/typesDb';
import { useRouter } from 'next/navigation';
import { getNewUsersLastMonth } from '../action';
import NewRow from './NewRow';
import Loader from '@/components/Loader';
import ComboBoxXpert from '@/components/combobox/ComboBoxXpert';

export default function NewsXpertFournisseursTable({ role }: { role: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<DBProfile[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(
    role === 'company' ? 'Fournisseur' : 'Xpert'
  );

  const getLastMonthNewUsers = async (role: string) => {
    setLoading(true);
    const { newUsersLastMonth } = await getNewUsersLastMonth(role);
    setFilteredUsers(newUsersLastMonth);
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
      <div className="grid w-full grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_50px_50px] gap-3">
        <FilterButton
          options={[
            { label: 'Plus récent', value: 'desc' },
            { label: 'Plus ancien', value: 'asc' },
            { label: 'Aucun filtre', value: '' },
          ]}
          placeholder="Date d'inscription"
          sortable
          data={filteredUsers}
          sortKey="created_at"
          onSort={setFilteredUsers}
        />
        <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
          <ComboBoxXpert />
        </div>
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
          options={[
            { label: 'Plus complète', value: 'desc' },
            { label: 'Moins complète', value: 'asc' },
          ]}
          onSort={setFilteredUsers}
          data={filteredUsers}
          sortKey="totale_progression"
          sortable
          placeholder="État de la fiche"
        />
        <FilterButton options={[]} placeholder="Call de bienvenue" />
        <FilterButton
          options={[]}
          placeholder="Éléments supplémentaires à nous communiquer"
        />
        <FilterButton
          options={[
            { label: 'Ascendant', value: 'asc' },
            { label: 'Descendant', value: 'desc' },
          ]}
          onSort={setFilteredUsers}
          data={filteredUsers}
          sortKey="referent_name"
          sortable={true}
          placeholder="Référent Xpert One"
        />
      </div>
      <div className="grid gap-4">
        {loading ? (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
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
            sont inscrits le dernier mois avec une fiche à plus de 50%
          </p>
        )}
      </div>
    </div>
  );
}
