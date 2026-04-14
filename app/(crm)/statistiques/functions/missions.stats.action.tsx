'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { checkAuthRole } from '@functions/auth/checkRole';
import { format, subMonths } from 'date-fns';
import { jobTitleSelect } from '@/data/mocked_select';

/**
 * Types pour les données de statistiques des Missions
 */
export type MissionStatData = {
  nombreMissions: number;
  dureeMoyenne: number;
  dureeMoyennePlacee: number;
  tauxMargeMoyen: number;
  caTotalReel: number;
  caTotalEstime: number;
  missionsParMetier: PieDataPoint[];
};

export type PieDataPoint = {
  name: string;
  value: number;
};

export type ChartDataPoint = {
  name: string;
  [key: string]: string | number;
};

/**
 * Filtre temporel optionnel sur created_at des missions.
 * - year seul : toute l'année
 * - year + month (1-12) : ce mois précis
 * - rien : aucun filtre (toutes périodes)
 */
export type DateFilter = { year?: number; month?: number };

const getDateRange = (
  filter?: DateFilter
): { startISO: string; endISO: string } | null => {
  if (!filter?.year) return null;
  const y = filter.year;
  if (filter.month && filter.month >= 1 && filter.month <= 12) {
    const start = new Date(Date.UTC(y, filter.month - 1, 1));
    const end = new Date(Date.UTC(y, filter.month, 1));
    return { startISO: start.toISOString(), endISO: end.toISOString() };
  }
  const start = new Date(Date.UTC(y, 0, 1));
  const end = new Date(Date.UTC(y + 1, 0, 1));
  return { startISO: start.toISOString(), endISO: end.toISOString() };
};

/**
 * Récupère le nombre total de missions (hors missions supprimées)
 */
export const getTotalMissions = async (
  dateFilter?: DateFilter
): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    let query = supabase
      .from('mission')
      .select('*', { count: 'exact', head: true })
      .neq('state', 'deleted');

    const range = getDateRange(dateFilter);
    if (range) {
      query = query
        .gte('created_at', range.startISO)
        .lt('created_at', range.endISO);
    }

    const { count, error } = await query;

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error(
      'Erreur lors de la récupération du nombre total de missions:',
      error
    );
    return 0;
  }
};

/**
 * Récupère la durée moyenne des missions en jours
 */
export const getDureeMoyenneMissions = async (
  dateFilter?: DateFilter
): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    let query = supabase
      .from('mission')
      .select('start_date, end_date')
      .neq('state', 'deleted');

    const range = getDateRange(dateFilter);
    if (range) {
      query = query
        .gte('created_at', range.startISO)
        .lt('created_at', range.endISO);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    // Calculer la durée en jours pour chaque mission
    const durations = data
      .map((mission) => {
        if (!mission.start_date || !mission.end_date) return 0;

        const startDate = new Date(mission.start_date);
        const endDate = new Date(mission.end_date);

        // Calculer la différence en millisecondes et convertir en jours
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
      })
      .filter((duration) => duration > 0);

    if (durations.length === 0) return 0;

    // Calculer la moyenne
    const average =
      durations.reduce((sum, duration) => sum + duration, 0) / durations.length;

    return Math.round(average);
  } catch (error) {
    console.error(
      'Erreur lors du calcul de la durée moyenne des missions:',
      error
    );
    return 0;
  }
};

/**
 * Récupère la durée moyenne des missions placées (missions avec un xpert associé)
 */
export const getDureeMoyenneMissionsPlacees = async (
  dateFilter?: DateFilter
): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    let query = supabase
      .from('mission')
      .select('start_date, end_date')
      .not('xpert_associated_id', 'is', null)
      .neq('state', 'deleted');

    const range = getDateRange(dateFilter);
    if (range) {
      query = query
        .gte('created_at', range.startISO)
        .lt('created_at', range.endISO);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    // Calculer la durée en jours pour chaque mission placée
    const durations = data
      .map((mission) => {
        if (!mission.start_date || !mission.end_date) return 0;

        const startDate = new Date(mission.start_date);
        const endDate = new Date(mission.end_date);

        // Calculer la différence en millisecondes et convertir en jours
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
      })
      .filter((duration) => duration > 0);

    if (durations.length === 0) return 0;

    // Calculer la moyenne
    const average =
      durations.reduce((sum, duration) => sum + duration, 0) / durations.length;

    return Math.round(average);
  } catch (error) {
    console.error(
      'Erreur lors du calcul de la durée moyenne des missions placées:',
      error
    );
    return 0;
  }
};

/**
 * Récupère le taux de marge moyen des missions (hors missions supprimées).
 */
