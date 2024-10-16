'use client';

import { FilterButton } from '@/components/FilterButton';
import type { DBFournisseur } from '@/types/typesDb';
import React, { useState, useEffect } from 'react';
import FournisseurRow from './FournisseurRow';
import { cn } from '@/lib/utils';
import FournisseurMissionTable from './FournisseurMissionRow';
import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';
import { getLabel } from '@/utils/getLabel';
import { useSelect } from '@/store/select';
import MultiSelectComponent from '@/components/inputs/MultiSelectComponent';
import {
  areaSelect,
  franceSelect,
  genres,
  iamSelect,
} from '@/data/mocked_select';
import { PhoneInput } from '@/components/ui/phone-input';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';
import { useParams, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const {
    sectors,
    companyRoles,
    regions,
    countries,
    fetchSectors,
    fetchCompanyRoles,
    fetchRegions,
    fetchCountries,
  } = useSelect();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchSectors();
    fetchCompanyRoles();
    fetchRegions();
    fetchCountries();
    const fournisseurId = searchParams.get('id');
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
                      disabled
                    />
                    <Input
                      label="Adresse mail professionnel"
                      value={fournisseur.email ?? empty}
                      disabled
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <Avatar className="aspect-square size-[120px]">
                      <AvatarImage src={fournisseur.avatar_url ?? ''} />
                      <AvatarFallback className="bg-primary text-xl uppercase text-white">
                        {fournisseur.firstname?.substring(0, 1)}
                        {fournisseur.lastname?.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Nom de votre société"
                    value={fournisseur.company_name ?? empty}
                    disabled
                  />
                  <Input
                    label="Votre fonction"
                    value={
                      getLabel({
                        value: fournisseur.company_role ?? '',
                        select: companyRoles,
                      }) ?? empty
                    }
                    disabled
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Votre secteur d’activité"
                    value={
                      getLabel({
                        value: fournisseur.sector ?? '',
                        select: sectors,
                      }) ?? empty
                    }
                    disabled
                  />
                  <MultiSelectComponent
                    disabled
                    label="Zone de couverture géographique"
                    defaultSelectedKeys={[
                      ...(fournisseur.area ?? []),
                      ...(fournisseur.france_detail ?? []),
                      ...(fournisseur.regions ?? []),
                    ]}
                    options={[...areaSelect, ...franceSelect, ...regions]}
                    name=""
                    onValueChange={() => ({})}
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="De quel service dépendez vous"
                    value={'Votre service'}
                    disabled
                  />
                  <Input
                    label="Votre numéro de SIRET"
                    value={fournisseur.siret ?? ''}
                    disabled
                  />
                </div>
                <Input
                  label="Civilité"
                  value={
                    getLabel({
                      value: fournisseur.civility ?? '',
                      select: genres,
                    }) ?? empty
                  }
                  disabled
                />
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Nom"
                    value={fournisseur.lastname ?? ''}
                    disabled
                  />
                  <Input
                    label="Prénom"
                    value={fournisseur.firstname ?? ''}
                    disabled
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <PhoneInputComponent
                    label="Tél portable"
                    name=""
                    placeholder={empty}
                    className="xl:max-w-full"
                    value={fournisseur.mobile ?? ''}
                    defaultSelectedKeys={fournisseur.mobile ?? ''}
                    disabled
                  />
                  <PhoneInputComponent
                    label="Tél fixe"
                    name=""
                    className="xl:max-w-full"
                    placeholder={empty}
                    value={fournisseur.fix ?? ''}
                    defaultSelectedKeys={fournisseur.fix ?? ''}
                    disabled
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="N° de rue"
                    value={fournisseur.street_number ?? ''}
                    disabled
                  />
                  <Input
                    label="Addresse postale"
                    value={fournisseur.address ?? ''}
                    disabled
                  />
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Ville"
                    value={fournisseur.city ?? ''}
                    disabled
                  />
                  <Input
                    label="Pays"
                    value={
                      getLabel({
                        value: fournisseur.country ?? '',
                        select: countries,
                      }) ?? empty
                    }
                    disabled
                  />
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
