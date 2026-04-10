'use client';

import React, { useEffect } from 'react';
import StatCard from './_components/StatCard';
import LineChartStat from './_components/LineChartStats';
import BarChartStat from './_components/BarChartStats';
import PieChartStat from './_components/PieChartStats';
import AreaChartStat from './_components/AreaChartStats';
import { useStatistiquesStore } from './store/stats';
import Loader from '@/components/Loader';

const MONTHS = [
  { value: 1, label: 'Janvier' },
  { value: 2, label: 'Février' },
  { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' },
  { value: 5, label: 'Mai' },
  { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' },
  { value: 8, label: 'Août' },
  { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' },
  { value: 11, label: 'Novembre' },
  { value: 12, label: 'Décembre' },
];

const MissionStatsDashboard: React.FC = () => {
  const {
    missionStats,
    evolutionData,
    loadingMission,
    loadingEvolution,
    fetchMissionStats,
    fetchEvolutionData,
    missionDateFilter,
    setMissionDateFilter,
  } = useStatistiquesStore();

  useEffect(() => {
    if (!missionStats) fetchMissionStats();
    if (!evolutionData) fetchEvolutionData();
  }, [missionStats, evolutionData, fetchMissionStats, fetchEvolutionData]);

  // Liste d'années dynamique : de 2024 à année courante
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= 2024; y--) years.push(y);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      // "Toutes" → on enlève year ET month
      setMissionDateFilter({});
    } else {
      setMissionDateFilter({
        year: parseInt(value, 10),
        month: missionDateFilter.month,
      });
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setMissionDateFilter({
      year: missionDateFilter.year,
      month: value ? parseInt(value, 10) : undefined,
    });
  };

  return (
    <>
      {/* Sélecteurs année / mois */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Période :</label>
        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          value={missionDateFilter.year ?? ''}
          onChange={handleYearChange}
        >
          <option value="">Toutes les années</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          value={missionDateFilter.month ?? ''}
          onChange={handleMonthChange}
          disabled={!missionDateFilter.year}
        >
          <option value="">Tous les mois</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        {(missionDateFilter.year || missionDateFilter.month) && (
          <button
            type="button"
            onClick={() => setMissionDateFilter({})}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {loadingMission || loadingEvolution || !missionStats || !evolutionData ? (
        <div className="flex h-60 w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <MissionStatsGrid
          missionStats={missionStats}
          evolutionData={evolutionData}
        />
      )}
    </>
  );
};

const MissionStatsGrid: React.FC<{
  missionStats: NonNullable<
    ReturnType<typeof useStatistiquesStore.getState>['missionStats']
  >;
  evolutionData: NonNullable<
    ReturnType<typeof useStatistiquesStore.getState>['evolutionData']
  >;
}> = ({ missionStats, evolutionData }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <StatCard
        title="Vue des missions par métiers"
        value="Voir détails"
        modalTitle="Répartition des missions par métier"
        modalContent={
          <PieChartStat
            data={missionStats.missionsParMetier}
            title="Répartition des missions par métier"
          />
        }
      />

      <StatCard
        title="Nombre de mission"
        value={missionStats.nombreMissions}
        modalTitle="Évolution du nombre de missions"
        modalContent={
          <LineChartStat
            data={evolutionData.mission.missionsEvolution}
            dataKey="missions"
          />
        }
      />

      <StatCard
        title="Durée moyenne des missions"
        value={`${missionStats.dureeMoyenne}j`}
        modalTitle="Évolution de la durée moyenne des missions"
        modalContent={
          <LineChartStat
            data={evolutionData.mission.dureeEvolution}
            dataKey="duree"
          />
        }
      />

      <StatCard
        title="Durée moyenne des missions placées"
        value={`${missionStats.dureeMoyennePlacee}j`}
        modalTitle="Évolution de la durée moyenne des missions placées"
        modalContent={
          <LineChartStat
            data={evolutionData.mission.dureePlaceeEvolution}
            dataKey="duree"
          />
        }
      />

      <StatCard
        title="Taux de marge moyen"
        value={`${missionStats.tauxMargeMoyen}%`}
        modalTitle="Évolution du taux de marge moyen"
        modalContent={
          <LineChartStat
            data={evolutionData.mission.tauxMargeEvolution}
            dataKey="taux"
            tooltipFormatter={(value) => `${value}%`}
          />
        }
      />

      <StatCard
        title="CA Réel (missions en cours / terminées)"
        value={`${missionStats.caTotalReel.toLocaleString('fr-FR')} €`}
        modalTitle="Évolution du CA réel"
        modalContent={
          <AreaChartStat
            data={evolutionData.mission.caEvolution}
            dataKey="ca"
            tooltipFormatter={(value) => `${value.toLocaleString('fr-FR')} €`}
          />
        }
      />

      <StatCard
        title="CA Estimé (missions non placées)"
        value={`${missionStats.caTotalEstime.toLocaleString('fr-FR')} €`}
        modalTitle="CA estimé des missions non placées"
        modalContent={
          <AreaChartStat
            data={evolutionData.mission.caEvolution}
            dataKey="ca"
            tooltipFormatter={(value) => `${value.toLocaleString('fr-FR')} €`}
          />
        }
      />
    </div>
  );
};

export default MissionStatsDashboard;
