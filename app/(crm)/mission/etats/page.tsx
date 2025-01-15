'use client';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MissionEtatInProcessTable } from './_components/to_process/MissionEtatInProcessTable';
import MissionEtatOpenTable from './_components/open/MissionEtatOpenTable';
import MissionEtatInProgressTable from './_components/in_progress/MissionEtatInProgressTable';
import MissionEtatDeletedTable from './_components/deleted/MissionEtatDeletedTable';
import MissionEtatFinishedTable from './_components/finished/MissionEtatFinishedTable';
import { useMissionStore } from '@/store/mission';

import type { DBMissionState } from '@/types/typesDb';
import { useSelect } from '@/store/select';
import Loader from '@/components/Loader';
import Link from 'next/link';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function MissionEtatPage() {
  const { fetchPosts, fetchJobTitles } = useSelect();
  const { fetchMissionsState, isLoading, setIsLoading } = useMissionStore();
  const [selectedState, setSelectedState] = useState<DBMissionState | null>(
    null
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const etat = searchParams.get('etat') as DBMissionState;
    setSelectedState(etat);
    fetchMissionsState(etat);
  }, [searchParams, fetchMissionsState]);

  const handleButtonClick = (state: DBMissionState) => {
    setIsLoading(true);
    setSelectedState(state);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('etat', state);
    router.push(`/mission/etats?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    fetchPosts();
    fetchJobTitles();
  }, [fetchPosts, fetchJobTitles]);

  return (
    <>
      <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-6 items-center gap-[15px]">
            <Button
              className={`col-span-1 text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'in_process' ? 'bg-accent hover:bg-accent' : ''}`}
              onClick={() => handleButtonClick('in_process')}
            >
              Mission à valider
            </Button>
            <Button
              className={`col-span-1 text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'open' ? 'bg-accent hover:bg-accent' : ''}`}
              onClick={() => handleButtonClick('open')}
            >
              Missions ouvertes / ouvertes à tous
            </Button>
            <Button
              className={`col-span-1 text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'in_progress' ? 'bg-accent hover:bg-accent' : ''}`}
              onClick={() => handleButtonClick('in_progress')}
            >
              Missions en cours / placées
            </Button>
            <Button
              className={`col-span-1 text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'deleted' ? 'bg-accent hover:bg-accent' : ''}`}
              onClick={() => handleButtonClick('deleted')}
            >
              Missions perdues / supprimées
            </Button>
            <Button
              className={`col-span-1 text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'finished' ? 'bg-accent hover:bg-accent' : ''}`}
              onClick={() => handleButtonClick('finished')}
            >
              Missions terminées / clôturées
            </Button>
            <Link href="/mission/creation-de-mission">
              <Button
                className={`col-span-1 text-wrap px-spaceLarge py-spaceMedium text-white`}
              >
                Créer une mission
              </Button>
            </Link>
          </div>
          <MissionContent isLoading={isLoading} selectedState={selectedState} />
        </div>
      </ProtectedRoleRoutes>
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
    case 'in_process':
      return <MissionEtatInProcessTable />;
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
