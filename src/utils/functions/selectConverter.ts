export const convertValueToLabel = (
  value: string | string[] | null,
  select: {
    label: string | null;
    value: string | null;
    json_key?: string | null;
    id?: number;
    image?: string | null;
  }[],
  other_value?: string | null
) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const selected = select.find((selectItem) => selectItem.value === item);
        return selected?.label ?? item;
      })
      .join(', ');
  }
  const selected = select.find((item) => item.value === value);
  if (value === 'others' || value === 'other') {
    return other_value ?? 'Autre';
  }
  return selected?.label ?? value;
};
