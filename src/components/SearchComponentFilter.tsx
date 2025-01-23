import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import Combobox from '@/components/combobox/Combobox';
import FilterSvg from '@/components/svg/FIlterSvg';

type SearchComponentFilterProps = {
  placeholder: string;
  filterKey: string;
  placeholderSearch?: string;
  value?: string;
  showSelectedOption?: boolean;
  onValueChange: (value: string) => void;
  onClear?: () => void;
};

export const SearchComponentFilter = ({
  showSelectedOption = true,
  placeholderSearch = 'Rechercher',
  placeholder,
  filterKey,
  value: externalValue,
  onValueChange,
  onClear,
}: SearchComponentFilterProps) => {
  const [searchTerm, setSearchTerm] = useState(externalValue || '');
  const [debouncedValue] = useDebounce(searchTerm, 300);

  const handleClear = () => {
    setSearchTerm('');
    onClear?.();
  };

  const handleSearch = (value: string) => {
    if (value === '') {
      handleClear();
      return;
    }
    setSearchTerm(value);
  };

  // Only update parent when debounced value changes
  useEffect(() => {
    if (debouncedValue !== externalValue) {
      onValueChange(debouncedValue);
    }
  }, [debouncedValue, externalValue, onValueChange]);

  // Sync with external value changes
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== searchTerm) {
      setSearchTerm(externalValue);
    }
  }, [externalValue]);

  return (
    <Combobox
      data={[]}
      showSelectedOption={showSelectedOption}
      value={searchTerm}
      handleSetValue={handleSearch}
      handleValueChange={handleSearch}
      placeholder={placeholder}
      placeholderSearch={placeholderSearch}
      className="border-none"
      icon={<FilterSvg className="size-4" />}
      onClear={handleClear}
    />
  );
};