export const getTauxMargeMoyen = async (
  dateFilter?: DateFilter
): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    let query = supabase
      .from('mission_finance')
      .select('margin, mission!inner(state, created_at)')
      .neq('mission.state', 'deleted');

    const range = getDateRange(dateFilter);
    if (range) {
      query = query
        .gte('mission.created_at', range.startISO)
        .lt('mission.created_at', range.endISO);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    // Filtrer les valeurs nulles, NaN, et les marges aberrantes (> 100%)
    const margins = data
      .filter((item) => item.margin !== null && item.margin !== undefined)
      .map((item) => Number(item.margin))
      .filter((m) => !isNaN(m) && m >= 0 && m <= 100);

    if (margins.length === 0) return 0;

    const average =
      margins.reduce((sum, margin) => sum + margin, 0) / margins.length;

    return parseFloat(average.toFixed(1));
  } catch (error) {
    console.error('Erreur lors du calcul du taux de marge moyen:', error);
    return 0;
  }
};

/**
 * Calcule le CA pour un ensemble de missions selon leurs états.
 * Utilise en priorité mission_finance.total_ca (CA réel saisi),
 * et retombe sur tjm × jours ouvrés en estimation si absent.
 */
const calculateCA = async (
  states: string,
  dateFilter?: DateFilter
): Promise<number> => {
  const supabase = await createSupabaseAppServerClient();

  let missionQuery = supabase
    .from('mission')
    .select('id, tjm, start_date, end_date')
    .filter('state', 'in', states);

  const range = getDateRange(dateFilter);
  if (range) {
    missionQuery = missionQuery
      .gte('created_at', range.startISO)
      .lt('created_at', range.endISO);
  }

  const { data: missionData, error: missionError } = await missionQuery;

  if (missionError) throw missionError;
  if (!missionData || missionData.length === 0) return 0;

  const { data: financeData, error: financeError } = await supabase
    .from('mission_finance')
    .select('mission_id, total_ca');

  if (financeError) throw financeError;

  let totalCA = 0;

  for (const mission of missionData) {
    const finance = financeData?.find((f) => f.mission_id === mission.id);
    const ca = finance?.total_ca ? Number(finance.total_ca) : 0;

    if (ca >= 500) {
      // Utiliser le CA réel saisi (seuil 500€ pour exclure les saisies incomplètes type "41" ou "111")
      totalCA += ca;
    } else if (mission.tjm && mission.start_date && mission.end_date) {
      const tjm = parseFloat(mission.tjm);
      if (!isNaN(tjm) && tjm > 0) {
        const startDate = new Date(mission.start_date);
        const endDate = new Date(mission.end_date);

        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const workingDays = Math.round(diffDays * (22 / 30));

        totalCA += tjm * workingDays;
      }
    }
  }

  return Math.round(totalCA);
};

/**
 * CA réel : missions en cours et terminées (données financières réelles)
 */
export const getCATotalReel = async (
  dateFilter?: DateFilter
): Promise<number> => {
  try {
    await checkAuthRole();
    return await calculateCA('(in_progress,finished)', dateFilter);
  } catch (error) {
    console.error('Erreur lors du calcul du CA réel:', error);
    return 0;
  }
};

/**
 * CA estimé : missions non placées (ouvertes)
 */
export const getCATotalEstime = async (
  dateFilter?: DateFilter
): Promise<number> => {
  try {
    await checkAuthRole();
    return await calculateCA('(open,open_all)', dateFilter);
  } catch (error) {
    console.error('Erreur lors du calcul du CA estimé:', error);
    return 0;
  }
};

/**
 * Récupère la répartition des missions par métier
 */
