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
  caTotal: number;
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
 * Récupère le nombre total de missions
 */
export const getTotalMissions = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { count, error } = await supabase
      .from('mission')
      .select('*', { count: 'exact', head: true });

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
export const getDureeMoyenneMissions = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('mission')
      .select('start_date, end_date');

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
export const getDureeMoyenneMissionsPlacees = async (): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('mission')
      .select('start_date, end_date')
      .not('xpert_associated_id', 'is', null);

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
 * Récupère le taux de marge moyen des missions
 * @param period - Période en mois pour laquelle calculer la marge (optionnel)
 */
export const getTauxMargeMoyen = async (period?: number): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    let query = supabase.from('mission_finance').select('margin, created_at');

    // Filtrer par période si spécifiée (par défaut: 12 derniers mois)
    if (period !== undefined) {
      const dateLimit = new Date();
      dateLimit.setMonth(dateLimit.getMonth() - (period || 12));
      query = query.gte('created_at', dateLimit.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    // Filtrer les valeurs nulles et calculer la moyenne
    const margins = data
      .filter((item) => item.margin !== null && item.margin !== undefined)
      .map((item) => Number(item.margin));

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
 * Calcule le chiffre d'affaires total des missions
 * @param period - Période en mois pour laquelle calculer le CA (optionnel)
 */
export const getCATotal = async (period?: number): Promise<number> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    // Date limite pour le filtrage par période
    let dateLimit;
    if (period !== undefined) {
      dateLimit = new Date();
      dateLimit.setMonth(dateLimit.getMonth() - (period || 12));
    }

    // Requête des missions avec filtrage par période si spécifiée
    let missionQuery = supabase
      .from('mission')
      .select('id, tjm, start_date, end_date, created_at')
      .filter('state', 'in', '(open,open_all,in_progress,finished)');

    if (dateLimit) {
      missionQuery = missionQuery.gte('created_at', dateLimit.toISOString());
    }

    const { data: missionData, error: missionError } = await missionQuery;

    if (missionError) throw missionError;

    if (!missionData || missionData.length === 0) return 0;

    // Requête des données financières avec filtrage par période si spécifiée
    let financeQuery = supabase
      .from('mission_finance')
      .select(
        'mission_id, daily_rate, days_worked, monthly_rate, months_worked, created_at'
      );

    if (dateLimit) {
      financeQuery = financeQuery.gte('created_at', dateLimit.toISOString());
    }

    const { data: financeData, error: financeError } = await financeQuery;

    if (financeError) throw financeError;

    let totalCA = 0;

    // Pour chaque mission, calculer son CA
    for (const mission of missionData) {
      const finance = financeData?.find((f) => f.mission_id === mission.id);

      if (finance) {
        // Si on a des données financières précises
        if (finance.daily_rate && finance.days_worked) {
          totalCA += finance.daily_rate * finance.days_worked;
        } else if (finance.monthly_rate && finance.months_worked) {
          totalCA += finance.monthly_rate * finance.months_worked;
        }
      } else if (mission.tjm && mission.start_date && mission.end_date) {
        // Sinon estimation basée sur le TJM et la durée
        const tjm = parseFloat(mission.tjm);
        const startDate = new Date(mission.start_date);
        const endDate = new Date(mission.end_date);

        // Calculer les jours ouvrés entre les deux dates (estimation approximative: 22 jours ouvrés par mois)
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const workingDays = Math.round(diffDays * (22 / 30)); // Estimation des jours ouvrés

        totalCA += tjm * workingDays;
      }
    }

    return Math.round(totalCA);
  } catch (error) {
    console.error('Erreur lors du calcul du CA total:', error);
    return 0;
  }
};

/**
 * Récupère la répartition des missions par métier
 */
export const getMissionsParMetier = async (): Promise<PieDataPoint[]> => {
  try {
    await checkAuthRole();
    const supabase = await createSupabaseAppServerClient();

    const { data, error } = await supabase
      .from('mission')
      .select('job_title, job_title_other');

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
      .select('id, created_at');

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

      // Calculer la marge moyenne pour ce mois
      const margins: number[] = [];
      missionsForMonth.forEach((mission) => {
        const finance = missionFinanceMap.get(mission.id);
        if (
          finance &&
          finance.margin !== null &&
          finance.margin !== undefined
        ) {
          margins.push(Number(finance.margin));
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
      .select(
        'mission_id, daily_rate, days_worked, monthly_rate, months_worked'
      );

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

        if (finance) {
          // Si on a des données financières précises
          if (finance.daily_rate && finance.days_worked) {
            monthlyCA += finance.daily_rate * finance.days_worked;
          } else if (finance.monthly_rate && finance.months_worked) {
            monthlyCA += finance.monthly_rate * finance.months_worked;
          }
        } else if (mission.tjm && mission.start_date && mission.end_date) {
          // Sinon estimation basée sur le TJM et la durée
          const tjm = parseFloat(mission.tjm);
          const startDate = new Date(mission.start_date);
          const endDate = new Date(mission.end_date);

          // Calculer les jours ouvrés entre les deux dates
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const workingDays = Math.round(diffDays * (22 / 30)); // Estimation des jours ouvrés

          monthlyCA += tjm * workingDays;
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
 * Récupère toutes les statistiques des missions en une seule fonction
 * @param period - Période en mois pour les statistiques (par défaut: 12 mois)
 */
export const getMissionStats = async (
  period: number = 12
): Promise<MissionStatData> => {
  try {
    await checkAuthRole();

    const [
      nombreMissions,
      dureeMoyenne,
      dureeMoyennePlacee,
      tauxMargeMoyen,
      caTotal,
      missionsParMetier,
    ] = await Promise.all([
      getTotalMissions(),
      getDureeMoyenneMissions(),
      getDureeMoyenneMissionsPlacees(),
      getTauxMargeMoyen(period),
      getCATotal(period),
      getMissionsParMetier(),
    ]);

    return {
      nombreMissions,
      dureeMoyenne,
      dureeMoyennePlacee,
      tauxMargeMoyen,
      caTotal,
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
      caTotal: 0,
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
