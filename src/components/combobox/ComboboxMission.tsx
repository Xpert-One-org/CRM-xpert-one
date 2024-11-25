'use client';
import Combobox from '@/components/inputs/Combobox';
import { useMissionStore } from '@/store/mission';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function ComboboxMission({ redirect }: { redirect?: boolean }) {
  const [value, setValue] = useState('');
  const [text] = useDebounce(value, 500);
  const [data, setData] = useState<string[]>([]);

  const { missionsNumbers, searchMissions, isLoading } = useMissionStore();
  const pathname = usePathname();
  const currentMissionNumber = pathname.split('/').pop()?.split('-').join(' ');
  const [currentValue] = useState(
    currentMissionNumber !== 'fiche' && currentMissionNumber !== 'matching'
      ? currentMissionNumber
      : ''
  );

  const router = useRouter();

  const handleValueChange = async (value: string) => {
    setValue(value);
  };

  const handleSetValue = (value: string) => {
    //! check if the value is the same as the current mission number
    if (value.toUpperCase() === currentMissionNumber?.toUpperCase()) {
      return;
    }

    setValue(value);
    if (redirect) {
      router.push(
        `/mission/matching/${value.split(' ').join('-').toUpperCase()}`
      );
    } else {
      router.push(`/mission/fiche/${value.split(' ').join('-').toUpperCase()}`);
    }
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
        currentMissionNumber !== 'fiche' && currentMissionNumber !== 'matching'
          ? currentMissionNumber
          : 'Rechercher'
      }
      className="bg-primary py-spaceContainer text-white hover:bg-secondary"
    />
  );
}
