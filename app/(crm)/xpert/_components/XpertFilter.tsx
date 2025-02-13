import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
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
  iamStatusOptions,
} from '@/data/filter';
import { getLabel } from '@/utils/getLabel';

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
    if (value === '') {
      fetchXpertOptimizedFiltered(true);
      return;
    }
  };

  const handleSectorsChange = (sectors: string[]) => {
    const newActiveFilter = { ...activeFilters, sectors };
    setActiveFilters(newActiveFilter);
    if (sectors.length === 0) {
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

  const handleJobTitlesChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, jobTitles: value };
    setActiveFilters(newActiveFilter);
    if (value === '') {
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

  const handleLastNameChange = (value: string) => {
    const newActiveFilter = { ...activeFilters, lastname: value };
    setActiveFilters(newActiveFilter);
    if (value === '') {
      fetchXpertOptimizedFiltered(true);
      return;
    }
  };

  const handleSectorChange = (value: string) => {
    const sectors = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s);
    const newActiveFilter = { ...activeFilters, sectors };
    setActiveFilters(newActiveFilter);
  };

  const getSectorValue = () => {
    return activeFilters.sectors
      .map(
        (sector) => getLabel({ value: sector, select: sectorSelect }) ?? sector
      )
      .join(', ');
  };

  useEffect(() => {
    if (isFilterNotEmpty) {
      fetchXpertOptimizedFiltered(true);
    }
  }, [activeFilters]);

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
        <SearchComponentFilter
          showSelectedOption={true}
          placeholder="Secteurs"
          filterKey="sectors"
          placeholderSearch="Rechercher des secteurs"
          value={getSectorValue()}
          onValueChange={handleSectorChange}
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
