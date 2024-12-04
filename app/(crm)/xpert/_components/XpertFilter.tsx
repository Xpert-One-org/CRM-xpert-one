import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
import type { DBXpert } from '@/types/typesDb';
import ComboBoxXpert from '@/components/combobox/ComboBoxXpert';
import { useSearchParams } from 'next/navigation';
import CountryFilterButton from '@/components/CountryFilterButton';
import ComboboxJobTitles from '@/components/combobox/ComboboxJobTitles';

const sortDateOptions = [
  { label: 'Ancien', value: 'asc' },
  { label: 'Récent', value: 'desc' },
  { label: 'Aucun filtre', value: '' },
];

const availabilityOptions = [
  { label: 'Disponible', value: 'available', color: '#92C6B0' },
  { label: 'Non disponible', value: 'unavailable', color: '#D64242' },
  { label: 'En mission', value: 'in_mission', color: 'var(--accent)' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

const cvOptions = [
  { label: 'OUI', value: 'yes', color: '#92C6B0' },
  { label: 'NON', value: 'no', color: '#D64242' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

const adminOpinionOptions = [
  { label: 'Positif', value: 'positive', color: '#92C6B0' },
  { label: 'Neutre', value: 'neutral', color: '#F5B935' },
  { label: 'Négatif', value: 'negative', color: '#D64242' },
  { label: 'Aucun filtre', value: '', color: 'transparent' },
];

export default function XpertFilter({
  xperts,
  onSortedDataChange,
  activeFilters,
}: {
  xperts: DBXpert[];
  onSortedDataChange: (
    data: DBXpert[],
    filterType?: string,
    filterValues?: string[]
  ) => void;
  activeFilters: {
    jobTitles: string[];
    availability: string;
    cv: string;
    countries: string[];
    sortDate: string;
    adminOpinion: string;
  };
}) {
  const searchParams = useSearchParams();
  const [selectedXpertId, setSelectedXpertId] = useState<string | null>(
    searchParams.get('id') || null
  );
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>(
    activeFilters.jobTitles
  );
  const [selectedAvailability, setSelectedAvailability] = useState<string>(
    activeFilters.availability
  );
  const [selectedCv, setSelectedCv] = useState<string>(activeFilters.cv);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    activeFilters.countries
  );
  const [selectedSortDate, setSelectedSortDate] = useState<string>(
    activeFilters.sortDate
  );
  const [selectedAdminOpinion, setSelectedAdminOpinion] = useState<string>(
    activeFilters.adminOpinion
  );

  useEffect(() => {
    if (selectedJobTitles.length === 0) {
      onSortedDataChange(xperts);
    } else {
      const filteredData = xperts.filter((xpert) => {
        return selectedJobTitles.some((value) =>
          xpert.profile_mission?.job_titles?.some((title) => title === value)
        );
      });
      onSortedDataChange(filteredData, 'jobTitles', selectedJobTitles);
    }
  }, [selectedJobTitles, xperts, onSortedDataChange]);

  useEffect(() => {
    if (!selectedAvailability) {
      onSortedDataChange(xperts);
    } else {
      const filteredData = xperts.filter((xpert) => {
        if (selectedAvailability === 'unavailable') {
          return (
            xpert.profile_mission?.availability === undefined ||
            new Date(xpert.profile_mission.availability ?? '') > new Date()
          );
        } else if (selectedAvailability === 'in_mission') {
          return xpert.mission
            .map((mission) => mission.xpert_associated_id)
            .some((xpertId) => xpertId === xpert.id);
        } else if (selectedAvailability === 'available') {
          const isAvailable =
            xpert.profile_mission?.availability !== undefined &&
            new Date(xpert.profile_mission.availability ?? '') <= new Date();
          const isNotInMission = !xpert.mission
            .map((mission) => mission.xpert_associated_id)
            .some((xpertId) => xpertId === xpert.id);
          return isAvailable && isNotInMission;
        }
        return true;
      });
      onSortedDataChange(filteredData, 'availability', [selectedAvailability]);
    }
  }, [selectedAvailability, xperts, onSortedDataChange]);

  useEffect(() => {
    if (!selectedCv) {
      onSortedDataChange(xperts);
    } else {
      const filteredData = xperts.filter((xpert) => {
        if (selectedCv === 'yes') {
          return !!xpert.cv_name;
        } else if (selectedCv === 'no') {
          return !xpert.cv_name;
        }
        return true;
      });
      onSortedDataChange(filteredData, 'cv', [selectedCv]);
    }
  }, [selectedCv, xperts, onSortedDataChange]);

  useEffect(() => {
    if (selectedCountries.length === 0) {
      onSortedDataChange(xperts);
    } else {
      const filteredData = xperts.filter((xpert) =>
        selectedCountries.includes(xpert.country || '')
      );
      onSortedDataChange(filteredData, 'countries', selectedCountries);
    }
  }, [selectedCountries, xperts, onSortedDataChange]);

  useEffect(() => {
    if (!selectedSortDate) {
      onSortedDataChange(xperts);
    } else {
      const sortedData = [...xperts].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return selectedSortDate === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
      onSortedDataChange(sortedData, 'sortDate', [selectedSortDate]);
    }
  }, [selectedSortDate, xperts, onSortedDataChange]);

  useEffect(() => {
    if (!selectedAdminOpinion) {
      onSortedDataChange(xperts);
    } else {
      const filteredData = xperts.filter(
        (xpert) => xpert.admin_opinion === selectedAdminOpinion
      );
      onSortedDataChange(filteredData, 'adminOpinion', [selectedAdminOpinion]);
    }
  }, [selectedAdminOpinion, xperts, onSortedDataChange]);

  const handleJobTitlesChange = (values: string[]) => {
    setSelectedJobTitles(values);
  };

  const handleClear = () => {
    setSelectedXpertId(null);
  };

  const handleAvailabilityChange = (value: string) => {
    setSelectedAvailability(value);
  };

  const handleCvChange = (value: string) => {
    setSelectedCv(value);
  };

  const handleCountryChange = (values: string[]) => {
    setSelectedCountries(values);
  };

  const handleAdminOpinionChange = (value: string) => {
    setSelectedAdminOpinion(value);
  };

  return (
    <>
      <FilterButton
        options={sortDateOptions}
        onValueChange={(value) => setSelectedSortDate(value)}
        placeholder="Date d'inscription"
        sortable
        data={xperts}
        sortKey="created_at"
        selectedOption={{
          value: selectedSortDate,
          label:
            sortDateOptions.find((opt) => opt.value === selectedSortDate)
              ?.label ?? '',
        }}
      />
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <ComboBoxXpert
          searchType="lastname"
          selectedXpertId={selectedXpertId}
          onXpertSelect={setSelectedXpertId}
          onClear={handleClear}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <ComboBoxXpert
          searchType="firstname"
          selectedXpertId={selectedXpertId}
          onXpertSelect={setSelectedXpertId}
          onClear={handleClear}
        />
      </div>
      <div className="col-span-2 bg-chat-selected font-bold text-black hover:bg-chat-selected">
        <ComboboxJobTitles
          data={xperts}
          selectedValues={selectedJobTitles}
          onValueChange={handleJobTitlesChange}
          className="border-none"
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <CountryFilterButton
          data={xperts}
          onFilter={(data) =>
            onSortedDataChange(data, 'countries', selectedCountries)
          }
          selectedCountries={selectedCountries}
          onCountryChange={handleCountryChange}
        />
      </div>
      <div className="flex h-full items-center justify-center bg-chat-selected text-black hover:bg-chat-selected">
        <ComboBoxXpert
          searchType="generated_id"
          selectedXpertId={selectedXpertId}
          onXpertSelect={setSelectedXpertId}
          onClear={handleClear}
        />
      </div>
      <FilterButton
        options={availabilityOptions}
        onValueChange={handleAvailabilityChange}
        placeholder="Disponible le"
        coloredOptions
        selectedOption={{
          value: selectedAvailability,
          label:
            availabilityOptions.find(
              (option) => option.value === selectedAvailability
            )?.label ?? '',
        }}
      />
      <FilterButton
        options={cvOptions}
        onValueChange={handleCvChange}
        placeholder="CV"
        coloredOptions
        selectedOption={{
          value: selectedCv,
          label:
            cvOptions.find((option) => option.value === selectedCv)?.label ??
            '',
        }}
      />
      <FilterButton
        options={adminOpinionOptions}
        onValueChange={handleAdminOpinionChange}
        placeholder="Qualité XPERT"
        coloredOptions
        selectedOption={{
          value: selectedAdminOpinion,
          label:
            adminOpinionOptions.find(
              (option) => option.value === selectedAdminOpinion
            )?.label ?? '',
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
