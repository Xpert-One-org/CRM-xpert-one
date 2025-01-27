'use client';
// components/mission/sections/MissionLocation.tsx
import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';
import CreatableSelect from '@/components/CreatableSelect';
import { useEffect, useState } from 'react';
import type { Country } from '@/types/types';
import { fetchCountries } from '@/utils/functions/fetchCountries';
import { getLabel } from '@/utils/getLabel';

export function MissionLocation() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  const [countries, setCountries] = useState<Country[]>([]);

  const getCountries = async () => {
    if (countries.length) return;
    const countriesSorted = await fetchCountries();
    const fr = countriesSorted.find(
      (country: any) => country.label === 'France'
    );
    const index = countriesSorted.findIndex(
      (country: any) => country.label === 'France'
    );
    countriesSorted.splice(index, 1);
    countriesSorted.unshift(fr);
    setCountries(countriesSorted);
  };

  useEffect(() => {
    getCountries();
  }, []);

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Lieu de la mission</h3>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-full max-w-[120px]"
          label="N° de rue"
          value={mission.address?.split(' ')[0] ?? ''}
          onChange={(e) => {
            const newAddress = mission.address?.replace(/^\S+\s*/, '') ?? '';
            handleUpdateField('address', `${e.target.value} ${newAddress}`);
          }}
        />
        <Input
          className="w-full max-w-[280px]"
          label="Adresse postale"
          value={mission.address?.split(' ').slice(1).join(' ') ?? ''}
          onChange={(e) => {
            const streetNumber = mission.address?.split(' ')[0] ?? '';
            handleUpdateField('address', `${streetNumber} ${e.target.value}`);
          }}
        />
        <Input
          className="w-[170px]"
          label="Ville"
          value={mission.city ?? ''}
          onChange={(e) => handleUpdateField('city', e.target.value)}
        />
        <Input
          className="w-full max-w-[120px]"
          label="Code postal"
          value={mission.postal_code ?? ''}
          onChange={(e) => handleUpdateField('postal_code', e.target.value)}
        />
        {countries.length > 0 && (
          <CreatableSelect
            label="Pays"
            className="w-fit"
            options={countries}
            defaultValue={{
              label:
                getLabel({
                  value: mission.country ?? '',
                  select: countries,
                }) ?? '',
              value: mission.country ?? '',
            }}
            onChange={(selectedOption) =>
              handleUpdateField('country', selectedOption.value)
            }
          />
        )}
      </div>
    </div>
  );
}
