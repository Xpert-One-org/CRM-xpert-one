'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';
import { format, subMonths } from 'date-fns';

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
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    const { count, error } = await supabase
      .from('profile')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'xpert')
      .gte('created_at', firstDayOfMonth.toISOString())
      .lt('created_at', firstDayOfNextMonth.toISOString());

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
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfNextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    const { count, error } = await supabase
      .from('mission')
      .select('*', { count: 'exact', head: true })
      .not('xpert_associated_id', 'is', null)
      .gte('created_at', firstDayOfMonth.toISOString())
      .lt('created_at', firstDayOfNextMonth.toISOString());

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
 * Récupère le TJM moyen des Xperts
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

    const tjmValues = data
      .map((item: TjmData) => parseFloat(item.desired_tjm as string))
      .filter((tjm: number) => !isNaN(tjm));

    if (tjmValues.length === 0) return 0;

    const sumTjm = tjmValues.reduce((acc: number, tjm: number) => acc + tjm, 0);
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
      .eq('totale_progression', 100);

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
 * Récupère la répartition des statuts juridiques des Xperts
 */
export const getXpertsStatutsRepartition = async (): Promise<
  PieDataPoint[]
> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    // Remplace .group() par une requête simple et un traitement JavaScript
    const { data, error } = await supabase
      .from('profile_status')
      .select('status')
      .not('status', 'is', null);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Groupe les statuts en JavaScript
    const statusCounts: Record<string, number> = {};

    data.forEach((item: ProfileStatusData) => {
      const status = item.status || 'Non spécifié';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Convertit au format requis
    return Object.entries(statusCounts).map(
      ([status, count]: [string, number]): PieDataPoint => ({
        name: status,
        value: count,
      })
    );
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la répartition des statuts des Xperts:',
      error
    );
    return [];
  }
};

/**
 * Récupère la répartition des sources de contact des Xperts
 */
export const getXpertsSourceContact = async (): Promise<PieDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    // Remplace .group() par une requête simple et un traitement JavaScript
    const { data, error } = await supabase
      .from('profile')
      .select('how_did_you_hear_about_us')
      .eq('role', 'xpert')
      .not('how_did_you_hear_about_us', 'is', null);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Groupe les sources en JavaScript
    const sourceCounts: Record<string, number> = {};

    data.forEach((item: ProfileSourceData) => {
      const source = item.how_did_you_hear_about_us || 'Non spécifié';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    // Convertit au format requis
    return Object.entries(sourceCounts).map(
      ([source, count]: [string, number]): PieDataPoint => ({
        name: source,
        value: count,
      })
    );
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des sources de contact des Xperts:',
      error
    );
    return [];
  }
};

/**
 * Récupère la répartition géographique des Xperts
 */
export const getXpertsRepartitionGeographique = async (): Promise<
  PieDataPoint[]
> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    // Remplace .unnest() et .group() par une requête simple et un traitement JavaScript
    const { data, error } = await supabase
      .from('profile')
      .select('regions')
      .eq('role', 'xpert')
      .not('regions', 'is', null);

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Traite les tableaux de régions en JavaScript
    const regionCounts: Record<string, number> = {};

    data.forEach((item: ProfileRegionsData) => {
      if (item.regions && Array.isArray(item.regions)) {
        item.regions.forEach((region: string) => {
          const regionName = region || 'Non spécifié';
          regionCounts[regionName] = (regionCounts[regionName] || 0) + 1;
        });
      }
    });

    // Convertit au format requis
    return Object.entries(regionCounts).map(
      ([region, count]: [string, number]): PieDataPoint => ({
        name: region,
        value: count,
      })
    );
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de la répartition géographique des Xperts:',
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
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

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
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

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
 * Récupère toutes les données d'évolution des Xperts en une seule fonction
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

    const [inscritsEvolution, placesEvolution] = await Promise.all([
      getXpertsInscritsEvolution(),
      getXpertsPlacesEvolution(),
    ]);

    // Pour les autres évolutions, nous utiliserons des données simulées pour l'instant
    // Ces fonctions seraient à implémenter selon le même modèle que les deux précédentes

    // Note: Pour une implémentation réelle, créez des fonctions supplémentaires pour ces données
    const inscritsMensuel = inscritsEvolution.map(
      (item: ChartDataPoint): ChartDataPoint => ({
        name: item.name,
        inscrits: Math.round(Math.random() * 10) + 5,
      })
    );

    const placesMensuel = placesEvolution.map(
      (item: ChartDataPoint): ChartDataPoint => ({
        name: item.name,
        places: Math.round(Math.random() * 3) + 1,
      })
    );

    const fichesEvolution = inscritsEvolution.map(
      (item: ChartDataPoint): ChartDataPoint => ({
        name: item.name,
        fiches: Math.round((item.inscrits as number) * 0.7),
      })
    );

    const newsletterEvolution = inscritsEvolution.map(
      (item: ChartDataPoint): ChartDataPoint => ({
        name: item.name,
        inscrits: Math.round((item.inscrits as number) * 0.8),
      })
    );

    const tjmEvolution = inscritsEvolution.map(
      (item: ChartDataPoint): ChartDataPoint => ({
        name: item.name,
        tjm: Math.round(800 + Math.random() * 100),
      })
    );

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
