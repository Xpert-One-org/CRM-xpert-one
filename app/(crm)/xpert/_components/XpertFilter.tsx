import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
import type { DBXpertOptimized } from '@/types/typesDb';
import { useSearchParams } from 'next/navigation';
import CountryFilterButton from '@/components/CountryFilterButton';
import { useXpertStore } from '@/store/xpert';
import Combobox from '@/components/inputs/Combobox';
import FilterSvg from '@/components/svg/FIlterSvg';
import { useDebounce } from 'use-debounce';
import type { FilterXpert } from '@/types/types';

const sortDateOptions = [
  { label: 'Ancien', value: 'asc' },
  { label: 'Récent', value: 'desc' },
];

const availabilityOptions = [
  { label: 'Disponible', value: 'available', color: '#92C6B0' },
  { label: 'Non disponible', value: 'unavailable', color: '#D64242' },
  { label: 'En mission', value: 'in_mission', color: '#faa200' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

const cvOptions = [
  { label: 'OUI', value: 'yes', color: '#92C6B0' },
  { label: 'NON', value: 'no', color: '#D64242' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

export default function XpertFilter({
  xperts,
}: {
  xperts: DBXpertOptimized[];
}) {
  const searchParams = useSearchParams();
  const [selectedXpertId, setSelectedXpertId] = useState<string | null>(
    searchParams.get('id') || null
  );

  const checkIfFilterIsNotEmpty = (filter: FilterXpert) => {
    return Object.values(filter).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== '';
    });
  };

  const { fetchXpertOptimizedFiltered, activeFilters, setActiveFilters } =
    useXpertStore();

  const isFilterNotEmpty = checkIfFilterIsNotEmpty(activeFilters);

  const handleAvailabilityChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, availability: value };
    setActiveFilters(newActiveFilter);
    if (value === '') {
      fetchXpertOptimizedFiltered(true);
      return;
    }
  };

  const handleCvChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, cv: value };
    setActiveFilters(newActiveFilter);
    if (value === '') {
      fetchXpertOptimizedFiltered(true);
      return;
    }
  };

  const handleSortDateChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, sortDate: value };
    setActiveFilters(newActiveFilter);
  };

  const handleCountryChange = (countries: string[]) => {
    const newActiveFilter = { ...activeFilters, countries };
    setActiveFilters(newActiveFilter);
    if (countries.length === 0) {
      fetchXpertOptimizedFiltered(true);
      return;
    }
  };
  //
  useEffect(() => {
    if (isFilterNotEmpty) {
      fetchXpertOptimizedFiltered(true);
    }
  }, [activeFilters]);

  return (
    <>
      <FilterButton
        options={sortDateOptions}
        onValueChange={handleSortDateChange}
        placeholder="Date d'inscription"
        sortable
        data={xperts}
        sortKey="created_at"
        selectedOption={{
          value: activeFilters.sortDate,
          label:
            sortDateOptions.find((opt) => opt.value === activeFilters.sortDate)
              ?.label ?? '',
        }}
      />
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          placeholder="Nom"
          filterKey="lastname"
          placeholderSearch="Rechercher un nom"
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          placeholder="Prénom"
          filterKey="firstname"
          placeholderSearch="Rechercher un prénom"
        />
      </div>
      <div className="col-span-2 flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          placeholder="Poste"
          filterKey="jobTitles"
          placeholderSearch="Rechercher un poste"
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <CountryFilterButton
          data={xperts}
          // onFilter={(data) =>
          //   onSortedDataChange(data, 'countries', activeFilters.countries)
          // }

          // onFilter={(data) =>
          //   onSortedDataChange(data, 'countries', activeFilters.countries)
          // }
          selectedCountries={activeFilters.countries}
          onCountryChange={handleCountryChange}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        {/* <ComboBoxXpert
          searchType="generated_id"
          selectedXpertId={selectedXpertId}
          onXpertSelect={setSelectedXpertId}
          onClear={handleClear}
        /> */}
        <SearchComponentFilter
          placeholder="N° identification"
          filterKey="generated_id"
          placeholderSearch="Rechercher un X"
        />
      </div>
      <FilterButton
        options={availabilityOptions}
        onValueChange={handleAvailabilityChange}
        placeholder="Disponible le"
        coloredOptions
        selectedOption={{
          value: activeFilters.availability,
          label:
            availabilityOptions.find(
              (option) => option.value === activeFilters.availability
            )?.label ?? '',
        }}
      />
      <FilterButton
        options={cvOptions}
        onValueChange={handleCvChange}
        placeholder="CV"
        coloredOptions
        selectedOption={{
          value: activeFilters.cv,
          label:
            cvOptions.find((option) => option.value === activeFilters.cv)
              ?.label ?? '',
        }}
      />
      <FilterButton
        className="font-bold"
        placeholder="Fiche détaillée"
        filter={false}
      />
    </>
  );
}

const SearchComponentFilter = ({
  placeholderSearch = 'Rechercher un xpert',
  placeholder,
  filterKey,
}: {
  placeholder: string;
  filterKey: keyof FilterXpert;
  placeholderSearch?: string;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [value] = useDebounce(searchTerm, 300);
  const {
    fetchXpertOptimizedFiltered,
    resetXperts,
    activeFilters,
    setActiveFilters,
  } = useXpertStore();

  const handleSearch = (value: string) => {
    if (value === '') {
      handleClear();
      return;
    }
    setSearchTerm(value);
  };

  const handleSetValue = (value: string) => {
    const newActiveFilter = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newActiveFilter);
  };

  useEffect(() => {
    handleSetValue(value);
  }, [value]);

  const handleClear = () => {
    useXpertStore.setState({ loading: true });
    setSearchTerm('');
    const newActiveFilter = { ...activeFilters, [filterKey]: '' };
    setActiveFilters(newActiveFilter);
    fetchXpertOptimizedFiltered(true);
  };

  return (
    <Combobox
      data={[]}
      disabledProposals
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
