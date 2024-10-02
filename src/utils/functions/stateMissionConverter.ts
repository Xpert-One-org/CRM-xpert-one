export const convertStateValue = (value: string) => {
  switch (value) {
    case 'in_review':
      return 'En validation par Xpert One';
    case 'open':
      return 'Ouverte';
    case 'in_progress':
      return 'En cours';
    case 'completed':
      return 'Terminée';
    case 'canceled':
      return 'Annulée';
    default:
      return value;
  }
};
