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

export default function MissionEtatPage() {
  const { fetchMissions, isLoading } = useMissionStore();
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
    <div className="mb-2 flex flex-wrap items-center gap-[15px]">
      <Button
        className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'to_validate' ? 'bg-accent' : ''}`}
        onClick={() => handleButtonClick('to_validate')}
      >
        Mission à valider
      </Button>
      <Button
        className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'open' ? 'bg-accent' : ''}`}
        onClick={() => handleButtonClick('open')}
      >
        Missions ouvertes / ouvertes à tous
      </Button>
      <Button
        className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'in_progress' ? 'bg-accent' : ''}`}
        onClick={() => handleButtonClick('in_progress')}
      >
        Missions en cours / placées
      </Button>
      <Button
        className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'deleted' ? 'bg-accent' : ''}`}
        onClick={() => handleButtonClick('deleted')}
      >
        Missions perdues / supprimées
      </Button>
      <Button
        className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'finished' ? 'bg-accent' : ''}`}
        onClick={() => handleButtonClick('finished')}
      >
        Missions terminées / clôturées
      </Button>
      {/* <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white`}
        >
          Créer une mission
        </Button> */}

      {selectedState === 'to_validate' &&
        (isLoading ? (
          <MissionEtatToValidateTableSkeleton />
        ) : (
          <MissionEtatToValidateTable />
        ))}
      {selectedState === 'open' &&
        (isLoading ? (
          <MissionEtatOpenTableSkeleton />
        ) : (
          <MissionEtatOpenTable />
        ))}
      {selectedState === 'in_progress' &&
        (isLoading ? (
          <MissionEtatInProgressTableSkeleton />
        ) : (
          <MissionEtatInProgressTable />
        ))}
      {selectedState === 'deleted' &&
        (isLoading ? (
          <MissionEtatDeletedTableSkeleton />
        ) : (
          <MissionEtatDeletedTable />
        ))}
      {selectedState === 'finished' &&
        (isLoading ? (
          <MissionEtatFinishedTableSkeleton />
        ) : (
          <MissionEtatFinishedTable />
        ))}
    </div>
  );
}
