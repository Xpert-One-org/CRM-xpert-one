import React, { useEffect, useState } from 'react';
import Combobox from '@/components/combobox/Combobox';
import { useRouter } from 'next/navigation';
import type { DBFournisseur } from '@/types/typesDb';
import FilterSvg from '../svg/FIlterSvg';
import {
  getSpecificFournisseur,
  getAllFournisseurs,
} from '../../../app/(crm)/fournisseur/fournisseur.action';

export type SearchType = 'firstname' | 'lastname' | 'generated_id';

type ComboBoxFournisseurProps = {
  searchType?: SearchType;
  selectedFournisseurId?: string | null;
  onFournisseurSelect?: (id: string | null) => void;
  onClear?: () => void;
};

export default function ComboBoxFournisseur({
  searchType,
  selectedFournisseurId,
  onFournisseurSelect,
  onClear,
}: ComboBoxFournisseurProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [fournisseurs, setFournisseurs] = useState<DBFournisseur[] | null>(
    null
  );
  const router = useRouter();

  const formatFournisseurString = (
    fournisseur: DBFournisseur,
    type: SearchType | undefined
  ) => {
    switch (type) {
      case 'firstname':
        return `${fournisseur.firstname}`;
      case 'lastname':
        return `${fournisseur.lastname}`;
      case 'generated_id':
        return `${fournisseur.generated_id}`;
      default:
        return `${fournisseur.firstname} ${fournisseur.lastname} (${fournisseur.generated_id})`;
    }
  };

  const getSearchResults = (fournisseurs: DBFournisseur[]) => {
    return fournisseurs.map((fournisseur) =>
      formatFournisseurString(fournisseur, searchType)
    );
  };

  const handleSearch = (value: string) => {
    let findFournisseur;
    let fournisseurId: string | undefined = undefined;

    switch (searchType) {
      case 'generated_id':
        fournisseurId = value.toUpperCase();
        findFournisseur = fournisseurs?.find(
          (fournisseur) => fournisseur.generated_id === fournisseurId
        );
        break;
      case 'firstname':
        findFournisseur = fournisseurs?.find(
          (fournisseur) =>
            fournisseur.firstname?.toLowerCase().trim() ===
            value.toLowerCase().trim()
        );
        fournisseurId = findFournisseur?.generated_id;
        break;
      case 'lastname':
        findFournisseur = fournisseurs?.find(
          (fournisseur) =>
            fournisseur.lastname?.toLowerCase().trim() ===
            value.toLowerCase().trim()
        );
        fournisseurId = findFournisseur?.generated_id;
        break;
      default:
        fournisseurId = value.split('(')[1].replace(')', '').toUpperCase();
        findFournisseur = fournisseurs?.find(
          (fournisseur) => fournisseur.generated_id === fournisseurId
        );
    }

    if (findFournisseur) {
      const resultFoundFournisseur = formatFournisseurString(
        findFournisseur,
        searchType
      );
      setSearchTerm(resultFoundFournisseur);
      onFournisseurSelect?.(fournisseurId || null);
      router.push(`/fournisseur?id=${fournisseurId}`);
    }
  };

  const fetchAllFournisseurs = async () => {
    const { data } = await getAllFournisseurs({ offset: 0 });
    setFournisseurs(data);
  };

  useEffect(() => {
    fetchAllFournisseurs();
  }, []);

  useEffect(() => {
    if (selectedFournisseurId && fournisseurs) {
      const findFournisseur = fournisseurs.find(
        (fournisseur) => fournisseur.generated_id === selectedFournisseurId
      );
      if (findFournisseur) {
        const resultFoundFournisseur = formatFournisseurString(
          findFournisseur,
          searchType
        );
        setSearchTerm(resultFoundFournisseur);
      }
    } else {
      setSearchTerm('');
    }
  }, [selectedFournisseurId, fournisseurs, searchType]);

  const getPlaceholderText = () => {
    switch (searchType) {
      case 'firstname':
        return 'Prénom';
      case 'lastname':
        return 'Nom';
      case 'generated_id':
        return 'N° identification';
      default:
        return 'N° identification';
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
        data={fournisseurs ? getSearchResults(fournisseurs) : []}
        value={searchTerm}
        handleSetValue={handleSearch}
        handleValueChange={handleSearch}
        placeholder={getPlaceholderText()}
        placeholderSearch="Rechercher un fournisseur"
        className="border-none"
        icon={<FilterSvg className="size-4" />}
        onClear={handleClearLocal}
      />
    </div>
  );
}
