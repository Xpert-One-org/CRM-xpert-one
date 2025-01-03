'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useEffect } from 'react';
import SuiviMissionsRow from './SuiviMissionsRow';
import { useMissionStore } from '@/store/mission';

export default function SuiviMissionsTable() {
  const { missions, fetchMissions } = useMissionStore();

  const missionsOpen = missions.filter(
    (mission) => mission.state === 'open' || mission.state === 'open_all'
  );

  useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  return (
    <div className="grid grid-cols-12 gap-3">
      <FilterButton className="col-span-2" placeholder="Trier par" />
      <FilterButton
        className="col-span-3"
        placeholder="DÉBUT DE MISSION"
        filter={false}
      />
      <FilterButton
        className="col-span-3"
        placeholder="MISSION EN COURS"
        filter={false}
      />
      <FilterButton
        className="col-span-3"
        placeholder="FIN DE MISSION"
        filter={false}
      />
      <div className="col-span-1" />

      <FilterButton
        className="col-span-1"
        placeholder="Mission"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="N° de mission"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Début de mission définitif"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point J-10 F"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point J-10 X"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point J+10 F"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point J+10 X"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point trimestre XPERT"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point Référent J+10"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point RH F J+10"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Point fin de mission X J-30"
        filter={false}
      />
      <FilterButton
        className="col-span-1"
        placeholder="Référent mission XPERT ONE"
        filter={false}
      />

      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="TOUS"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="TOUS"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="TOUS"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="1"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="1"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="1"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="2"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="0"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="0"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="0"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="0"
        filter={false}
      />
      <FilterButton
        className="col-span-1 bg-[#363636] text-white"
        placeholder="TOUS"
        filter={false}
      />

      {missionsOpen.map((mission) => (
        <SuiviMissionsRow key={mission.id} mission={mission} />
      ))}
    </div>
  );
}
