'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  how,
  statusSelectInde,
  statusSelectEmployee,
} from '@/data/mocked_select';

/**
 * Types pour les données de statistiques des Xperts
 */
export type XpertStatData = {
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

export type PieDataPoint = {
  name: string;
  value: number;
};

export type ChartDataPoint = {
  name: string;
  [key: string]: string | number;
};

// Types pour les données brutes récupérées de Supabase
type ProfileStatusData = {
  status: string | null;
};

type ProfileSourceData = {
  how_did_you_hear_about_us: string | null;
};

type ProfileRegionsData = {
  regions: string[] | null;
};

type TjmData = {
  desired_tjm: string | null;
};

/**
 * Récupère le nombre total d'Xperts inscrits
 */
export const getTotalXperts = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { count, error } = await supabase
      .from('profile')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'xpert');

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre total d'Xperts:",
      error
    );
    return 0;
  }
};

/**
 * Récupère le nombre d'Xperts placés (ayant au moins une mission associée)
 */
export const getPlacedXperts = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { count, error } = await supabase
      .from('profile')
      .select('*, mission!mission_xpert_associated_id_fkey!inner(*)', {
        count: 'exact',
        head: true,
      })
      .eq('role', 'xpert');

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre d'Xperts placés:",
      error
    );
    return 0;
  }
};

/**
 * Récupère le nombre d'Xperts inscrits pendant le mois en cours
 */
export const getXpertsInscritsMois = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const { count, error } = await supabase
      .from('profile')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'xpert')
      .gte('created_at', firstDayOfMonth.toISOString())
      .lte('created_at', lastDayOfMonth.toISOString());

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre d'Xperts inscrits ce mois-ci:",
      error
    );
    return 0;
  }
};

/**
 * Récupère le nombre d'Xperts placés pendant le mois en cours
 */
export const getXpertsPlacesMois = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const { count, error } = await supabase
      .from('mission')
      .select('*', { count: 'exact', head: true })
      .not('xpert_associated_id', 'is', null)
      .gte('created_at', firstDayOfMonth.toISOString())
      .lte('created_at', lastDayOfMonth.toISOString());

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre d'Xperts placés ce mois-ci:",
      error
    );
    return 0;
  }
};

/**
 * Récupère le nombre d'Xperts inscrits à la newsletter
 */
export const getXpertsNewsletter = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { count, error } = await supabase
      .from('user_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('newsletter', true);

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du nombre d'Xperts inscrits à la newsletter:",
      error
    );
    return 0;
  }
};

/**
 * Récupère le TJM moyen des Xperts - AMÉLIORÉ
 */
export const getXpertsTjmMoyen = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('profile_mission')
      .select('desired_tjm')
      .neq('desired_tjm', null);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    // Fonction pour nettoyer et convertir les valeurs TJM en nombres
    const cleanAndParseTjm = (tjmString: string | null): number | null => {
      if (!tjmString) return null;

      // Supprime tous les caractères non numériques sauf le point décimal
      const cleanedString = tjmString.replace(/[^\d.,]/g, '');
      // Remplace la virgule par un point si présent
      const normalizedString = cleanedString.replace(',', '.');
      // Convertit en nombre
      const value = parseFloat(normalizedString);

      return isNaN(value) ? null : value;
    };

    const tjmValues = data
      .map((item: TjmData) => cleanAndParseTjm(item.desired_tjm))
      .filter((tjm): tjm is number => tjm !== null && tjm > 0 && tjm < 10000); // Filtrer les valeurs aberrantes

    if (tjmValues.length === 0) return 0;

    const sumTjm = tjmValues.reduce((acc, tjm) => acc + tjm, 0);
    return Math.round(sumTjm / tjmValues.length);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du TJM moyen des Xperts:',
      error
    );
    return 0;
  }
};

/**
 * Récupère le nombre de fiches complétées par les Xperts
 */
export const getXpertsFichesCompletees = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { count, error } = await supabase
      .from('profile')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'xpert')
      .gte('totale_progression', 80); // Modifié pour utiliser le même seuil de 80% que dans getFichesCompletionEvolution

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du nombre de fiches complétées:',
      error
    );
    return 0;
  }
};

