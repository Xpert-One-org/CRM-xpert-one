'use client';

import React, { useEffect, useState } from 'react';
import CountryMultiSelect from './combobox/CountryMultiSelect';
import { useSelect } from '@/store/select';
import type { DBXpert } from '@/types/typesDb';

type CountryFilterButtonProps = {
  data?: DBXpert[];
  onFilter?: (filteredData: DBXpert[]) => void;
  selectedCountries: string[];
  onCountryChange: (values: string[]) => void;
};

export default function CountryFilterButton({
  data,
  onFilter,
  selectedCountries,
  onCountryChange,
}: CountryFilterButtonProps) {
  const { countries, fetchCountries } = useSelect();

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const handleValueChange = (values: string[]) => {
    onCountryChange(values);

    if (data && onFilter) {
      if (values.length === 0) {
        onFilter(data);
      } else {
        const filteredData = data.filter((xpert) =>
          values.includes(xpert.country || '')
        );
        onFilter(filteredData);
      }
    }
  };

  return (
    <CountryMultiSelect
      options={countries.map((country) => ({
        value: country.value || '',
        label: country.label || '',
      }))}
      selectedValues={selectedCountries}
      onValueChange={handleValueChange}
      placeholder="Nationalité"
      className="border-none"
    />
  );
}
