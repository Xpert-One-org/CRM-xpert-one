import { FilterButton } from '@/components/FilterButton';
import { signUpDateOptions } from '@/data/constant';
import React from 'react';

export default function XpertFilter() {
  return (
    <>
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Date d'inscription"
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Nom"
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Prénom"
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Poste"
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="N° identification"
      />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Disponible le"
      />
      <FilterButton placeholder="Fiche détaillée" filter={true} />
    </>
  );
}