/**
 * Normalise une chaîne de caractères pour les statuts
 */
const normalizeStatusString = (status: string | null): string => {
  if (!status) return 'Non spécifié';

  // Retirer les espaces en trop, mettre en minuscules
  const normalized = status.trim().toLowerCase();

  // Mapper les valeurs similaires
  const mappings: Record<string, string> = {
    'auto-entrepreneur': 'Auto-entrepreneur',
    autoentrepreneur: 'Auto-entrepreneur',
    'auto entrepreneur': 'Auto-entrepreneur',
    portage: 'Portage salarial',
    'portage salarial': 'Portage salarial',
    salarial: 'Portage salarial',
    cdi: 'CDI',
    cdd: 'CDD',
    company: 'Entreprise',
    entreprise: 'Entreprise',
    société: 'Entreprise',
    societe: 'Entreprise',
    indépendant: 'Indépendant',
    independant: 'Indépendant',
    freelance: 'Indépendant',
    '': 'Non spécifié',
  };

  return mappings[normalized] || status;
};

/**
 * Récupère la répartition des statuts juridiques des Xperts - AMÉLIORÉ
 */
export const getXpertsStatutsRepartition = async (): Promise<
  PieDataPoint[]
> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('profile_status')
      .select('status');

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Créer un mapping des valeurs aux libellés
    const statusMapping: Record<string, string> = {};

    // Combiner les statuts des indépendants et salariés
    [...statusSelectInde, ...statusSelectEmployee].forEach((status) => {
      statusMapping[status.value] = status.label;
    });

    // Groupe les statuts en JavaScript avec normalisation
    const statusCounts: Record<string, number> = {};

    data.forEach((item: ProfileStatusData) => {
      // D'abord normaliser le statut
      const statusValue = normalizeStatusString(item.status);

      // Utiliser le label du mapping s'il existe, sinon utiliser la valeur normalisée
      const statusName = statusMapping[statusValue] || statusValue;

      statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
    });

    // Trier par nombre décroissant et limiter à 10 catégories maximum pour la lisibilité
    return Object.entries(statusCounts)
      .map(([name, value]): PieDataPoint => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la répartition des statuts des Xperts:',
      error
    );
    return [];
  }
};

/**
 * Normalise une chaîne de caractères pour les sources de contact
 */
const normalizeSourceString = (source: string | null): string => {
  if (!source) return 'Non spécifié';

  // Retirer les espaces en trop, mettre en minuscules
  const normalized = source.trim().toLowerCase();

  // Mapper les valeurs similaires
  const mappings: Record<string, string> = {
    linkedin: 'LinkedIn',
    'linked in': 'LinkedIn',
    'linked-in': 'LinkedIn',
    google: 'Google',
    'recherche google': 'Google',
    'moteur de recherche': 'Moteur de recherche',
    'bouche a oreille': 'Bouche à oreille',
    'bouche à oreille': 'Bouche à oreille',
    recommandation: 'Recommandation',
    ami: 'Recommandation',
    collègue: 'Recommandation',
    collegue: 'Recommandation',
    facebook: 'Réseaux sociaux',
    twitter: 'Réseaux sociaux',
    instagram: 'Réseaux sociaux',
    'réseau social': 'Réseaux sociaux',
    'reseau social': 'Réseaux sociaux',
    'réseaux sociaux': 'Réseaux sociaux',
    'reseaux sociaux': 'Réseaux sociaux',
    autre: 'Autre',
    other: 'Autre',
    '': 'Non spécifié',
  };

  return mappings[normalized] || source;
};

/**
 * Récupère la répartition des sources de contact des Xperts - AMÉLIORÉ
 */
