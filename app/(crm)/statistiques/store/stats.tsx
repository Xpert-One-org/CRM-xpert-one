import { create } from 'zustand';

// Types pour les données statistiques
type ChartDataPoint = {
  name: string;
  [key: string]: string | number;
}

type PieDataPoint = {
  name: string;
  value: number;
}

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
}

type MissionStats = {
  nombreMissions: number;
  dureeMoyenne: number;
  dureeMoyennePlacee: number;
  tauxMargeMoyen: number;
  caTotal: number;
  missionsParMetier: PieDataPoint[];
}

type FournisseurStats = {
  nombreSocietes: number;
  nombreTotal: number;
  newsletter: number;
  missionsParFournisseur: PieDataPoint[];
  secteursActivite: PieDataPoint[];
  sourceContact: PieDataPoint[];
}

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
}

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

  // Méthodes pour récupérer les statistiques
  fetchXpertStats: () => Promise<void>;
  fetchMissionStats: () => Promise<void>;
  fetchFournisseurStats: () => Promise<void>;
  fetchEvolutionData: () => Promise<void>;
}

// Pour l'instant, nous utiliserons des données fictives, mais ces fonctions
// seront remplacées par des appels réels à Supabase
const mockXpertStats: XpertStats = {
  inscrits: 1556,
  places: 12,
  inscritsMois: 1556,
  placesMois: 12,
  newsletter: 1556,
  tjmMoyen: 850,
  fichesCompletees: 980,
  statutsRepartition: [
    { name: 'Auto-entrepreneur', value: 45 },
    { name: 'SARL', value: 25 },
    { name: 'SAS', value: 20 },
    { name: 'Autre', value: 10 },
  ],
  sourceContact: [
    { name: 'LinkedIn', value: 45 },
    { name: 'Site Web', value: 25 },
    { name: 'Référence', value: 20 },
    { name: 'Autre', value: 10 },
  ],
  repartitionGeographique: [
    { name: 'Île-de-France', value: 55 },
    { name: 'Auvergne-Rhône-Alpes', value: 15 },
    { name: 'Nouvelle-Aquitaine', value: 12 },
    { name: 'Occitanie', value: 8 },
    { name: 'Autres régions', value: 10 },
  ],
};

const mockMissionStats: MissionStats = {
  nombreMissions: 145,
  dureeMoyenne: 120,
  dureeMoyennePlacee: 180,
  tauxMargeMoyen: 15,
  caTotal: 1500000,
  missionsParMetier: [
    { name: 'Ingénieur', value: 75 },
    { name: 'Chef de projet', value: 40 },
    { name: 'Consultant', value: 20 },
    { name: 'Autre', value: 10 },
  ],
};

const mockFournisseurStats: FournisseurStats = {
  nombreSocietes: 4,
  nombreTotal: 43,
  newsletter: 23,
  missionsParFournisseur: [
    { name: 'Fournisseur A', value: 25 },
    { name: 'Fournisseur B', value: 10 },
    { name: 'Fournisseur C', value: 5 },
    { name: 'Fournisseur D', value: 3 },
  ],
  secteursActivite: [
    { name: 'Énergie', value: 40 },
    { name: 'Industrie', value: 25 },
    { name: 'Consulting', value: 20 },
    { name: 'Autres', value: 15 },
  ],
  sourceContact: [
    { name: 'LinkedIn', value: 35 },
    { name: 'Site Web', value: 30 },
    { name: 'Salon', value: 20 },
    { name: 'Autre', value: 15 },
  ],
};

