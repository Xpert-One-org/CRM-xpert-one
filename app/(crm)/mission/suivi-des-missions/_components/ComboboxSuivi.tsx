'use client';

import React, { useEffect, useState } from 'react';
import Combobox from '@/components/combobox/Combobox';
import type { DBMission } from '@/types/typesDb';
import FilterSvg from '@/components/svg/FIlterSvg';
import { searchMission } from '@functions/missions';

type ComboboxSuiviProps = {
  selectedMissionId?: string | null;
  onMissionSelect?: (missionNumber: string | null) => void;
  onClear?: () => void;
};

export default function ComboboxSuivi({
  selectedMissionId,
  onMissionSelect,
  onClear,
}: ComboboxSuiviProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [missions, setMissions] = useState<{ mission_number: string | null }[]>(
    []
  );

  const fetchMissions = async () => {
    const { data } = await searchMission('');
    console.log('Fetched missions:', data);
    setMissions(data || []);
  };

  const handleSearch = (value: string) => {
    console.log('handleSearch value:', value);
    // Always update the search term and trigger the filter
    setSearchTerm(value);
    onMissionSelect?.(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear?.();
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    if (selectedMissionId && missions) {
      const findMission = missions.find(
        (mission) => mission.mission_number === selectedMissionId
      );
      if (findMission) {
        setSearchTerm(findMission.mission_number || '');
      }
    } else {
      setSearchTerm('');
    }
  }, [selectedMissionId, missions]);

  return (
    <Combobox
      data={missions.map((mission) => mission.mission_number || '')}
      value={searchTerm}
      handleSetValue={handleSearch}
      handleValueChange={handleSearch}
      placeholder="N° de mission"
      showValue={false}
      placeholderSearch="Rechercher une mission"
      className="flex h-full cursor-pointer items-center gap-x-2 text-wrap border-none bg-chat-selected px-spaceContainer font-bold hover:bg-chat-selected"
      onClear={handleClear}
      icon={<></>}
    />
  );
}
