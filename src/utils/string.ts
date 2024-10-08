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
