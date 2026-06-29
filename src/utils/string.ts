export const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Normalise une chaîne pour la recherche : minuscules + suppression des
 * accents/diacritiques. Permet des recherches insensibles aux accents
 * (ex. "jerome" trouve "Jérôme", et inversement).
 */
export const normalizeSearch = (str: string | null | undefined): string => {
  return (str ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

// Groupes de variantes accentuées par lettre de base.
const ACCENT_GROUPS: Record<string, string> = {
  a: 'aàáâãäå',
  c: 'cç',
  e: 'eéèêë',
  i: 'iíìîï',
  n: 'nñ',
  o: 'oóòôõö',
  u: 'uúùûü',
  y: 'yýÿ',
};

const REGEX_SPECIAL = /[.*+?^${}()|[\]\\]/;

/**
 * Construit un motif regex POSIX (pour l'opérateur `imatch` de PostgREST)
 * qui matche un texte sans tenir compte des accents (dans les deux sens).
 * Ex. "jerome" -> "j[eéèêë]r[oóòôõö]m[eéèêë]".
 * Retourne '' si l'entrée est vide (à ne pas appliquer dans ce cas).
 */
export const buildAccentInsensitivePattern = (
  input: string | null | undefined
): string => {
  const normalized = normalizeSearch(input);
  if (!normalized) return '';
  return Array.from(normalized)
    .map((ch) => {
      if (ACCENT_GROUPS[ch]) return `[${ACCENT_GROUPS[ch]}]`;
      if (REGEX_SPECIAL.test(ch)) return `\\${ch}`;
      return ch;
    })
    .join('');
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
