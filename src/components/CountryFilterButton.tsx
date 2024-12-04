'use client';

import React, { useEffect } from 'react';
import CountryMultiSelect from './combobox/CountryMultiSelect';
import { useSelect } from '@/store/select';
import type { DBXpert, DBXpertOptimized } from '@/types/typesDb';

type CountryFilterButtonProps = {
  data?: DBXpertOptimized[];
  onFilter?: (filteredData: DBXpertOptimized[]) => void;
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

  const sortedCountries = [...countries].sort((a, b) => {
    if (a.value === 'FR') return -1;
    if (b.value === 'FR') return 1;
    return (a.label || '').localeCompare(b.label || '');
  });

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
      options={sortedCountries.map((country) => ({
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
