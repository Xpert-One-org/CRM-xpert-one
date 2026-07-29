import type { DBProfileMission } from '@/types/typesDb';
import { normalizeSearch } from '@/utils/string';

/**
 * Un intitulé de poste "matche" un xpert s'il figure dans ses intitulés
 * sélectionnés (job_titles) OU s'il correspond à sa saisie libre "Autre"
 * (job_titles_other) — comparaison insensible à la casse et aux accents.
 * Ainsi le matching regarde bien "les deux cases" (retour client).
 */
export const xpertHasJobTitle = (
  mission:
    | Pick<DBProfileMission, 'job_titles' | 'job_titles_other'>
    | null
    | undefined,
  title: string | null | undefined
): boolean => {
  if (!mission || !title) return false;
  if (mission.job_titles?.includes(title)) return true;
  if (
    mission.job_titles_other &&
    normalizeSearch(mission.job_titles_other) === normalizeSearch(title)
  ) {
    return true;
  }
  return false;
};
