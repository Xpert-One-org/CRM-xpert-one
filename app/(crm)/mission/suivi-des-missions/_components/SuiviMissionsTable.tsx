'use client';

import { FilterButton } from '@/components/FilterButton';
import { Button } from '@/components/ui/button';
import React, { useEffect, useMemo, useState } from 'react';
import SuiviMissionsRow from './SuiviMissionsRow';
import { useMissionStore } from '@/store/mission';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import Loader from '@/components/Loader';
import ComboboxSuivi from './ComboboxSuivi';
import type { DBMission } from '@/types/typesDb';
import { calculateDaysInfo } from '../_functions/day.actions';
import { getBeforeStartColor } from '../_functions/getBoxColor';

export default function SuiviMissionsTable() {
  const {
    missions,
    totalMissions,
    isLoading,
    fetchMissions,
    hasMore,
    resetPagination,
  } = useMissionStore();

  const [shouldLoad, setShouldLoad] = React.useState(true);
  const [sortedMissions, setSortedMissions] = React.useState<DBMission[]>([]);
  const [sortBy, setSortBy] = React.useState<string>('');
  const [selectedMissionNumber, setSelectedMissionNumber] = React.useState<
    string | null
  >(null);

  const missionsOpen = useMemo(
    () =>
      missions.sort((a, b) => {
        if (!a.start_date || !b.start_date) return 0;
        return (
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
      }),
    [missions]
  );

  useEffect(() => {
    setSortedMissions(missionsOpen);
  }, [missionsOpen]);

  // Calcule des compteurs pour chaque type de point
  const checkpointCounts = useMemo(() => {
    return {
      point_j_moins_10_f: missionsOpen.filter((m) => {
        const dateBefore = new Date(m.start_date ?? '');
        dateBefore.setDate(dateBefore.getDate() - 10);
        const daysInfo = calculateDaysInfo(dateBefore.toString(), null);
        return (
          !m.checkpoints?.[0]?.point_j_moins_10_f &&
          (daysInfo.isPastStart ||
            (daysInfo?.daysUntilStart !== null &&
              daysInfo.daysUntilStart <= 10))
        );
      }).length,
      point_j_moins_10_x: missionsOpen.filter((m) => {
        const dateBefore = new Date(m.start_date ?? '');
        dateBefore.setDate(dateBefore.getDate() - 10);
        const daysInfo = calculateDaysInfo(dateBefore.toString(), null);
        return (
          !m.checkpoints?.[0]?.point_j_moins_10_x &&
          (daysInfo.isPastStart ||
            (daysInfo?.daysUntilStart !== null &&
              daysInfo.daysUntilStart <= 10))
        );
      }).length,
      point_j_plus_10_f: missionsOpen.filter((m) => {
        const daysInfo = calculateDaysInfo(m.start_date, null);
        return (
          !m.checkpoints?.[0]?.point_j_plus_10_f &&
          (daysInfo.isPastJPlus10 ||
            (daysInfo.daysUntilJPlus10 !== null &&
              daysInfo.daysUntilJPlus10 <= 5))
        );
      }).length,

      point_j_plus_10_x: missionsOpen.filter((m) => {
        const daysInfo = calculateDaysInfo(m.start_date, null);
        return (
          !m.checkpoints?.[0]?.point_j_plus_10_x &&
          (daysInfo.isPastJPlus10 ||
            (daysInfo.daysUntilJPlus10 !== null &&
              daysInfo.daysUntilJPlus10 <= 5))
        );
      }).length,

      point_trimestre_x: missionsOpen.filter(
        (m) => m.checkpoints?.[0]?.point_trimestre_x
      ).length,

      point_j_plus_10_referent: missionsOpen.filter((m) => {
        const daysInfo = calculateDaysInfo(null, m.end_date);
        return (
          !m.checkpoints?.[0]?.point_j_plus_10_referent &&
          (daysInfo.isPastEndPlus10 ||
            (daysInfo.daysUntilEndPlus10 !== null &&
              daysInfo.daysUntilEndPlus10 <= 5))
        );
      }).length,

      point_rh_fin_j_plus_10_f: missionsOpen.filter((m) => {
        const daysInfo = calculateDaysInfo(null, m.end_date);
        return (
          !m.checkpoints?.[0]?.point_rh_fin_j_plus_10_f &&
          (daysInfo.isPastEndPlus10 ||
            (daysInfo.daysUntilEndPlus10 !== null &&
              daysInfo.daysUntilEndPlus10 <= 5))
        );
      }).length,

      point_fin_j_moins_30: missionsOpen.filter((m) => {
        const daysInfo = calculateDaysInfo(m.start_date, m.end_date);
        return (
          !m.checkpoints?.[0]?.point_fin_j_moins_30 &&
          (daysInfo.isPastEndMinus30 ||
            (daysInfo.daysUntilEndMinus30 !== null &&
              daysInfo.daysUntilEndMinus30 <= 10))
        );
      }).length,
    };
  }, [missionsOpen]);

  const sortedMissionsMemo = useMemo(() => {
    if (!sortBy) return missionsOpen;

    return [...missionsOpen].sort((a, b) => {
      if (sortBy === 'start_date') {
        if (!a.start_date || !b.start_date) return 0;
        return (
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        );
      }
      if (sortBy === 'created_at') {
        if (!a.created_at || !b.created_at) return 0;
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return 0;
    });
  }, [missionsOpen, sortBy]);

  useEffect(() => {
    setSortedMissions(sortedMissionsMemo);
  }, [sortedMissionsMemo]);

  const sortOptions = [
    { label: 'Date de création', value: 'created_at' },
    { label: 'Date de début', value: 'start_date' },
  ];

  useEffect(() => {
    resetPagination();
    fetchMissions();
    setShouldLoad(true);

    return () => {
      resetPagination();
      setShouldLoad(false);
    };
  }, [fetchMissions, resetPagination]);

  // Ne pas réinitialiser sortedMissions lors des mises à jour de checkpoint
  useEffect(() => {
    if (selectedMissionNumber) {
      const filteredMissions = missionsOpen.filter((mission) => {
        const missionNum = mission.mission_number?.toString() || '';
        return missionNum
          .toLowerCase()
          .includes(selectedMissionNumber.toLowerCase());
      });
      setSortedMissions(filteredMissions);
    } else {
      setSortedMissions(missionsOpen);
    }
  }, [missionsOpen, selectedMissionNumber]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[repeat(13,_minmax(0,_1fr))] gap-3">
        <FilterButton
          className="col-span-2"
          placeholder="Trier par"
          options={sortOptions}
          onValueChange={(value) => setSortBy(value)}
        />
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
      </div>

      <div className="grid grid-cols-[repeat(13,_minmax(0,_1fr))] gap-3">
        <FilterButton
          className="col-span-1"
          placeholder="Mission"
          filter={false}
        />
        <ComboboxSuivi
          onMissionSelect={(missionNumber) => {
            setSelectedMissionNumber(missionNumber);
          }}
          onClear={() => {
            setSelectedMissionNumber(null);
          }}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Début de mission définitif"
          filter={false}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Point J-10 F (J-20)"
          filter={false}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Point J-10 X (J-20)"
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
          placeholder="Point Trimestre X"
          filter={false}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Point fin de mission X J-30"
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
          placeholder="XPERT"
          filter={false}
        />
        <FilterButton
          className="col-span-1"
          placeholder="Référent mission XPERT ONE"
          filter={false}
        />
      </div>

      <div className="grid grid-cols-[repeat(13,_minmax(0,_1fr))] gap-3">
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder="TOUS"
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={selectedMissionNumber?.toLocaleUpperCase() ?? 'TOUS'}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder="TOUS"
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_j_moins_10_f.toString()}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_j_moins_10_x.toString()}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_j_plus_10_f.toString()}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_j_plus_10_x.toString()}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_trimestre_x.toString()}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_fin_j_moins_30.toString()}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_j_plus_10_referent.toString()}
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder={checkpointCounts.point_rh_fin_j_plus_10_f.toString()}
          filter={false}
        />

        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder="TOUS"
          filter={false}
        />
        <FilterButton
          className="col-span-1 bg-[#363636] text-white hover:bg-[#363636] hover:text-white"
          placeholder="TOUS"
          filter={false}
        />
      </div>

      {(sortBy || selectedMissionNumber) && (
        <div className="flex justify-start">
          <Button
            variant="link"
            onClick={() => {
              setSortBy('');
              setSelectedMissionNumber(null);
              setSortedMissions(missionsOpen);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      <InfiniteScroll
        isLoading={isLoading}
        hasMore={hasMore}
        next={fetchMissions}
        threshold={0.8}
      >
        {sortedMissions.map((mission) => (
          <div key={mission.id}>
            <SuiviMissionsRow mission={mission} />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
}
