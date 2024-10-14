'use client';

import { FilterButton } from '@/components/FilterButton';
import type { DBFournisseur } from '@/types/typesDb';
import React, { useState, useEffect } from 'react';
import FournisseurRow from './FournisseurRow';
import { cn } from '@/lib/utils';
import FournisseurMissionTable from './FournisseurMissionRow';
import Input from '@/components/inputs/Input';

export default function FournisseurTable({
  fournisseurs,
}: {
  fournisseurs: DBFournisseur[];
}) {
  const signUpDateOptions = [
    { label: 'Toutes', value: '' },
    { label: '1 semaine', value: '1_week' },
    { label: '2 semaines', value: '2_weeks' },
    { label: '3 semaines', value: '3_weeks' },
    { label: '4 semaines', value: '4_weeks' },
  ];

  const [fournisseurIdOpened, setFournisseurIdOpened] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fournisseurId = urlParams.get('id');
    if (fournisseurId) {
      setFournisseurIdOpened(fournisseurId);
    }
  }, []);

  const handleFournisseurIdOpened = (id: string) => {
    setFournisseurIdOpened((prevId) =>
      prevId === id.toString() ? '0' : id.toString()
    );
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* <Button className="py-spaceXSmall pl-spaceContainer text-white">
          Créer un fournisseur
        </Button> */}
        {/* {fournisseurIdOpened !== '' && fournisseurIdOpened !== '0' && (
          <Button className="py-spaceXSmall pl-spaceContainer text-white">
            Enregistrer
          </Button>
        )} */}
      </div>

      <div className="grid grid-cols-8 gap-3">
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
          placeholder="Société"
        />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Nombre de missions"
        />
        <FilterButton placeholder="Fiche détaillée" filter={false} />

        {fournisseurs.map((fournisseur) => (
          <>
            <FournisseurRow
              key={fournisseur.id}
              fournisseur={fournisseur}
              isOpen={fournisseurIdOpened === fournisseur.id}
              onClick={() => handleFournisseurIdOpened(fournisseur.id)}
            />
            <div
              className={cn(
                'col-span-4 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                { 'block max-h-full': fournisseurIdOpened === fournisseur.id }
              )}
            >
              <div className="flex flex-col gap-y-spaceXSmall p-spaceSmall">
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="flex flex-col gap-y-spaceXSmall">
                    <Input
                      label="Référant XPERT ONE"
                      value={`${fournisseur.firstname}`}
                    />
                    <Input
                      label="Adresse mail professionnel"
                      value={fournisseur.email ?? ''}
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <div className="mr-7 flex aspect-square h-[120px] items-center justify-center rounded-full bg-primary text-white">
                      Photo profil
                    </div>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Nom de votre société"
                    value={fournisseur.company_name ?? ''}
                  />
                  <Input
                    label="Votre fonction"
                    value={fournisseur.city ?? ''}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Votre secteur d’activité"
                    value={fournisseur.sector ?? ''}
                  />
                  <Input
                    label="Zone de couverture géographique"
                    value={'Votre zone de couverture géographique'}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="De quel service dépendez vous"
                    value={'Votre service'}
                  />
                  <Input
                    label="Votre numéro de SIRET"
                    value={fournisseur.siret ?? ''}
                  />
                </div>
                <Input label="Civilité" value={fournisseur.civility ?? ''} />
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input label="Nom" value={fournisseur.lastname ?? ''} />
                  <Input label="Prénom" value={fournisseur.firstname ?? ''} />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Tél portable"
                    value={fournisseur.mobile ?? ''}
                  />
                  <Input label="Tél fixe" value={fournisseur.fix ?? ''} />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="N° de rue"
                    value={fournisseur.street_number ?? ''}
                  />
                  <Input
                    label="Addresse postale"
                    value={fournisseur.address ?? ''}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input label="Ville" value={fournisseur.city ?? ''} />
                  <Input label="Pays" value={fournisseur.country ?? ''} />
                </div>
              </div>
            </div>
            <div
              className={cn(
                'col-span-4 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                { 'block max-h-full': fournisseurIdOpened === fournisseur.id }
              )}
            >
              <div className="grid grid-cols-4 gap-3 p-[14px]">
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
                />
                <FilterButton
                  options={signUpDateOptions}
                  defaultSelectedKeys=""
                  onValueChange={() => {}}
                  placeholder="Intitulé de poste"
                />
                <FilterButton
                  options={signUpDateOptions}
                  defaultSelectedKeys=""
                  onValueChange={() => {}}
                  placeholder="État de la mission"
                />
                {fournisseur.mission.length > 0 ? (
                  <>
                    {fournisseur.mission.map((mission) => (
                      <FournisseurMissionTable
                        key={mission.id}
                        mission={mission}
                      />
                    ))}
                  </>
                ) : (
                  <div className="col-span-4 flex items-center justify-center">
                    <p className="text-gray-secondary text-center text-sm">
                      Aucune mission
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}
