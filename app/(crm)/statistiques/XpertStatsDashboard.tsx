'use client';

import React, { useEffect } from 'react';
import StatCard from './_components/StatCard';
import LineChartStat from './_components/LineChartStats';
import BarChartStat from './_components/BarChartStats';
import PieChartStat from './_components/PieChartStats';
import AreaChartStat from './_components/AreaChartStats';
import { useStatistiquesStore } from './store/stats';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import XpertsCountryDistribution from './_components/XpertsCountryDistribution';

const XpertStatsDashboard: React.FC = () => {
  const {
    xpertStats,
    evolutionData,
    loadingXpert,
    loadingEvolution,
    errorXpert,
    errorEvolution,
    fetchXpertStats,
    fetchEvolutionData,
    resetErrors,
  } = useStatistiquesStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!xpertStats) await fetchXpertStats();
      if (!evolutionData) await fetchEvolutionData();
    };

    fetchData();
  }, [xpertStats, evolutionData, fetchXpertStats, fetchEvolutionData]);

  // Gestion des erreurs
  if (errorXpert || errorEvolution) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <AlertCircle className="size-12 text-red-500" />
        <h2 className="text-xl font-semibold text-red-800">
          Erreur de chargement des données
        </h2>
        <p className="text-red-600">
          {errorXpert ||
            errorEvolution ||
            "Une erreur s'est produite lors du chargement des statistiques."}
        </p>
        <Button
          onClick={() => {
            resetErrors();
            fetchXpertStats();
            fetchEvolutionData();
          }}
          className="mt-2"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  // Affichage du chargement
  if (loadingXpert || loadingEvolution || !xpertStats || !evolutionData) {
    return (
      <div className="flex h-60 w-full flex-col items-center justify-center gap-4">
        <Loader />
        <p className="text-gray-500">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <StatCard
        title="XPERT inscrits"
        value={xpertStats.inscrits}
        modalTitle="Évolution des XPERT inscrits"
        modalContent={
          <LineChartStat
            data={evolutionData.xpert.inscritsEvolution}
            dataKey="inscrits"
          />
        }
      />

      <StatCard
        title="XPERT placés"
        value={xpertStats.places}
        modalTitle="Évolution des XPERT placés"
        modalContent={
          <LineChartStat
            data={evolutionData.xpert.placesEvolution}
            dataKey="places"
          />
        }
      />

      <StatCard
        title="XPERT inscrits sur ce mois"
        value={xpertStats.inscritsMois}
        modalTitle="XPERT inscrits par mois"
        modalContent={
          <BarChartStat
            data={evolutionData.xpert.inscritsMensuel}
            dataKey="inscrits"
          />
        }
      />

      <StatCard
        title="XPERT placés sur ce mois"
        value={xpertStats.placesMois}
        modalTitle="XPERT placés par mois"
        modalContent={
          <BarChartStat
            data={evolutionData.xpert.placesMensuel}
            dataKey="places"
          />
        }
      />

      <StatCard
        title="Vue géographique"
        value="Voir détails"
        modalTitle="Distribution géographique des XPERT"
        modalContent={<XpertsCountryDistribution />}
        chartType="map"
      />

      <StatCard
        title="Fiches complétés"
        value={xpertStats.fichesCompletees}
        modalTitle="Progression des fiches complétées"
        modalContent={
          <AreaChartStat
            data={evolutionData.xpert.fichesEvolution}
            dataKey="fiches"
          />
        }
      />

      <StatCard
        title="Inscrits newsletter"
        value={xpertStats.newsletter}
        modalTitle="Évolution des inscrits à la newsletter"
        modalContent={
          <LineChartStat
            data={evolutionData.xpert.newsletterEvolution}
            dataKey="inscrits"
            color="#a9a9a9"
          />
        }
      />

      <StatCard
        title="TJM moyen"
        value={
          xpertStats.tjmMoyen > 0
            ? `${xpertStats.tjmMoyen} €`
            : 'Aucune donnée disponible'
        }
        modalTitle="Évolution du TJM moyen"
        modalContent={
          <LineChartStat
            data={evolutionData.xpert.tjmEvolution}
            dataKey="tjm"
            tooltipFormatter={(value) => `${value} €`}
          />
        }
      />

      <StatCard
        title="Répartition des statuts en %"
        value="Voir détails"
        modalTitle="Répartition des statuts juridiques"
        modalContent={<PieChartStat data={xpertStats.statutsRepartition} />}
      />

      <StatCard
        title="Source de contact"
        value="Voir détails"
        modalTitle="Sources de contact des XPERT"
        modalContent={<PieChartStat data={xpertStats.sourceContact} />}
      />
    </div>
  );
};

export default XpertStatsDashboard;
