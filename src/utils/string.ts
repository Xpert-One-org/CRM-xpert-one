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
  const dateMinusDays = new Date(date);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - dateMinusDays.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    return `J-${diffDays}`;
  }

  return diffDays > 0 ? `J-${diffDays}` : 'Jour J';
};
