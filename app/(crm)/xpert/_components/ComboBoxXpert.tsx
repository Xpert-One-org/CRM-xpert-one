import React, { useEffect, useState } from 'react';
import Combobox from '@/components/inputs/Combobox';
import { useRouter } from 'next/navigation';
import { searchXpert } from '../xpert.action';
import type { DBXpert } from '@/types/typesDb';

export default function ComboBoxXpert() {
  const [searchTerm, setSearchTerm] = useState('');
  const [xperts, setXperts] = useState<DBXpert[] | null>(null);

  const fetchAllXperts = async () => {
    const { data } = await searchXpert();
    setXperts(data);
  };

  const router = useRouter();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const xpertId = value.split('(')[1].replace(')', '').toUpperCase();
    router.push(`/xpert?id=${xpertId}`);
  };

  const filteredXperts = xperts?.filter(
    (xpert) =>
      xpert.generated_id.includes(searchTerm) ||
      xpert.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      xpert.lastname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAllXperts();
  }, []);

  return (
    <Combobox
      placeholder="Rechercher un expert par ID, prénom ou nom"
      data={
        filteredXperts?.map(
          (xpert) =>
            `${xpert.firstname} ${xpert.lastname} (${xpert.generated_id})`
        ) ?? []
      }
      value={searchTerm}
      handleValueChange={handleSearch}
      handleSetValue={handleSearch}
      className="w-fit"
    />
  );
}
