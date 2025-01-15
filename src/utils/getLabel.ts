export const getLabel = ({
  value,
  select,
}: {
  value: string;
  select: { value: string | null; label: string | null }[];
}) => {
  if (value === 'false') {
    return 'Non';
  }
  if (value === 'true') {
    return 'Oui';
  }

  const selected = select.find((item) => item.value === value);

  return selected ? selected.label : value;
};