export const getMissionsParMetier = async (
  dateFilter?: DateFilter
): Promise<PieDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    let query = supabase
      .from('mission')
      .select('job_title, job_title_other')
      .neq('state', 'deleted');

    const range = getDateRange(dateFilter);
    if (range) {
      query = query
        .gte('created_at', range.startISO)
        .lt('created_at', range.endISO);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // Créer un mapping des valeurs aux libellés à partir de jobTitleSelect
    const jobTitleMapping: Record<string, string> = {};
    jobTitleSelect.forEach((job) => {
      jobTitleMapping[job.value] = job.label;
    });

    // Compter les occurrences de chaque métier
    const jobTitleCounts: Record<string, number> = {};

    data.forEach((mission) => {
      const jobTitleValue = mission.job_title || 'Non spécifié';
      let jobTitleName;

      // Si "other" est spécifié et que job_title_other existe, utiliser ce dernier
      if (jobTitleValue === 'other' && mission.job_title_other) {
        jobTitleName = mission.job_title_other;
      } else {
        // Sinon, utiliser le mapping pour obtenir le nom lisible
        jobTitleName = jobTitleMapping[jobTitleValue] || jobTitleValue;
      }

      jobTitleCounts[jobTitleName] = (jobTitleCounts[jobTitleName] || 0) + 1;
    });

    // Convertir en format requis pour le graphique
    return Object.entries(jobTitleCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des missions par métier:',
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution du nombre de missions sur les 12 derniers mois
 */
export const getMissionsEvolution = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const { count, error } = await supabase
        .from('mission')
        .select('*', { count: 'exact', head: true })
        .neq('state', 'deleted')
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      result.push({
        name: format(monthDate, 'MMM'),
        missions: count || 0,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution des missions:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution de la durée moyenne des missions sur les 12 derniers mois
 */
export const getDureeEvolution = async (): Promise<ChartDataPoint[]> => {
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

      const { data, error } = await supabase
        .from('mission')
        .select('start_date, end_date')
        .neq('state', 'deleted')
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) {
        result.push({
          name: format(monthDate, 'MMM'),
          duree: 0,
        });
        continue;
      }

      // Calculer la durée moyenne pour ce mois
      const durations = data
        .map((mission) => {
          if (!mission.start_date || !mission.end_date) return 0;

          const startDate = new Date(mission.start_date);
          const endDate = new Date(mission.end_date);

          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return diffDays;
        })
        .filter((duration) => duration > 0);

      let averageDuration = 0;
      if (durations.length > 0) {
        averageDuration = Math.round(
          durations.reduce((sum, duration) => sum + duration, 0) /
            durations.length
        );
      }

      result.push({
        name: format(monthDate, 'MMM'),
        duree: averageDuration,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution de la durée des missions:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution de la durée moyenne des missions placées sur les 12 derniers mois
 */
export const getDureePlaceeEvolution = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const { data, error } = await supabase
        .from('mission')
        .select('start_date, end_date')
        .not('xpert_associated_id', 'is', null)
        .neq('state', 'deleted')
        .lte('created_at', monthEnd.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) {
        result.push({
          name: format(monthDate, 'MMM'),
          duree: 0,
        });
        continue;
      }

      // Calculer la durée moyenne pour ce mois
      const durations = data
        .map((mission) => {
          if (!mission.start_date || !mission.end_date) return 0;

          const startDate = new Date(mission.start_date);
          const endDate = new Date(mission.end_date);

          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return diffDays;
        })
        .filter((duration) => duration > 0);

      let averageDuration = 0;
      if (durations.length > 0) {
        averageDuration = Math.round(
          durations.reduce((sum, duration) => sum + duration, 0) /
            durations.length
        );
      }

      result.push({
        name: format(monthDate, 'MMM'),
        duree: averageDuration,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution de la durée des missions placées:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution du taux de marge sur les 12 derniers mois
 */
export const getTauxMargeEvolution = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    // Récupérer toutes les missions avec leurs marges
    const { data: missionsData, error: missionsError } = await supabase
      .from('mission')
      .select('id, created_at')
      .neq('state', 'deleted');

    if (missionsError) throw missionsError;

    const { data: financeData, error: financeError } = await supabase
      .from('mission_finance')
      .select('mission_id, margin');

    if (financeError) throw financeError;

    // Créer un mapping des missions à leurs données financières
    const missionFinanceMap = new Map();
    financeData?.forEach((finance) => {
      missionFinanceMap.set(finance.mission_id, finance);
    });

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      // Filtrer les missions créées avant la fin du mois
      const missionsForMonth =
        missionsData?.filter(
          (mission) => new Date(mission.created_at) <= monthEnd
        ) || [];

      // Calculer la marge moyenne pour ce mois (exclure marges aberrantes > 100%)
      const margins: number[] = [];
      missionsForMonth.forEach((mission) => {
        const finance = missionFinanceMap.get(mission.id);
        if (
          finance &&
          finance.margin !== null &&
          finance.margin !== undefined
        ) {
          const m = Number(finance.margin);
          if (!isNaN(m) && m >= 0 && m <= 100) {
            margins.push(m);
          }
        }
      });

      let averageMargin = 0;
      if (margins.length > 0) {
        averageMargin = parseFloat(
          (
            margins.reduce((sum, margin) => sum + margin, 0) / margins.length
          ).toFixed(1)
        );
      }

      result.push({
        name: format(monthDate, 'MMM'),
        taux: averageMargin,
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution du taux de marge:",
      error
    );
    return [];
  }
};

/**
 * Récupère l'évolution du chiffre d'affaires sur les 12 derniers mois
 */
export const getCAEvolution = async (): Promise<ChartDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const result: ChartDataPoint[] = [];
    const currentDate = new Date();

    // Récupérer toutes les missions avec leurs données pertinentes
    const { data: missionsData, error: missionsError } = await supabase
      .from('mission')
      .select('id, created_at, tjm, start_date, end_date')
      .filter('state', 'in', '(open,open_all,in_progress,finished)');

    if (missionsError) throw missionsError;

    // Récupérer les données financières
    const { data: financeData, error: financeError } = await supabase
      .from('mission_finance')
      .select('mission_id, total_ca');

    if (financeError) throw financeError;

    // Créer un mapping des missions à leurs données financières
    const missionFinanceMap = new Map();
    financeData?.forEach((finance) => {
      missionFinanceMap.set(finance.mission_id, finance);
    });

    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(currentDate, i);
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      // Filtrer les missions créées avant la fin du mois
      const missionsForMonth =
        missionsData?.filter(
          (mission) => new Date(mission.created_at) <= monthEnd
        ) || [];

      // Calculer le CA pour ce mois
      let monthlyCA = 0;
      missionsForMonth.forEach((mission) => {
        const finance = missionFinanceMap.get(mission.id);
        const ca = finance?.total_ca ? Number(finance.total_ca) : 0;

        if (ca >= 500) {
          monthlyCA += ca;
        } else if (mission.tjm && mission.start_date && mission.end_date) {
          const tjm = parseFloat(mission.tjm);
          if (!isNaN(tjm) && tjm > 0) {
            const startDate = new Date(mission.start_date);
            const endDate = new Date(mission.end_date);

            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const workingDays = Math.round(diffDays * (22 / 30));

            monthlyCA += tjm * workingDays;
          }
        }
      });

      result.push({
        name: format(monthDate, 'MMM'),
        ca: Math.round(monthlyCA),
      });
    }

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'évolution du CA:",
      error
    );
    return [];
  }
};

/**
 * Récupère toutes les statistiques des missions en une seule fonction.
 * Accepte un filtre temporel optionnel sur created_at.
 */
export const getMissionStats = async (
  dateFilter?: DateFilter
): Promise<MissionStatData> => {
  try {
    await checkAuthRole();

    const [
      nombreMissions,
      dureeMoyenne,
      dureeMoyennePlacee,
      tauxMargeMoyen,
      caTotalReel,
      caTotalEstime,
      missionsParMetier,
    ] = await Promise.all([
      getTotalMissions(dateFilter),
      getDureeMoyenneMissions(dateFilter),
      getDureeMoyenneMissionsPlacees(dateFilter),
      getTauxMargeMoyen(dateFilter),
      getCATotalReel(dateFilter),
      getCATotalEstime(dateFilter),
      getMissionsParMetier(dateFilter),
    ]);

    return {
      nombreMissions,
      dureeMoyenne,
      dureeMoyennePlacee,
      tauxMargeMoyen,
      caTotalReel,
      caTotalEstime,
      missionsParMetier,
    };
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des statistiques des missions:',
      error
    );

    // Retourner des valeurs par défaut en cas d'erreur
    return {
      nombreMissions: 0,
      dureeMoyenne: 0,
      dureeMoyennePlacee: 0,
      tauxMargeMoyen: 0,
      caTotalReel: 0,
      caTotalEstime: 0,
      missionsParMetier: [],
    };
  }
};

/**
 * Récupère toutes les données d'évolution des missions en une seule fonction
 */
export const getMissionEvolutionData = async (): Promise<{
  missionsEvolution: ChartDataPoint[];
  dureeEvolution: ChartDataPoint[];
  dureePlaceeEvolution: ChartDataPoint[];
  tauxMargeEvolution: ChartDataPoint[];
  caEvolution: ChartDataPoint[];
}> => {
  try {
    await checkAuthRole();

    const [
      missionsEvolution,
      dureeEvolution,
      dureePlaceeEvolution,
      tauxMargeEvolution,
      caEvolution,
    ] = await Promise.all([
      getMissionsEvolution(),
      getDureeEvolution(),
      getDureePlaceeEvolution(),
      getTauxMargeEvolution(),
      getCAEvolution(),
    ]);

    return {
      missionsEvolution,
      dureeEvolution,
      dureePlaceeEvolution,
      tauxMargeEvolution,
      caEvolution,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données d'évolution des missions:",
      error
    );

    // Retourner des tableaux vides en cas d'erreur
    return {
      missionsEvolution: [],
      dureeEvolution: [],
      dureePlaceeEvolution: [],
      tauxMargeEvolution: [],
      caEvolution: [],
    };
  }
};
