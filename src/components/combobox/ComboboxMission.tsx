'use client';
import Combobox from '@/components/combobox/Combobox';
import { cn } from '@/lib/utils';
import { useMissionStore } from '@/store/mission';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { jobTitleSelect } from '@/data/mocked_select';
import { getLabel } from '@/utils/getLabel';

export default function ComboboxMission({
  slug,
  className,
  jobTitle,
}: {
  slug?: string;
  className?: string;
  jobTitle?: string;
}) {
  const [value, setValue] = useState('');
  const [text] = useDebounce(value, 500);
  const [data, setData] = useState<string[]>([]);

  const { missionsNumbers, searchMissions, isLoading, setLastMissionNumber } =
    useMissionStore();
  const pathname = usePathname();
  const currentMissionNumber = pathname.split('/').pop();
  const [currentValue] = useState(
    currentMissionNumber !== 'fiche' &&
      currentMissionNumber !== 'matching' &&
      currentMissionNumber !== 'selection' &&
      currentMissionNumber !== 'activation-des-missions' &&
      currentMissionNumber !== 'gestion-des-facturations'
      ? currentMissionNumber
      : ''
  );
  const [currentJobTitle, setCurrentJobTitle] = useState<string | null>(null);

  const router = useRouter();

  const handleValueChange = async (value: string) => {
    setValue(value);
  };

  const handleSetValue = (value: string) => {
    // get only the mission number
    const missionNumber = value.split(' - ')[0];
    if (missionNumber.toUpperCase() === currentMissionNumber?.toUpperCase()) {
      return;
    }

    setLastMissionNumber(missionNumber);

    setValue(missionNumber);
    if (slug === 'matching') {
      router.push(
        `/mission/matching/${missionNumber.split(' ').join('-').toUpperCase()}`
      );
    } else if (slug === 'selection') {
      router.push(
        `/mission/selection/${missionNumber.split(' ').join('-').toUpperCase()}`
      );
    } else if (slug === 'activation-des-missions') {
      router.push(
        `/mission/activation-des-missions/${missionNumber.split(' ').join('-').toUpperCase()}`
      );
    } else if (slug === 'gestion-des-facturations') {
      router.push(
        `/facturation/gestion-des-facturations/${missionNumber.split(' ').join('-').toUpperCase()}`
      );
    } else {
      router.push(
        `/mission/fiche/${missionNumber.split(' ').join('-').toUpperCase()}`
      );
    }
  };

  useEffect(() => {
    searchMissions(value);
    setValue(value);
  }, [text]);

  useEffect(() => {
    const missionFound = missionsNumbers.map(
      (mission) =>
        `${mission.mission_number || ``} - ${` ${getJobTitle(mission.job_title)}` || ''}`
    );
    setData(missionFound);
  }, [missionsNumbers]);

  const getJobTitle = (jobTitle: string | null) => {
    if (!jobTitle) return '';
    return getLabel({ value: jobTitle, select: jobTitleSelect }) || jobTitle;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Combobox
              data={data}
              value={currentValue ?? ''}
              handleSetValue={handleSetValue}
              isLoading={isLoading}
              handleValueChange={handleValueChange}
              placeholder={
                slug === 'matching' ||
                slug === 'selection' ||
                slug === 'fiche' ||
                slug === 'activation-des-missions' ||
                currentMissionNumber === currentMissionNumber
                  ? 'Rechercher'
                  : currentMissionNumber
              }
              className={cn(
                'h-full bg-primary py-spaceContainer text-white hover:bg-secondary',
                className
              )}
            />
          </div>
        </TooltipTrigger>
        {jobTitle && (
          <TooltipContent className="bg-primary text-white">
            <p>{getJobTitle(jobTitle)}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
