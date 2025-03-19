'use client';

import React, { useState, useEffect } from 'react';
import type { CountryData } from './WorldMapChart';
import WorldMapChart from './WorldMapChart';
import { Skeleton } from '@/components/ui/skeleton';
import { getXpertsCountryDistribution } from '../functions/xperts.stats.action';
import countries from 'i18n-iso-countries';
import frLocale from 'i18n-iso-countries/langs/fr.json';

type CountryDistributionProps = {
  className?: string;
};

countries.registerLocale(frLocale);

const getCountryName = (countryCode: string): string => {
  if (!countryCode || countryCode === 'NULL' || countryCode === 'EMPTY') {
    return 'Non spécifié';
  }

  try {
    const countryName = countries.getName(countryCode, 'fr');

    return countryName || countryCode;
  } catch (error) {
    return countryCode;
  }
};

const getUniqueCountriesCount = (data: CountryData[]): number => {
  const uniqueCountries = new Set();
  data.forEach((item) => {
    if (item.country && item.country !== 'NULL' && item.country !== 'EMPTY') {
      uniqueCountries.add(item.country);
    }
  });
  return uniqueCountries.size;
};

const getTotalXperts = (data: CountryData[]): number => {
  return data.reduce((sum, item) => {
    if (item.country && item.country !== 'NULL' && item.country !== 'EMPTY') {
      return sum + item.count;
    }
    return sum;
  }, 0);
};

const getPrincipalCountry = (data: CountryData[]): string => {
  const countriesWithData = data.filter(
    (item) =>
      item.country && item.country !== 'NULL' && item.country !== 'EMPTY'
  );

  if (countriesWithData.length === 0) return 'Aucun';

  const principalCountry = countriesWithData.reduce(
    (max, item) => (item.count > max.count ? item : max),
    countriesWithData[0]
  );

  return getCountryName(principalCountry.country);
};

const XpertsCountryDistribution = ({ className }: CountryDistributionProps) => {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryDistribution = async () => {
      try {
        setLoading(true);
        const countryData = await getXpertsCountryDistribution();
        setData(countryData);
        setError(null);
      } catch (err) {
        console.error(
          'Erreur lors de la récupération de la distribution par pays:',
          err
        );
        setError(
          err instanceof Error ? err.message : 'Une erreur est survenue'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDistribution();
  }, []);

  if (loading) {
    return (
      <div className={`flex flex-col space-y-4 ${className}`}>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col space-y-4 ${className}`}>
        <h2 className="text-xl font-semibold">
          Distribution des Xperts par pays
        </h2>
        <div className="rounded-md bg-red-50 p-4 text-red-800">
          <p>Erreur: {error}</p>
          <p>Impossible de charger la distribution par pays</p>
        </div>
      </div>
    );
  }

  // Créer un résumé des pays avec le plus d'Xperts
  const topCountries = [...data]
    .filter(
      (country) => country.country !== 'NULL' && country.country !== 'EMPTY'
    )
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      <div className="h-[500px] w-full overflow-hidden rounded-lg border border-gray-200">
        <WorldMapChart data={data} className="size-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-md bg-gray-50 p-4 shadow-sm">
          <h3 className="mb-4 border-b pb-2 text-lg font-medium">
            Principaux pays
          </h3>
          <ul className="space-y-3">
            {topCountries.map((country) => (
              <li
                key={country.country}
                className="flex items-center justify-between"
              >
                <span className="font-medium">
                  {getCountryName(country.country)}
                </span>
                <span className="rounded-md bg-gray-200 px-2 py-1 text-gray-700">
                  {country.count} Xpert{country.count > 1 ? 's' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md bg-gray-50 p-4 shadow-sm">
          <h3 className="mb-4 border-b pb-2 text-lg font-medium">
            Statistiques
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <span className="font-medium">Nombre total de pays</span>
              <span className="rounded-md bg-gray-200 px-2 py-1 text-gray-700">
                {getUniqueCountriesCount(data)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-medium">Xperts avec pays défini</span>
              <span className="rounded-md bg-gray-200 px-2 py-1 text-gray-700">
                {getTotalXperts(data)}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-medium">Pays principal</span>
              <span className="rounded-md bg-gray-200 px-2 py-1 text-gray-700">
                {getPrincipalCountry(data)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default XpertsCountryDistribution;
