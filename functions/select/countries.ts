import type { Country } from '@/types/types';

export const getCountries = async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=translations,cca2,flags'
  );
  const data = await response.json();
  const countries = data.map((country: any, i: number) => {
    return {
      value: country.cca2,
      label: country.translations.fra.common,
      flag: country.flags.svg,
    };
  });
  const sortedCountries = countries.sort((a: Country, b: Country) =>
    a.label.localeCompare(b.label)
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
