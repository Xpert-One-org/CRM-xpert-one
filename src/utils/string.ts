export const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getYears = ({ data, max }: { data: number; max: number }) => {
  if (!data) return '';
  if (data >= max) return 'ans +';
  if (data > 1) return 'ans';
  if (data == 0) return '';
  return 'an';
};

export const getTimeBeforeMission = (date: string) => {
  const missionDate = new Date(date);
  const currentDate = new Date();

  // Vérifier si la mission est déjà passée
  if (missionDate == currentDate) {
    return 'Jour J';
  }

  if (missionDate < currentDate) {
    return 'Dépassé';
  }

  // Calculer la différence en jours
  const diffTime = missionDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    return `J-${diffDays}`;
  }

  return `J-${diffDays}`;
};
