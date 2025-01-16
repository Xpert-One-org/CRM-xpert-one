import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
import type { DBXpertOptimized } from '@/types/typesDb';
import CountryFilterButton from '@/components/CountryFilterButton';
import { useXpertStore } from '@/store/xpert';
import { SearchComponentFilter } from '@/components/SearchComponentFilter';
import type { AdminOpinionValue, FilterXpert } from '@/types/types';
import {
  adminOpinionOptions,
  availabilityOptions,
  cvOptions,
  sortDateOptions,
} from '@/data/filter';

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
        placeholder="Inscription"
        sortable
        data={xperts}
        sortKey="created_at"
      />
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          placeholder="Nom"
          filterKey="lastname"
          placeholderSearch="Rechercher un nom"
          value={activeFilters.lastname}
          onValueChange={(value) => {
            const newActiveFilter = { ...activeFilters, lastname: value };
            setActiveFilters(newActiveFilter);
          }}
          onClear={() => {
            const newActiveFilter = { ...activeFilters, lastname: '' };
            setActiveFilters(newActiveFilter);
            fetchXpertOptimizedFiltered(true);
          }}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          placeholder="Prénom"
          filterKey="firstname"
          placeholderSearch="Rechercher un prénom"
          value={activeFilters.firstname}
          onValueChange={(value) => {
            const newActiveFilter = { ...activeFilters, firstname: value };
            setActiveFilters(newActiveFilter);
          }}
          onClear={() => {
            const newActiveFilter = { ...activeFilters, firstname: '' };
            setActiveFilters(newActiveFilter);
            fetchXpertOptimizedFiltered(true);
          }}
        />
      </div>
      <div className="col-span-2 flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          placeholder="Poste"
          filterKey="jobTitles"
          placeholderSearch="Rechercher un poste"
          value={activeFilters.jobTitles}
          onValueChange={(value) => {
            const newActiveFilter = { ...activeFilters, jobTitles: value };
            setActiveFilters(newActiveFilter);
          }}
          onClear={() => {
            const newActiveFilter = { ...activeFilters, jobTitles: '' };
            setActiveFilters(newActiveFilter);
            fetchXpertOptimizedFiltered(true);
          }}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <CountryFilterButton
          data={xperts}
          selectedCountries={activeFilters.countries}
          onCountryChange={handleCountryChange}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <SearchComponentFilter
          placeholder="N° identification"
          filterKey="generated_id"
          placeholderSearch="Rechercher un X"
          value={activeFilters.generated_id}
          onValueChange={(value) => {
            const newActiveFilter = { ...activeFilters, generated_id: value };
            setActiveFilters(newActiveFilter);
          }}
          onClear={() => {
            const newActiveFilter = { ...activeFilters, generated_id: '' };
            setActiveFilters(newActiveFilter);
            fetchXpertOptimizedFiltered(true);
          }}
        />
      </div>
      <FilterButton
        options={availabilityOptions}
        onValueChange={handleAvailabilityChange}
        placeholder="Disponible"
        coloredOptions
      />
      <FilterButton
        options={cvOptions}
        onValueChange={handleCvChange}
        placeholder="CV"
        coloredOptions
      />
      <FilterButton
        options={adminOpinionOptions}
        onValueChange={handleAdminOpinionChange}
        placeholder="Qualité"
        coloredOptions
      />
      <FilterButton
        className="font-bold"
        placeholder="Fiche détaillée"
        filter={false}
      />
    </>
  );
}
