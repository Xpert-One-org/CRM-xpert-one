import React, { useState } from 'react';
import { useXpertStore } from '@/store/xpert';
import Combobox from '@/components/inputs/Combobox';
import { useRouter } from 'next/navigation';

export default function ComboBoxXpert() {
  const [searchTerm, setSearchTerm] = useState('');
  const { xperts } = useXpertStore();
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
