import { FilterButton } from '@/components/FilterButton';
import React from 'react';

export default function MissionEtatToValidateTable() {
  const signUpDateOptions = [
    { label: 'Toutes', value: '' },
    { label: '1 semaine', value: '1_week' },
    { label: '2 semaines', value: '2_weeks' },
    { label: '3 semaines', value: '3_weeks' },
    { label: '4 semaines', value: '4_weeks' },
  ];

  return (
    <div className="grid grid-cols-8 gap-3">
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Créer le"
      />
      <FilterButton placeholder="N° de fournisseur" filter={false} />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton
        options={signUpDateOptions}
        defaultSelectedKeys=""
        onValueChange={() => {}}
        placeholder="Référent Xpert One"
        filter={false}
      />
      <FilterButton placeholder="Temps avant début de mission" filter={false} />
      <FilterButton placeholder="Poste" filter={false} />
      <FilterButton placeholder="Ouverte à tous" filter={false} />
      <FilterButton placeholder="Valider la mission ?" filter={false} />
    </div>
  );
}
