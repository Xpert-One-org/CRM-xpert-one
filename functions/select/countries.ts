import type { Country } from '@/types/types';
import { COUNTRY_CODES } from '@/data/countryCodes';

export const getCountries = async () => {
  // La liste est construite localement (codes ISO figés + noms FR via
  // Intl.DisplayNames + drapeaux flagcdn) pour ne plus dépendre de l'API
  // externe restcountries, désormais dépréciée.
  const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' });

  const countries = COUNTRY_CODES.map((code) => {
    let label = code;
    try {
      label = regionNames.of(code) ?? code;
    } catch {
      label = code;
    }
    return {
      value: code,
      label,
      flag: `https://flagcdn.com/${code.toLowerCase()}.svg`,
    };
  }).filter((country) => country.label !== country.value); // exclut les codes sans nom FR

  const sortedCountries = countries.sort((a: Country, b: Country) =>
    a.label.localeCompare(b.label, 'fr')
  );

  return { data: sortedCountries, error: null };
};

export const getRegions = async () => {
  const response = await fetch('https://geo.api.gouv.fr/regions');
  const data = await response.json();
  const regions = data.map((region: any) => {
    return {
      value: region.code,
      label: region.nom,
    };
  });
  const sortedRegions = regions.sort((a: any, b: any) =>
    a.label.localeCompare(b.label)
  );

  return { data: sortedRegions, error: null };
};
