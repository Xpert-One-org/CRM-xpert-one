import { FilterButton } from '@/components/FilterButton';
import { signUpDateOptions } from '@/data/constant';
import React from 'react';

export default function XpertMissionFilter() {
  return (
    <>
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="Date de début/fin"
      />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="N° de mission"
        filter={false}
      />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="Titre"
        filter={false}
      />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="Situation"
      />
      <FilterButton
        options={signUpDateOptions}
        onValueChange={() => {}}
        placeholder="TJM XPERT GD inclus"
        filter={false}
      />
    </>
  );
}
