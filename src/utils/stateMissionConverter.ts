export const convertStateValue = (value: string) => {
  switch (value) {
    case 'to_validate':
      return 'EN VALIDATION PAR XPERT ONE';
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
