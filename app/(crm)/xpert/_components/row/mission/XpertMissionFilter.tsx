import { FilterButton } from '@/components/FilterButton';
import React from 'react';

export default function XpertMissionFilter() {
  return (
    <>
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Date de début/fin"
      />
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="N° de mission"
        filter={false}
      />
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Titre"
        filter={false}
      />
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="Situation"
      />
      <FilterButton
        options={[]}
        onValueChange={() => {}}
        placeholder="TJM XPERT GD inclus"
        filter={false}
      />
    </>
  );
}
