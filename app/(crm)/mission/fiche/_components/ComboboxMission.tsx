'use client';
import Combobox from '@/components/inputs/Combobox';
import { useMissionStore } from '@/store/mission';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function ComboboxMission() {
  const [value, setValue] = useState('');
  const [text] = useDebounce(value, 500);
  const [data, setData] = useState<string[]>([]);

  const { missionsNumbers, searchMissions, isLoading } = useMissionStore();
  const pathname = usePathname();
  const currentMissionNumber = pathname.split('/').pop()?.split('-').join(' ');
  const [currentValue, setCurrentValue] = useState(
    currentMissionNumber !== 'fiche' ? currentMissionNumber : ''
  );

  const router = useRouter();

  const handleValueChange = async (value: string) => {
    setValue(value);
  };

  const handleSetValue = (value: string) => {
    setValue(value);
    router.push(`/mission/fiche/${value.split(' ').join('-')}`);
  };

  useEffect(() => {
    searchMissions(value);
    setValue(value);
  }, [text]);

  useEffect(() => {
    const missionFound = missionsNumbers.map(
      (mission) => mission.mission_number || ''
    );
    setData(missionFound);
  }, [missionsNumbers]);

  return (
    <Combobox
      data={data}
      value={currentValue ?? ''}
      handleSetValue={handleSetValue}
      isLoading={isLoading}
      handleValueChange={handleValueChange}
      placeholder={
        currentMissionNumber !== 'fiche' ? currentMissionNumber : 'Rechercher'
      }
      className="bg-primary py-spaceContainer text-white hover:bg-secondary"
    />
  );
}
