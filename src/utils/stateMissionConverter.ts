import type { DBMission } from '@/types/typesDb';

export const convertStateValue = (value: DBMission['state']) => {
  switch (value) {
    case 'to_validate':
      return 'EN VALIDATION PAR XPERT ONE';
    case 'open_all_to_validate':
      return 'OUVERTE À TOUS ET EN VALIDATION PAR XPERT ONE';
    case 'open':
      return 'OUVERTE';
    case 'open_all':
      return 'OUVERTE À TOUS';
    case 'in_progress':
      return 'EN COURS';
    case 'deleted':
      return 'SUPPRIMÉE';
    case 'finished':
      return 'TERMINÉE';
    default:
      return value;
  }
};
