import React, { useEffect, useState } from 'react';
import Combobox from '@/components/combobox/Combobox';
import { useRouter } from 'next/navigation';
import { searchXpert } from '../../../app/(crm)/xpert/xpert.action';
import type { DBXpert } from '@/types/typesDb';
import FilterSvg from '../svg/FIlterSvg';

export type SearchType = 'firstname' | 'lastname' | 'generated_id';

type ComboBoxXpertProps = {
  searchType?: SearchType;
  selectedXpertId?: string | null;
  onXpertSelect?: (id: string | null) => void;
  onClear?: () => void;
};

export default function ComboBoxXpert({
  searchType,
  selectedXpertId,
  onXpertSelect,
  onClear,
}: ComboBoxXpertProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [xperts, setXperts] = useState<DBXpert[] | null>(null);
  const router = useRouter();

  const formatXpertString = (xpert: DBXpert, type: SearchType | undefined) => {
    switch (type) {
      case 'firstname':
        return `${xpert.firstname}`;
      case 'lastname':
        return `${xpert.lastname}`;
      case 'generated_id':
        return `${xpert.generated_id}`;
      default:
        return `${xpert.firstname} ${xpert.lastname} (${xpert.generated_id})`;
    }
  };

  const getSearchResults = (xperts: DBXpert[]) => {
    return xperts.map((xpert) => formatXpertString(xpert, searchType));
  };

  const handleSearch = (value: string) => {
    let findXpert;
    let xpertId: string | undefined = undefined;

    switch (searchType) {
      case 'generated_id':
        xpertId = value.toUpperCase();
        findXpert = xperts?.find((xpert) => xpert.generated_id === xpertId);
        break;
      case 'firstname':
        findXpert = xperts?.find(
          (xpert) =>
            xpert.firstname?.toLowerCase().trim() === value.toLowerCase().trim()
        );
        xpertId = findXpert?.generated_id;
        break;
      case 'lastname':
        findXpert = xperts?.find(
          (xpert) =>
            xpert.lastname?.toLowerCase().trim() === value.toLowerCase().trim()
        );
        xpertId = findXpert?.generated_id;
        break;
      default:
        xpertId = value.split('(')[1].replace(')', '').toUpperCase();
        findXpert = xperts?.find((xpert) => xpert.generated_id === xpertId);
    }

    if (findXpert) {
      const resultFoundXpert = formatXpertString(findXpert, searchType);
      setSearchTerm(resultFoundXpert);
      onXpertSelect?.(xpertId || null);
      router.push(`/xpert?id=${xpertId}`);
    }
  };

  const fetchAllXperts = async () => {
    const { data } = await searchXpert();
    setXperts(data);
  };

  useEffect(() => {
    fetchAllXperts();
  }, []);

  useEffect(() => {
    if (selectedXpertId && xperts) {
      const findXpert = xperts.find(
        (xpert) => xpert.generated_id === selectedXpertId
      );
      if (findXpert) {
        const resultFoundXpert = formatXpertString(findXpert, searchType);
        setSearchTerm(resultFoundXpert);
      }
    } else {
      setSearchTerm('');
    }
  }, [selectedXpertId, xperts, searchType]);

  const getPlaceholderText = () => {
    switch (searchType) {
      case 'firstname':
        return 'Prénom';
      case 'lastname':
        return 'Nom';
      case 'generated_id':
        return 'Nom & Prénom';
      default:
        return 'Nom & Prénom';
    }
  };

  const handleClearLocal = () => {
    setSearchTerm('');
    onClear?.();
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('id');
    router.push(newUrl.pathname);
  };

  return (
    <div className="flex w-full">
      <Combobox
        data={xperts ? getSearchResults(xperts) : []}
        value={searchTerm}
        handleSetValue={handleSearch}
        handleValueChange={handleSearch}
        placeholder={getPlaceholderText()}
        placeholderSearch="Rechercher un expert"
        className="border-none"
        icon={<FilterSvg className="size-4" />}
        onClear={handleClearLocal}
      />
    </div>
  );
}