export const getXpertsSourceContact = async (): Promise<PieDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('profile')
      .select('how_did_you_hear_about_us')
      .eq('role', 'xpert');

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Créer un mapping des valeurs aux libellés
    const sourceMapping: Record<string, string> = {};
    how.forEach((source) => {
      sourceMapping[source.value] = source.label;
    });

    // Groupe les sources en JavaScript avec normalisation
    const sourceCounts: Record<string, number> = {};

    data.forEach((item: ProfileSourceData) => {
      // D'abord normaliser la source
      const sourceValue = normalizeSourceString(item.how_did_you_hear_about_us);

      // Utiliser le label du mapping s'il existe, sinon utiliser la valeur normalisée
      const sourceName = sourceMapping[sourceValue] || sourceValue;

      sourceCounts[sourceName] = (sourceCounts[sourceName] || 0) + 1;
    });

    // Trier par nombre décroissant et limiter à 8 catégories maximum pour la lisibilité
    return Object.entries(sourceCounts)
      .map(([name, value]): PieDataPoint => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des sources de contact des Xperts:',
      error
    );
    return [];
  }
};

/**
 * Obtenir le nom d'une région à partir de son code
 */
const getRegionName = (regionCode: string): string => {
  // Mapping des codes de région aux noms (pour la France)
  const regionMapping: Record<string, string> = {
    '01': 'Guadeloupe',
    '02': 'Martinique',
    '03': 'Guyane',
    '04': 'La Réunion',
    '06': 'Mayotte',
    '11': 'Île-de-France',
    '24': 'Centre-Val de Loire',
    '27': 'Bourgogne-Franche-Comté',
    '28': 'Normandie',
    '32': 'Hauts-de-France',
    '44': 'Grand Est',
    '52': 'Pays de la Loire',
    '53': 'Bretagne',
    '75': 'Nouvelle-Aquitaine',
    '76': 'Occitanie',
    '84': 'Auvergne-Rhône-Alpes',
    '93': "Provence-Alpes-Côte d'Azur",
    '94': 'Corse',
    // Ajouter d'autres régions selon vos besoins
  };

  return regionMapping[regionCode] || regionCode;
};

/**
 * Récupère la répartition géographique des Xperts par pays - AMÉLIORÉ
 */
export const getXpertsRepartitionGeographique = async (): Promise<
  PieDataPoint[]
> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('profile')
      .select('country')
      .eq('role', 'xpert');

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Grouper par pays avec normalisation des valeurs
    const countryCounts: Record<string, number> = {};

    /**
     * Normalise le nom d'un pays pour l'affichage
     */
    const normalizeCountryName = (country: string): string => {
      // Mapping des pays pour standardiser les noms
      const countryMapping: Record<string, string> = {
        FR: 'France',
        TN: 'Tunisie',
        MA: 'Maroc',
        DZ: 'Algérie',
        CM: 'Cameroun',
        TG: 'Togo',
        AE: 'Émirats arabes unis',
        france: 'France',
        tunisie: 'Tunisie',
        maroc: 'Maroc',
        algerie: 'Algérie',
        algérie: 'Algérie',
        // Ajouter d'autres mappings au besoin
      };

      return countryMapping[country] || country;
    };

    data.forEach((item) => {
      let country = item.country || 'Non spécifié';

      // Traiter les chaînes vides
      if (country.trim() === '') {
        country = 'Non spécifié';
      }

      // Normaliser les noms de pays pour la visualisation
      const normalizedCountry = normalizeCountryName(country);

      countryCounts[normalizedCountry] =
        (countryCounts[normalizedCountry] || 0) + 1;
    });

    // Trier par nombre décroissant
    return Object.entries(countryCounts)
      .map(([name, value]): PieDataPoint => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la répartition géographique des Xperts:',
      error
    );
    return [];
  }
};

/**
 * Type pour les données de distribution par pays
 */
export type CountryData = {
  country: string;
  count: number;
};

/**
 * Récupère la distribution des Xperts par pays
 */
export const getXpertsCountryDistribution = async (): Promise<
  CountryData[]
> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    // Récupérer tous les pays des Xperts
    const { data, error } = await supabase
      .from('profile')
      .select('country')
      .eq('role', 'xpert');

    if (error) throw error;

    // Traiter les données pour compter les occurrences de chaque pays
    const countryCounts: Record<string, number> = {};

    data.forEach((profile) => {
      // Récupérer le code pays ou une valeur par défaut
      let country = profile.country || 'NULL';

      // Gérer les chaînes vides
      if (country.trim() === '') {
        country = 'EMPTY';
      }

      // Normaliser le code pays en majuscules pour assurer la compatibilité avec i18n-iso-countries
      // Les codes ISO-2 sont toujours en majuscules
      if (country !== 'NULL' && country !== 'EMPTY') {
        country = country.toUpperCase();
      }

      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    // Convertir en format attendu par le composant
    const formattedData = Object.entries(countryCounts).map(
      ([country, count]) => ({
        country,
        count,
      })
    );

    return formattedData;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la distribution par pays:',
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution des Xperts inscrits sur les 12 derniers mois
 */
export const getXpertsInscritsEvolution = async (): Promise<
  ChartDataPoint[]
> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const { count, error } = await supabase
        .from('profile')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'xpert')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      result.push({
        name: format(monthDate, 'MMM'),
        inscrits: count || 0,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution des inscriptions d'Xperts:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution des Xperts placés sur les 12 derniers mois
 */
export const getXpertsPlacesEvolution = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const { count, error } = await supabase
        .from('mission')
        .select('*', { count: 'exact', head: true })
        .not('xpert_associated_id', 'is', null)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      result.push({
        name: format(monthDate, 'MMM'),
        places: count || 0,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution des placements d'Xperts:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution mensuelle des Xperts inscrits - NOUVEAU
 */
export const getXpertsInscritsMensuel = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const { count, error } = await supabase
        .from('profile')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'xpert')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      result.push({
        name: format(monthDate, 'MMM'),
        inscrits: count || 0,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des inscriptions mensuelles d'Xperts:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution mensuelle des Xperts placés - NOUVEAU
 */
export const getXpertsPlacesMensuel = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const { count, error } = await supabase
        .from('mission')
        .select('*', { count: 'exact', head: true })
        .not('xpert_associated_id', 'is', null)
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      result.push({
        name: format(monthDate, 'MMM'),
        places: count || 0,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des placements mensuels d'Xperts:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution des fiches complétées - NOUVEAU
 */
export const getFichesCompletionEvolution = async (): Promise<
  ChartDataPoint[]
> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);

      const { count, error } = await supabase
        .from('profile')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'xpert')
        .gte('totale_progression', 80)
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      result.push({
        name: format(monthDate, 'MMM'),
        fiches: count || 0,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution des fiches complétées:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution des inscriptions à la newsletter - NOUVEAU
 */
export const getNewsletterEvolution = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthEnd = endOfMonth(monthDate);

      const { count, error } = await supabase
        .from('user_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('newsletter', true)
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      result.push({
        name: format(monthDate, 'MMM'),
        inscrits: count || 0,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution des inscriptions à la newsletter:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution du TJM moyen - NOUVEAU
 */
/**
 * Récupère l'évolution du TJM moyen - CORRIGÉ
 */
export const getTjmEvolution = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    // Cette requête va chercher tous les profils avec leur profile_mission
    // pour pouvoir filtrer par la date de création du profil
    const { data: allProfiles, error: profileError } = await supabase
      .from('profile')
      .select('created_at, profile_mission(desired_tjm)')
      .eq('role', 'xpert');

    if (profileError) throw profileError;

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      // Pour le TJM, nous calculons la moyenne progressive jusqu'à chaque mois
      const monthEnd = endOfMonth(monthDate);

      // Filtrer les profils créés avant la fin du mois
      const profilesUpToMonth = allProfiles.filter(
        (profile) => new Date(profile.created_at) <= monthEnd
      );

      // Extraire les TJM de ces profils
      const tjmStrings = profilesUpToMonth.flatMap((profile) => {
        if (Array.isArray(profile.profile_mission)) {
          return profile.profile_mission
            .filter((pm) => pm?.desired_tjm)
            .map((pm) => pm.desired_tjm);
        }
        return profile.profile_mission?.desired_tjm
          ? [profile.profile_mission.desired_tjm]
          : [];
      });

      // Fonction pour nettoyer et convertir les valeurs TJM
      const cleanAndParseTjm = (tjmString: string | null): number | null => {
        if (!tjmString) return null;

        // Supprime tous les caractères non numériques sauf le point décimal et la virgule
        const cleanedString = tjmString.replace(/[^\d.,]/g, '');
        // Remplace la virgule par un point si présent
        const normalizedString = cleanedString.replace(',', '.');
        // Convertit en nombre
        const value = parseFloat(normalizedString);

        return isNaN(value) ? null : value;
      };

      const tjmValues = tjmStrings
        .map((tjmString) => cleanAndParseTjm(tjmString))
        .filter((tjm): tjm is number => tjm !== null && tjm > 0 && tjm < 10000);

      const averageTjm =
        tjmValues.length > 0
          ? Math.round(
              tjmValues.reduce((acc, tjm) => acc + tjm, 0) / tjmValues.length
            )
          : 0;

      result.push({
        name: format(monthDate, 'MMM'),
        tjm: averageTjm,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution du TJM moyen:",
      error
    );
    return [];
  }
};

/**
 * Récupère toutes les statistiques des Xperts en une seule fonction
 */
export const getXpertStats = async (): Promise<XpertStatData> => {
  try {
    await checkAuthRole();

    const [
      inscrits,
      places,
      inscritsMois,
      placesMois,
      newsletter,
      tjmMoyen,
      fichesCompletees,
      statutsRepartition,
      sourceContact,
      repartitionGeographique,
    ] = await Promise.all([
      getTotalXperts(),
      getPlacedXperts(),
      getXpertsInscritsMois(),
      getXpertsPlacesMois(),
      getXpertsNewsletter(),
      getXpertsTjmMoyen(),
      getXpertsFichesCompletees(),
      getXpertsStatutsRepartition(),
      getXpertsSourceContact(),
      getXpertsRepartitionGeographique(),
    ]);

    return {
      inscrits,
      places,
      inscritsMois,
      placesMois,
      newsletter,
      tjmMoyen,
      fichesCompletees,
      statutsRepartition,
      sourceContact,
      repartitionGeographique,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des statistiques des Xperts:',
      error
    );

    // Retourner des valeurs par défaut en cas d'erreur
    return {
      inscrits: 0,
      places: 0,
      inscritsMois: 0,
      placesMois: 0,
      newsletter: 0,
      tjmMoyen: 0,
      fichesCompletees: 0,
      statutsRepartition: [],
      sourceContact: [],
      repartitionGeographique: [],
    };
  }
};

/**
 * Récupère toutes les données d'évolution des Xperts en une seule fonction - AMÉLIORÉ
 */
export const getXpertEvolutionData = async (): Promise<{
  inscritsEvolution: ChartDataPoint[];
  placesEvolution: ChartDataPoint[];
  inscritsMensuel: ChartDataPoint[];
  placesMensuel: ChartDataPoint[];
  fichesEvolution: ChartDataPoint[];
  newsletterEvolution: ChartDataPoint[];
  tjmEvolution: ChartDataPoint[];
}> => {
  try {
    await checkAuthRole();

    // Appel parallèle de toutes les fonctions d'évolution pour améliorer les performances
    const [
      inscritsEvolution,
      placesEvolution,
      inscritsMensuel,
      placesMensuel,
      fichesEvolution,
      newsletterEvolution,
      tjmEvolution,
    ] = await Promise.all([
      getXpertsInscritsEvolution(),
      getXpertsPlacesEvolution(),
      getXpertsInscritsMensuel(),
      getXpertsPlacesMensuel(),
      getFichesCompletionEvolution(),
      getNewsletterEvolution(),
      getTjmEvolution(),
    ]);

    return {
      inscritsEvolution,
      placesEvolution,
      inscritsMensuel,
      placesMensuel,
      fichesEvolution,
      newsletterEvolution,
      tjmEvolution,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données d'évolution des Xperts:",
      error
    );

    // Retourner des tableaux vides en cas d'erreur
    return {
      inscritsEvolution: [],
      placesEvolution: [],
      inscritsMensuel: [],
      placesMensuel: [],
      fichesEvolution: [],
      newsletterEvolution: [],
      tjmEvolution: [],
    };
  }
};
