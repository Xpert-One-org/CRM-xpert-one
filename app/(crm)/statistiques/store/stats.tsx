import { create } from 'zustand';
import {
  getXpertStats,
  getXpertEvolutionData,
  type PieDataPoint,
  type ChartDataPoint,
} from '../functions/xperts.stats.action';
import {
  getMissionStats,
  getMissionEvolutionData,
} from '../functions/missions.stats.action';
import {
  getFournisseurStats,
  getFournisseurEvolutionData,
} from '../functions/fournisseurs.stats.action';

// Types pour les données statistiques
type XpertStats = {
  inscrits: number;
  places: number;
  inscritsMois: number;
  placesMois: number;
  newsletter: number;
  tjmMoyen: number;
  fichesCompletees: number;
  statutsRepartition: PieDataPoint[];
  sourceContact: PieDataPoint[];
  repartitionGeographique: PieDataPoint[];
};

type MissionStats = {
  nombreMissions: number;
  dureeMoyenne: number;
  dureeMoyennePlacee: number;
  tauxMargeMoyen: number;
  caTotal: number;
  missionsParMetier: PieDataPoint[];
};

type FournisseurStats = {
  nombreSocietes: number;
  nombreTotal: number;
  newsletter: number;
  missionsParFournisseur: PieDataPoint[];
  secteursActivite: PieDataPoint[];
  sourceContact: PieDataPoint[];
};

type EvolutionData = {
  xpert: {
    inscritsEvolution: ChartDataPoint[];
    placesEvolution: ChartDataPoint[];
    inscritsMensuel: ChartDataPoint[];
    placesMensuel: ChartDataPoint[];
    fichesEvolution: ChartDataPoint[];
    newsletterEvolution: ChartDataPoint[];
    tjmEvolution: ChartDataPoint[];
  };
  mission: {
    missionsEvolution: ChartDataPoint[];
    dureeEvolution: ChartDataPoint[];
    dureePlaceeEvolution: ChartDataPoint[];
    tauxMargeEvolution: ChartDataPoint[];
    caEvolution: ChartDataPoint[];
  };
  fournisseur: {
    societesEvolution: ChartDataPoint[];
    fournisseursEvolution: ChartDataPoint[];
    newsletterEvolution: ChartDataPoint[];
  };
};

type StatistiquesState = {
  // États
  xpertStats: XpertStats | null;
  missionStats: MissionStats | null;
  fournisseurStats: FournisseurStats | null;
  evolutionData: EvolutionData | null;

  // États de chargement
  loadingXpert: boolean;
  loadingMission: boolean;
  loadingFournisseur: boolean;
  loadingEvolution: boolean;

  // Erreurs
  errorXpert: string | null;
  errorMission: string | null;
  errorFournisseur: string | null;
  errorEvolution: string | null;

  // Méthodes pour récupérer les statistiques
  fetchXpertStats: () => Promise<void>;
  fetchMissionStats: () => Promise<void>;
  fetchFournisseurStats: () => Promise<void>;
  fetchEvolutionData: () => Promise<void>;

  // Méthode pour réinitialiser les erreurs
  resetErrors: () => void;
};

export const useStatistiquesStore = create<StatistiquesState>((set) => ({
  // États initiaux
  xpertStats: null,
  missionStats: null,
  fournisseurStats: null,
  evolutionData: null,

  // États de chargement
  loadingXpert: false,
  loadingMission: false,
  loadingFournisseur: false,
  loadingEvolution: false,

  // États d'erreur
  errorXpert: null,
  errorMission: null,
  errorFournisseur: null,
  errorEvolution: null,

  // Réinitialisation des erreurs
  resetErrors: () =>
    set({
      errorXpert: null,
      errorMission: null,
      errorFournisseur: null,
      errorEvolution: null,
    }),

  // Méthodes pour récupérer les statistiques
  fetchXpertStats: async () => {
    set({ loadingXpert: true, errorXpert: null });

    try {
      // Appel à la fonction serveur réelle
      const stats = await getXpertStats();
      set({ xpertStats: stats, loadingXpert: false });
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques XPERT:',
        error
      );
      set({
        loadingXpert: false,
        errorXpert:
          error instanceof Error ? error.message : "Une erreur s'est produite",
      });
    }
  },

  fetchMissionStats: async () => {
    set({ loadingMission: true, errorMission: null });

    try {
      // Appel à la fonction serveur réelle
      const stats = await getMissionStats();
      set({ missionStats: stats, loadingMission: false });
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques de mission:',
        error
      );
      set({
        loadingMission: false,
        errorMission:
          error instanceof Error ? error.message : "Une erreur s'est produite",
      });
    }
  },

  fetchFournisseurStats: async () => {
    set({ loadingFournisseur: true, errorFournisseur: null });

    try {
      // Appel à la fonction serveur réelle
      const stats = await getFournisseurStats();
      set({ fournisseurStats: stats, loadingFournisseur: false });
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques fournisseur:',
        error
      );
      set({
        loadingFournisseur: false,
        errorFournisseur:
          error instanceof Error ? error.message : "Une erreur s'est produite",
      });
    }
  },

  fetchEvolutionData: async () => {
    set({ loadingEvolution: true, errorEvolution: null });

    try {
      // Récupérer toutes les données d'évolution
      const [
        xpertEvolutionData,
        missionEvolutionData,
        fournisseurEvolutionData,
      ] = await Promise.all([
        getXpertEvolutionData(),
        getMissionEvolutionData(),
        getFournisseurEvolutionData(),
      ]);

      // Créer la structure complète d'évolution
      const evolutionData: EvolutionData = {
        xpert: xpertEvolutionData,
        mission: missionEvolutionData,
        fournisseur: fournisseurEvolutionData,
      };

      set({ evolutionData, loadingEvolution: false });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données d'évolution:",
        error
      );
      set({
        loadingEvolution: false,
        errorEvolution:
          error instanceof Error ? error.message : "Une erreur s'est produite",
      });
    }
  },
}));
