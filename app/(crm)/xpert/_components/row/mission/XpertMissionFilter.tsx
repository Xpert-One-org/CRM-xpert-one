import { FilterButton } from '@/components/FilterButton';
import { signUpDateOptions } from '@/data/constant';
import React from 'react';

export default function XpertMissionFilter() {
  return (
    <>
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Date de début/fin"
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="N° de mission"
        filter={false}
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Titre"
        filter={false}
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Situation"
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="TJM XPERT GD inclus"
        filter={false}
      />
    </>
  );
}
