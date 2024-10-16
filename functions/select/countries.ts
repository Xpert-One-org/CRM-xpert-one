import type { Country } from '@/types/types';
import { error } from 'console';

export const getCountries = async () => {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=translations,cca2'
  );
  const data = await response.json();
  const countries = data.map((country: any, i: number) => {
    return {
      value: country.cca2,
      label: country.translations.fra.common,
    };
  });
  const sortedCountries = countries.sort((a: Country, b: Country) =>
    a.label.localeCompare(b.label)
  );

  return { data: sortedCountries, error: null };
};
