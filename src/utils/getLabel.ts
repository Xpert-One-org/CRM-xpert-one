// "Humanise" une valeur technique (slug) en texte lisible :
// remplace les underscores par des espaces et met une majuscule initiale.
// Sert de filet de sécurité pour ne JAMAIS afficher de valeur brute avec des "_".
const humanize = (value: string): string => {
  if (!value) return value;
  const s = value.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

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

  // Si trouvé dans la liste -> son label ; sinon -> version humanisée (pas d'underscore).
  return selected?.label ? selected.label : humanize(value);
};
