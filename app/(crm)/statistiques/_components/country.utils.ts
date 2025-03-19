import countries from 'i18n-iso-countries';
import frLocale from 'i18n-iso-countries/langs/fr.json';

// Initialiser la bibliothèque avec les locales françaises
countries.registerLocale(frLocale);

/**
 * Convertit un code ISO de pays en nom complet localisé en français
 * @param countryCode Code ISO-2 du pays (ex: 'FR', 'US', etc.)
 * @returns Nom complet du pays en français ou le code original si non trouvé
 */
export const getCountryName = (countryCode: string): string => {
  try {
    if (!countryCode || countryCode === 'NULL' || countryCode === 'EMPTY') {
      return 'Non spécifié';
    }

    const countryName = countries.getName(countryCode, 'fr');
    return countryName || countryCode;
  } catch (error) {
    return countryCode;
  }
};

/**
 * Prépare les données de pays pour l'affichage sur la carte
 * @param data Tableau de données brutes avec pays et compteurs
 * @returns Objet avec codes pays comme clés et compteurs comme valeurs
 */
export const prepareCountryData = (
  data: { country: string; count: number }[]
): Record<string, number> => {
  return data.reduce(
    (acc, { country, count }) => {
      if (!country || country === 'NULL' || country === 'EMPTY') {
        return acc;
      }
      acc[country] = (acc[country] || 0) + count;
      return acc;
    },
    {} as Record<string, number>
  );
};
