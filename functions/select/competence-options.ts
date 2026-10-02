'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export type CompetenceOption = {
  kind: 'expertise' | 'specialty';
  value: string;
  label: string;
};

// Expertises/spécialités proposables pour des secteurs + métiers donnés (RPC
// get_competence_options) : valeurs historiques + celles rattachées aux métiers
// dans le référentiel « CRM métiers ». Absente des types générés, d'où le cast.
export const getCompetenceOptions = async (
  sectors: string[],
  jobTitles: string[]
) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await (supabase as any).rpc(
    'get_competence_options',
    { p_sectors: sectors, p_job_titles: jobTitles }
  );

  if (error) {
    console.error('Error fetching competence options:', error);
    return { data: null, error };
  }
  return { data: (data ?? []) as CompetenceOption[] };
};