const mockEvolutionData: EvolutionData = {
  xpert: {
    inscritsEvolution: [
      { name: 'Jan', inscrits: 1200 },
      { name: 'Fév', inscrits: 1250 },
      { name: 'Mar', inscrits: 1300 },
      { name: 'Avr', inscrits: 1350 },
      { name: 'Mai', inscrits: 1400 },
      { name: 'Juin', inscrits: 1450 },
      { name: 'Juil', inscrits: 1500 },
      { name: 'Août', inscrits: 1556 },
    ],
    placesEvolution: [
      { name: 'Jan', places: 7 },
      { name: 'Fév', places: 8 },
      { name: 'Mar', places: 9 },
      { name: 'Avr', places: 9 },
      { name: 'Mai', places: 10 },
      { name: 'Juin', places: 11 },
      { name: 'Juil', places: 11 },
      { name: 'Août', places: 12 },
    ],
    inscritsMensuel: [
      { name: 'Jan', inscrits: 50 },
      { name: 'Fév', inscrits: 55 },
      { name: 'Mar', inscrits: 60 },
      { name: 'Avr', inscrits: 65 },
      { name: 'Mai', inscrits: 70 },
      { name: 'Juin', inscrits: 75 },
      { name: 'Juil', inscrits: 80 },
      { name: 'Août', inscrits: 85 },
    ],
    placesMensuel: [
      { name: 'Jan', places: 1 },
      { name: 'Fév', places: 1 },
      { name: 'Mar', places: 2 },
      { name: 'Avr', places: 1 },
      { name: 'Mai', places: 2 },
      { name: 'Juin', places: 2 },
      { name: 'Juil', places: 1 },
      { name: 'Août', places: 2 },
    ],
    fichesEvolution: [
      { name: 'Jan', fiches: 800 },
      { name: 'Fév', fiches: 820 },
      { name: 'Mar', fiches: 840 },
      { name: 'Avr', fiches: 860 },
      { name: 'Mai', fiches: 880 },
      { name: 'Juin', fiches: 900 },
      { name: 'Juil', fiches: 940 },
      { name: 'Août', fiches: 980 },
    ],
    newsletterEvolution: [
      { name: 'Jan', inscrits: 1000 },
      { name: 'Fév', inscrits: 1100 },
      { name: 'Mar', inscrits: 1200 },
      { name: 'Avr', inscrits: 1250 },
      { name: 'Mai', inscrits: 1300 },
      { name: 'Juin', inscrits: 1400 },
      { name: 'Juil', inscrits: 1500 },
      { name: 'Août', inscrits: 1556 },
    ],
    tjmEvolution: [
      { name: 'Jan', tjm: 800 },
      { name: 'Fév', tjm: 810 },
      { name: 'Mar', tjm: 820 },
      { name: 'Avr', tjm: 825 },
      { name: 'Mai', tjm: 830 },
      { name: 'Juin', tjm: 835 },
      { name: 'Juil', tjm: 840 },
      { name: 'Août', tjm: 850 },
    ],
  },
  mission: {
    missionsEvolution: [
      { name: 'Jan', missions: 80 },
      { name: 'Fév', missions: 90 },
      { name: 'Mar', missions: 100 },
      { name: 'Avr', missions: 110 },
      { name: 'Mai', missions: 120 },
      { name: 'Juin', missions: 125 },
      { name: 'Juil', missions: 135 },
      { name: 'Août', missions: 145 },
    ],
    dureeEvolution: [
      { name: 'Jan', duree: 100 },
      { name: 'Fév', duree: 105 },
      { name: 'Mar', duree: 110 },
      { name: 'Avr', duree: 112 },
      { name: 'Mai', duree: 115 },
      { name: 'Juin', duree: 118 },
      { name: 'Juil', duree: 119 },
      { name: 'Août', duree: 120 },
    ],
    dureePlaceeEvolution: [
      { name: 'Jan', duree: 160 },
      { name: 'Fév', duree: 165 },
      { name: 'Mar', duree: 168 },
      { name: 'Avr', duree: 170 },
      { name: 'Mai', duree: 172 },
      { name: 'Juin', duree: 175 },
      { name: 'Juil', duree: 178 },
      { name: 'Août', duree: 180 },
    ],
    tauxMargeEvolution: [
      { name: 'Jan', taux: 12 },
      { name: 'Fév', taux: 12.5 },
      { name: 'Mar', taux: 13 },
      { name: 'Avr', taux: 13.5 },
      { name: 'Mai', taux: 14 },
      { name: 'Juin', taux: 14.2 },
      { name: 'Juil', taux: 14.5 },
      { name: 'Août', taux: 15 },
    ],
    caEvolution: [
      { name: 'Jan', ca: 1100000 },
      { name: 'Fév', ca: 1150000 },
      { name: 'Mar', ca: 1200000 },
      { name: 'Avr', ca: 1250000 },
      { name: 'Mai', ca: 1300000 },
      { name: 'Juin', ca: 1350000 },
      { name: 'Juil', ca: 1400000 },
      { name: 'Août', ca: 1500000 },
    ],
  },
  fournisseur: {
    societesEvolution: [
      { name: 'Jan', societes: 1 },
      { name: 'Fév', societes: 2 },
      { name: 'Mar', societes: 2 },
      { name: 'Avr', societes: 3 },
      { name: 'Mai', societes: 3 },
      { name: 'Juin', societes: 3 },
      { name: 'Juil', societes: 4 },
      { name: 'Août', societes: 4 },
    ],
    fournisseursEvolution: [
      { name: 'Jan', fournisseurs: 25 },
      { name: 'Fév', fournisseurs: 27 },
      { name: 'Mar', fournisseurs: 30 },
      { name: 'Avr', fournisseurs: 33 },
      { name: 'Mai', fournisseurs: 35 },
      { name: 'Juin', fournisseurs: 38 },
      { name: 'Juil', fournisseurs: 40 },
      { name: 'Août', fournisseurs: 43 },
    ],
    newsletterEvolution: [
      { name: 'Jan', inscrits: 10 },
      { name: 'Fév', inscrits: 12 },
      { name: 'Mar', inscrits: 14 },
      { name: 'Avr', inscrits: 16 },
      { name: 'Mai', inscrits: 18 },
      { name: 'Juin', inscrits: 20 },
      { name: 'Juil', inscrits: 21 },
      { name: 'Août', inscrits: 23 },
    ],
  },
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

  // Méthodes pour récupérer les statistiques
  fetchXpertStats: async () => {
    set({ loadingXpert: true });

    try {
      // À terme, remplacer par un appel à Supabase
      // const supabase = createSupabaseFrontendClient();
      // const { data, error } = await supabase.rpc('get_xpert_stats');
      // if (error) throw error;

      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ xpertStats: mockXpertStats, loadingXpert: false });
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques XPERT:',
        error
      );
      set({ loadingXpert: false });
    }
  },

  fetchMissionStats: async () => {
    set({ loadingMission: true });

    try {
      // À terme, remplacer par un appel à Supabase
      // const supabase = createSupabaseFrontendClient();
      // const { data, error } = await supabase.rpc('get_mission_stats');
      // if (error) throw error;

      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ missionStats: mockMissionStats, loadingMission: false });
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques de mission:',
        error
      );
      set({ loadingMission: false });
    }
  },

  fetchFournisseurStats: async () => {
    set({ loadingFournisseur: true });

    try {
      // À terme, remplacer par un appel à Supabase
      // const supabase = createSupabaseFrontendClient();
      // const { data, error } = await supabase.rpc('get_fournisseur_stats');
      // if (error) throw error;

      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({
        fournisseurStats: mockFournisseurStats,
        loadingFournisseur: false,
      });
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des statistiques fournisseur:',
        error
      );
      set({ loadingFournisseur: false });
    }
  },

  fetchEvolutionData: async () => {
    set({ loadingEvolution: true });

    try {
      // À terme, remplacer par un appel à Supabase
      // const supabase = createSupabaseFrontendClient();
      // const { data, error } = await supabase.rpc('get_evolution_data');
      // if (error) throw error;

      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ evolutionData: mockEvolutionData, loadingEvolution: false });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données d'évolution:",
        error
      );
      set({ loadingEvolution: false });
    }
  },
}));

// Exportation des types pour réutilisation
export type {
  XpertStats,
  MissionStats,
  FournisseurStats,
  ChartDataPoint,
  PieDataPoint,
  EvolutionData,
};
