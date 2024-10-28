'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MissionEtatOpenTable from './_components/open/MissionEtatOpenTable';
import MissionEtatInProgressTable from './_components/in_progress/MissionEtatInProgressTable';
import MissionEtatDeletedTable from './_components/deleted/MissionEtatDeletedTable';
import MissionEtatFinishedTable from './_components/finished/MissionEtatFinishedTable';
import { MissionEtatToValidateTable } from './_components/to_validate/MissionEtatToValidateTable';
import { useMissionStore } from '@/store/mission';
import MissionEtatToValidateTableSkeleton from './_components/to_validate/skeleton/MissionEtatToValidateTableSkeleton';
import MissionEtatOpenTableSkeleton from './_components/open/skeleton/MissionEtatOpenTableSkeleton';
import MissionEtatInProgressTableSkeleton from './_components/in_progress/skeleton/MissionEtatInProgressTableSkeleton';
import MissionEtatDeletedTableSkeleton from './_components/deleted/skeleton/MissionEtatDeletedTableSkeleton';
import MissionEtatFinishedTableSkeleton from './_components/finished/skeleton/MissionEtatFinishedTableSkeleton';
import type { DBMissionState } from '@/types/typesDb';
import { useSelect } from '@/store/select';
import Loader from '@/components/Loader';

export default function MissionEtatPage() {
  const { fetchMissions, isLoading, setIsLoading } = useMissionStore();
  const [selectedState, setSelectedState] = useState<DBMissionState | null>(
    null
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const etat = searchParams.get('etat') as DBMissionState;
    if (etat) {
      setSelectedState(etat);
      fetchMissions(etat);
    }
  }, [searchParams, fetchMissions]);

  const handleButtonClick = (state: DBMissionState) => {
    setIsLoading(true);
    setSelectedState(state);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('etat', state);
    router.push(`/mission/etats?${newSearchParams.toString()}`);
  };

  const { fetchPosts } = useSelect();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      <div className="mb-2 grid grid-cols-6 items-center gap-[15px]">
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'to_validate' ? 'bg-accent hover:bg-accent' : ''}`}
          onClick={() => handleButtonClick('to_validate')}
        >
          Mission à valider
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'open' ? 'bg-accent hover:bg-accent' : ''}`}
          onClick={() => handleButtonClick('open')}
        >
          Missions ouvertes / ouvertes à tous
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'in_progress' ? 'bg-accent hover:bg-accent' : ''}`}
          onClick={() => handleButtonClick('in_progress')}
        >
          Missions en cours / placées
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'deleted' ? 'bg-accent hover:bg-accent' : ''}`}
          onClick={() => handleButtonClick('deleted')}
        >
          Missions perdues / supprimées
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'finished' ? 'bg-accent hover:bg-accent' : ''}`}
          onClick={() => handleButtonClick('finished')}
        >
          Missions terminées / clôturées
        </Button>
        <div />
        <div />
      </div>
      {/* <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white`}
        >
          Créer une mission
        </Button> */}
      <MissionContent isLoading={isLoading} selectedState={selectedState} />
    </>
  );
}

const MissionContent = ({
  isLoading,
  selectedState,
}: {
  isLoading: boolean;
  selectedState: DBMissionState | null;
}) => {
  if (isLoading) {
    return <Loader className="flex w-full justify-center" />;
  }
  switch (selectedState) {
    case 'to_validate':
      return <MissionEtatToValidateTable />;
    case 'open':
      return <MissionEtatOpenTable />;
    case 'in_progress':
      return <MissionEtatInProgressTable />;
    case 'deleted':
      return <MissionEtatDeletedTable />;
    case 'finished':
      return <MissionEtatFinishedTable />;
    default:
      return null;
  }
};
