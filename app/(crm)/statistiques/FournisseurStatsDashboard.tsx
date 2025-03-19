'use client';

import React, { useEffect } from 'react';
import StatCard from './_components/StatCard';
import LineChartStat from './_components/LineChartStats';
import PieChartStat from './_components/PieChartStats';
import { useStatistiquesStore } from './store/stats';
import Loader from '@/components/Loader';

const FournisseurStatsDashboard: React.FC = () => {
  const {
    fournisseurStats,
    evolutionData,
    loadingFournisseur,
    loadingEvolution,
    fetchFournisseurStats,
    fetchEvolutionData,
  } = useStatistiquesStore();

  useEffect(() => {
    if (!fournisseurStats) fetchFournisseurStats();
    if (!evolutionData) fetchEvolutionData();
  }, [
    fournisseurStats,
    evolutionData,
    fetchFournisseurStats,
    fetchEvolutionData,
  ]);

  if (
    loadingFournisseur ||
    loadingEvolution ||
    !fournisseurStats ||
    !evolutionData
  ) {
    return (
      <div className="flex h-60 w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      {/* <StatCard
        title="Nb de sociétés fournisseur"
        value={fournisseurStats.nombreSocietes}
        modalTitle="Évolution du nombre de sociétés fournisseur"
        modalContent={
          <LineChartStat
            data={evolutionData.fournisseur.societesEvolution}
            dataKey="societes"
          />
        }
      /> */}

      <StatCard
        title="Nb de F total"
        value={fournisseurStats.nombreTotal}
        modalTitle="Évolution du nombre total de fournisseurs"
        modalContent={
          <LineChartStat
            data={evolutionData.fournisseur.fournisseursEvolution}
            dataKey="fournisseurs"
          />
        }
      />

      <StatCard
        title="Vue des missions par fournisseurs"
        value="Voir détails"
        modalTitle="Répartition des missions par fournisseur"
        modalContent={
          <PieChartStat data={fournisseurStats.missionsParFournisseur} />
        }
      />

      <StatCard
        title="Secteur d'activité"
        value="Voir détails"
        modalTitle="Répartition par secteur d'activité"
        modalContent={<PieChartStat data={fournisseurStats.secteursActivite} />}
      />

      <StatCard
        title="Source de contact"
        value="Voir détails"
        modalTitle="Sources de contact des fournisseurs"
        modalContent={<PieChartStat data={fournisseurStats.sourceContact} />}
      />

      <StatCard
        title="F inscrits newsletter"
        value={fournisseurStats.newsletter}
        modalTitle="Évolution des fournisseurs inscrits à la newsletter"
        modalContent={
          <LineChartStat
            data={evolutionData.fournisseur.newsletterEvolution}
            dataKey="inscrits"
            color="#a9a9a9"
          />
        }
      />
    </div>
  );
};

export default FournisseurStatsDashboard;
