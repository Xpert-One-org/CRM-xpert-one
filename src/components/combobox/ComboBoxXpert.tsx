import React, { useEffect, useState } from 'react';
import Combobox from '@/components/inputs/Combobox';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchXpert } from '../../../app/(crm)/xpert/xpert.action';
import type { DBXpert } from '@/types/typesDb';

export default function ComboBoxXpert() {
  const [searchTerm, setSearchTerm] = useState('');
  const [xperts, setXperts] = useState<DBXpert[] | null>(null);
  const searchParams = useSearchParams();
  const xpertId = searchParams.get('id');

  const fetchAllXperts = async () => {
    const { data } = await searchXpert();
    setXperts(data);
  };

  const router = useRouter();

  const handleSearch = (value: string) => {
    const xpertId = value.split('(')[1].replace(')', '').toUpperCase();
    const findXpert = xperts?.find((xpert) => xpert.generated_id === xpertId);
    const resultFoundXpert = `${findXpert?.firstname} ${findXpert?.lastname} (${findXpert?.generated_id})`;
    setSearchTerm(resultFoundXpert);
    router.push(`/xpert?id=${xpertId}`);
  };

  useEffect(() => {
    fetchAllXperts();
  }, []);

  useEffect(() => {
    if (xpertId && xperts) {
      const findXpert = xperts.find((xpert) => xpert.generated_id === xpertId);
      if (findXpert) {
        const resultFoundXpert = `${findXpert.firstname} ${findXpert.lastname} (${findXpert.generated_id})`;
        setSearchTerm(resultFoundXpert);
      }
    }
  }, [xpertId, xperts]);

  return (
    <Combobox
      data={
        xperts?.map(
          (xpert) =>
            `${xpert.firstname} ${xpert.lastname} (${xpert.generated_id})`
        ) ?? []
      }
      value={searchTerm}
      handleSetValue={handleSearch}
      handleValueChange={handleSearch}
      placeholder="N° identification"
      placeholderSearch="Rechercher un expert son ID, prénom ou nom"
      className="border-none"
    />
  );
}
