import type { Country } from '@/types/types';

export const getRegions = async () => {
  const response = await fetch(
    'https://geo.api.gouv.fr/regions?fields=nom,code,zone'
  );
  const data = await response.json();
  const regions = data.map((region: any, i: number) => {
    return {
      value: region.code,
      label: region.nom,
      zone: region.zone,
    };
  });
  const sortedRegions = regions.sort((a: Country, b: Country) =>
    a.label.localeCompare(b.label)
  );

  return { data: sortedRegions, error: null };
};
