import { useFournisseurStore } from '@/store/fournisseur';
import React, { useEffect, useState } from 'react';
import Combobox from './Combobox';

export default function ComboboxFournisseur({
  name,
  label,
  required,
  onChange,
  hasError,
}: {
  name: string;
  label: string;
  required: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  hasError: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const { fournisseurs, fetchFournisseurs } = useFournisseurStore();

  const handleSearch = (value: string) => {
    const fournisseurId = value.split('(')[1].replace(')', '').toUpperCase();
    const findFournisseur = fournisseurs?.find(
      (fournisseur) => fournisseur.generated_id === fournisseurId
    );
    const resultFoundFournisseur = `${findFournisseur?.firstname} ${findFournisseur?.lastname} (${findFournisseur?.generated_id})`;
    setSearchTerm(resultFoundFournisseur);

    const createdByEvent = {
      target: {
        name: 'created_by',
        value: findFournisseur?.id?.toString() || '',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(createdByEvent);
  };

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  return (
    <Combobox
      data={
        fournisseurs?.map(
          (fournisseur) =>
            `${fournisseur.firstname} ${fournisseur.lastname} (${fournisseur.generated_id})`
        ) ?? []
      }
      value={searchTerm}
      handleSetValue={handleSearch}
      handleValueChange={handleSearch}
      placeholder="F ----"
      placeholderSearch="Rechercher un fournisseur son ID, nom ou prénom"
      name={name}
      label={label}
      required={required}
      hasError={hasError}
    />
  );
}
