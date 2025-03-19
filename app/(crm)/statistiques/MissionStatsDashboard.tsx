'use client';

import React, { useEffect } from 'react';
import StatCard from './_components/StatCard';
import LineChartStat from './_components/LineChartStats';
import BarChartStat from './_components/BarChartStats';
import PieChartStat from './_components/PieChartStats';
import AreaChartStat from './_components/AreaChartStats';
import { useStatistiquesStore } from './store/stats';
import Loader from '@/components/Loader';

const MissionStatsDashboard: React.FC = () => {
  const {
    missionStats,
    evolutionData,
    loadingMission,
    loadingEvolution,
    fetchMissionStats,
    fetchEvolutionData,
  } = useStatistiquesStore();

  useEffect(() => {
    if (!missionStats) fetchMissionStats();
    if (!evolutionData) fetchEvolutionData();
  }, [missionStats, evolutionData, fetchMissionStats, fetchEvolutionData]);

  if (loadingMission || loadingEvolution || !missionStats || !evolutionData) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

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
        title="CA TOTAL mission"
        value={`${missionStats.caTotal.toLocaleString('fr-FR')} €`}
        modalTitle="Évolution du chiffre d'affaires total"
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
