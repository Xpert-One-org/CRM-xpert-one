import { FilterButton } from '@/components/FilterButton';
import React, { useEffect } from 'react';
import type { DBXpertOptimized } from '@/types/typesDb';
import CountryFilterButton from '@/components/CountryFilterButton';
import { useXpertStore } from '@/store/xpert';
import { SearchComponentFilter } from '@/components/SearchComponentFilter';
import type { AdminOpinionValue, FilterXpert } from '@/types/types';
import { iamSelect, sectorSelect } from '@/data/mocked_select';
import {
  adminOpinionOptions,
  availabilityOptions,
  cvOptions,
  sortDateOptions,
} from '@/data/filter';
import { getLabel } from '@/utils/getLabel';
import MultiSelectFilter from '@/components/combobox/MultiSelectFilter';

export default function XpertFilter({
  xperts,
}: {
  xperts: DBXpertOptimized[];
}) {
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

  const handleIamStatusChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, iam: value };
    setActiveFilters(newActiveFilter);
    // Ne pas appeler fetchXpertOptimizedFiltered ici car c'est géré par useEffect
  };

  const handleSectorsChange = (value: string | string[]) => {
    // S'assurer que les secteurs sont bien traités comme un tableau
    const validSectors = Array.isArray(value)
      ? value
      : value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
    const newActiveFilter = { ...activeFilters, sectors: validSectors };

    setActiveFilters(newActiveFilter);
  };

  const handleCvChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, cv: value };
    setActiveFilters(newActiveFilter);
    // Ne pas appeler fetchXpertOptimizedFiltered ici car c'est géré par useEffect
  };

  const handleAdminOpinionChange = (value: string) => {
    const newActiveFilter = {
      ...activeFilters,
      adminOpinion: value as AdminOpinionValue,
    };
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

  const handleFirstNameChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, firstname: value };
    setActiveFilters(newActiveFilter);
    if (value === '') {
      fetchXpertOptimizedFiltered(true);
      return;
    }
  };

  useEffect(() => {
    // Utiliser un délai pour éviter les appels trop fréquents

    const timer = setTimeout(() => {
      if (isFilterNotEmpty) {
        fetchXpertOptimizedFiltered(true);
      }
    }, 300); // 300ms de délai pour éviter les appels trop fréquents

    return () => clearTimeout(timer);
  }, [activeFilters, fetchXpertOptimizedFiltered]);

  return (
    <>
      <FilterButton
        showSelectedOption={true}
        options={sortDateOptions}
        onValueChange={handleSortDateChange}
        placeholder="Inscription"
        sortable
        data={xperts}
        sortKey="created_at"
      />
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          showSelectedOption={true}
          placeholder="Nom"
          filterKey="lastname"
          placeholderSearch="Rechercher un nom"
          value={activeFilters.lastname}
          onValueChange={(value) => {
            const newActiveFilter = { ...activeFilters, lastname: value };
            setActiveFilters(newActiveFilter);
          }}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          showSelectedOption={true}
          placeholder="Prénom"
          filterKey="firstname"
          placeholderSearch="Rechercher un prénom"
          value={activeFilters.firstname}
          onValueChange={handleFirstNameChange}
        />
      </div>
      <div className="col-span-2 flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          showSelectedOption={true}
          placeholder="Poste"
          filterKey="jobTitles"
          placeholderSearch="Rechercher un poste"
          value={activeFilters.jobTitles}
          onValueChange={(value) => {
            const newActiveFilter = { ...activeFilters, jobTitles: value };
            setActiveFilters(newActiveFilter);
          }}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <CountryFilterButton
          data={xperts}
          selectedCountries={activeFilters.countries}
          onCountryChange={handleCountryChange}
          showSelectedOption={true}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          showSelectedOption={true}
          placeholder="N° identification"
          filterKey="generated_id"
          placeholderSearch="Rechercher un X"
          value={activeFilters.generated_id}
          onValueChange={(value) => {
            const newActiveFilter = { ...activeFilters, generated_id: value };
            setActiveFilters(newActiveFilter);
          }}
        />
      </div>
      <FilterButton
        options={availabilityOptions}
        onValueChange={handleAvailabilityChange}
        placeholder="Disponible"
        coloredOptions
        showSelectedOption={true}
      />
      <FilterButton
        options={cvOptions}
        onValueChange={handleCvChange}
        placeholder="CV"
        coloredOptions
        showSelectedOption={true}
      />
      <FilterButton
        options={adminOpinionOptions}
        onValueChange={handleAdminOpinionChange}
        placeholder="Qualité"
        coloredOptions
        showSelectedOption={true}
      />
      <FilterButton
        options={iamSelect.map((option) => ({
          label:
            getLabel({ value: option.value, select: iamSelect }) ??
            option.value,
          value: option.value,
          color: '#92C6B0',
        }))}
        onValueChange={handleIamStatusChange}
        placeholder="Statut IAM"
        showSelectedOption={true}
      />
      <div className="col-span-2 flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <MultiSelectFilter
          options={sectorSelect}
          selectedValues={activeFilters.sectors}
          onValueChange={handleSectorsChange}
          placeholder="Secteurs"
          className="border-none bg-transparent"
          showSelectedOption={true}
        />
      </div>
      <FilterButton
        className="font-bold"
        placeholder="Fiche détaillée"
        filter={false}
        showSelectedOption={true}
      />
    </>
  );
}
