'use client';

import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MissionEtatToValidateTable from './_components/_to-validate/MissionEtatToValidateTable';
import MissionEtatOpenTable from './_components/_open/MissionEtatOpenTable';
import MissionEtatPlacedTable from './_components/_places/MissionEtatPlacedTable';
import MissionEtatDeletedTable from './_components/_perdues/MissionEtatDeletedTable';
import MissionEtatFinishedTable from './_components/_terminees/MissionEtatFinishedTable';

export default function MissionEtatPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const etat = searchParams.get('etat');
    if (etat) {
      setSelectedState(etat);
    }
  }, [searchParams]);

  const handleButtonClick = (state: string) => {
    setSelectedState(state);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('etat', state);
    router.push(`/mission/etats?${newSearchParams.toString()}`);
  };

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-[15px]">
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'valider' ? 'bg-accent' : ''}`}
          onClick={() => handleButtonClick('valider')}
        >
          Mission à valider
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'ouverts' ? 'bg-accent' : ''}`}
          onClick={() => handleButtonClick('ouverts')}
        >
          Missions ouvertes / ouvertes à tous
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'places' ? 'bg-accent' : ''}`}
          onClick={() => handleButtonClick('places')}
        >
          Mission placées
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'perdues' ? 'bg-accent' : ''}`}
          onClick={() => handleButtonClick('perdues')}
        >
          Missions perdues / supprimées
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white ${selectedState === 'terminees' ? 'bg-accent' : ''}`}
          onClick={() => handleButtonClick('terminees')}
        >
          Missions terminées / clôturées
        </Button>
        <Button
          className={`max-w-[240px] text-wrap px-spaceLarge py-spaceMedium text-white`}
        >
          Créer une mission
        </Button>

        {selectedState === 'valider' && <MissionEtatToValidateTable />}

        {selectedState === 'ouverts' && <MissionEtatOpenTable />}

        {selectedState === 'places' && <MissionEtatPlacedTable />}

        {selectedState === 'perdues' && <MissionEtatDeletedTable />}

        {selectedState === 'terminees' && <MissionEtatFinishedTable />}
      </div>
    </>
  );
}
