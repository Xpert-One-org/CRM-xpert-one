export const getValueConverted = ({ value }: { value: string | string[] }) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export const getLabelFromValue = (value?: boolean) => {
  if (value === true) return 'Oui';
  if (value === false) return 'Non';
  return value;
};

export const getLabelFromSelectValue = (
  value: string,
  mockedSelect: {
    id: number;
    label: string | null;
    value: string | null;
    json_key: string | null;
  }[]
) => {
  const selected = mockedSelect.find((item) => item.value === value);
  return selected ? selected.label : value;
};
