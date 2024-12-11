'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
import FournisseurRow from './FournisseurRow';
import { cn } from '@/lib/utils';
import FournisseurMissionTable from './FournisseurMissionRow';
import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';
import { getLabel } from '@/utils/getLabel';
import { useSelect } from '@/store/select';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import {
  areaSelect,
  energyRenewableSelect,
  energySelect,
  franceSelect,
  genres,
  wasteTreatmentSelect,
} from '@/data/mocked_select';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';
import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFournisseurStore } from '@/store/fournisseur';
import InfiniteScroll from '@/components/ui/infinite-scroll';
import Loader from '@/components/Loader';
import { profileDataExperience } from '@/data/profile';
import SelectComponent from '@/components/inputs/SelectComponent';
import TextArea from '@/components/inputs/TextArea';
import CreateFournisseurXpertDialog from '@/components/dialogs/CreateXpertDialog';

export default function FournisseurTable() {
  const [fournisseurIdOpened, setFournisseurIdOpened] = useState('');
  const {
    sectors,
    companyRoles,
    regions,
    countries,
    infrastructures,
    fetchSectors,
    fetchCompanyRoles,
    fetchRegions,
    fetchCountries,
    fetchInfrastructures,
  } = useSelect();
  const searchParams = useSearchParams();
  const {
    fournisseurs,
    fetchFournisseurs,
    fetchSpecificFournisseur,
    totalFournisseurs,
  } = useFournisseurStore();

  const hasMore =
    fournisseurs && totalFournisseurs
      ? fournisseurs.length < totalFournisseurs
      : true;

  useEffect(() => {
    fetchSectors();
    fetchCompanyRoles();
    fetchRegions();
    fetchInfrastructures();
    fetchCountries();
    const fournisseurId = searchParams.get('id');
    if (fournisseurId) {
      fetchSpecificFournisseur(fournisseurId);
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
        {/* <CreateFournisseurXpertDialog role="company" /> */}
        {/* {fournisseurIdOpened !== '' && fournisseurIdOpened !== '0' && (
          <Button className="py-XSmall pl-spaceContainer text-white">
            Enregistrer
          </Button>
        )} */}
      </div>

      <div className="grid grid-cols-8 gap-3">
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Date d'inscription"
        />
        <FilterButton options={[]} onValueChange={() => {}} placeholder="Nom" />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Prénom"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Poste"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="N° identification"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Société"
        />
        <FilterButton
          options={[]}
          onValueChange={() => {}}
          placeholder="Nombre de missions"
        />
        <FilterButton
          className="font-bold"
          placeholder="Fiche détaillée"
          filter={false}
        />

        {fournisseurs?.map((fournisseur) => (
          <React.Fragment key={fournisseur.id}>
            <FournisseurRow
              fournisseur={fournisseur}
              isOpen={fournisseurIdOpened === fournisseur.generated_id}
              onClick={() =>
                handleFournisseurIdOpened(fournisseur.generated_id)
              }
            />
            <div
              className={cn(
                'col-span-4 hidden h-full max-h-0 w-full overflow-hidden rounded-lg rounded-b-xs bg-[#D0DDE1] shadow-container transition-all md:bg-background',
                {
                  'block max-h-full':
                    fournisseurIdOpened === fournisseur.generated_id,
                }
              )}
            >
              <div className="flex flex-col gap-y-spaceXSmall p-spaceSmall">
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
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
                  {fournisseur.company_role_other && (
                    <TextArea
                      label="Détails de votre fonction"
                      value={
                        getLabel({
                          value: fournisseur.company_role_other ?? '',
                          select: companyRoles,
                        }) ?? empty
                      }
                      disabled
                    />
                  )}

                  <SelectComponent
                    className="xpertise_input xl:max-w-full"
                    defaultSelectedKeys={fournisseur.sector ?? empty}
                    placeholder={fournisseur.sector ?? 'Choisir'}
                    options={sectors}
                    label={profileDataExperience.sector?.label}
                    name={profileDataExperience.sector?.name as string}
                    onValueChange={() => ({})}
                    disabled={true}
                  />
                  {fournisseur.sector === 'others' && (
                    <Input
                      // key={`index_${experience.post_other}`}
                      name={profileDataExperience.sector_other?.name}
                      label={profileDataExperience.sector_other?.label}
                      className="xpertise_input flex-1 sm:min-w-[280px] xl:max-w-full"
                      disabled
                      defaultValue={fournisseur.sector_other ?? empty}
                      placeholder="Précisez votre secteur d'activité"
                      onChange={() => ({})}
                    />
                  )}

                  {fournisseur.sector == 'energy' && (
                    <SelectComponent
                      className="xpertise_input xl:max-w-full"
                      defaultSelectedKeys={fournisseur.sector_energy ?? empty}
                      placeholder="Choisir"
                      disabled
                      options={energySelect}
                      label={profileDataExperience.sector_energy?.label}
                      name={profileDataExperience.sector_energy?.name as string}
                      onValueChange={() => ({})}
                    />
                  )}

                  {fournisseur.sector == 'renewable_energy' && (
                    <SelectComponent
                      className="xpertise_input xl:max-w-full"
                      defaultSelectedKeys={
                        fournisseur.sector_renewable_energy ?? empty
                      }
                      placeholder="Choisir"
                      disabled
                      options={energyRenewableSelect}
                      label={
                        profileDataExperience.sector_renewable_energy?.label
                      }
                      name={
                        profileDataExperience.sector_renewable_energy
                          ?.name as string
                      }
                      onValueChange={() => ({})}
                    />
                  )}

                  {fournisseur.sector_renewable_energy === 'other' && (
                    <Input
                      name={
                        profileDataExperience.sector_renewable_energy_other
                          ?.name
                      }
                      label={
                        profileDataExperience.sector_renewable_energy_other
                          ?.label
                      }
                      className="xpertise_input flex-1 sm:min-w-[280px] xl:max-w-full"
                      disabled
                      defaultValue={
                        fournisseur.sector_renewable_energy_other ?? empty
                      }
                      placeholder="Précisez votre énergie renouvelable"
                      onChange={() => ({})}
                    />
                  )}

                  {fournisseur.sector == 'waste_treatment' && (
                    <SelectComponent
                      className="xpertise_input xl:max-w-full"
                      disabled
                      defaultSelectedKeys={
                        fournisseur.sector_waste_treatment ?? empty
                      }
                      placeholder="Choisir"
                      options={wasteTreatmentSelect}
                      label={
                        profileDataExperience.sector_waste_treatment?.label
                      }
                      name={
                        profileDataExperience.sector_waste_treatment
                          ?.name as string
                      }
                      onValueChange={() => ({})}
                    />
                  )}

                  {fournisseur.sector == 'infrastructure' && (
                    <SelectComponent
                      className="xpertise_input xl:max-w-full"
                      defaultSelectedKeys={
                        fournisseur.sector_infrastructure ?? empty
                      }
                      placeholder={
                        fournisseur.sector_infrastructure ?? 'Choisir'
                      }
                      options={infrastructures}
                      label={profileDataExperience.sector_infrastructure?.label}
                      name={
                        profileDataExperience.sector_infrastructure
                          ?.name as string
                      }
                      onValueChange={() => ({})}
                      disabled
                    />
                  )}
                  {fournisseur.sector_infrastructure === 'other' && (
                    <Input
                      name={
                        profileDataExperience.sector_infrastructure_other?.name
                      }
                      label={
                        profileDataExperience.sector_infrastructure_other?.label
                      }
                      className="xpertise_input flex-1 sm:min-w-[280px] xl:max-w-full"
                      disabled
                      defaultValue={
                        fournisseur.sector_infrastructure_other ?? empty
                      }
                      placeholder="Précisez votre infrastructure"
                      onChange={() => ({})}
                    />
                  )}
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

                  <Input
                    label="De quel service dépendez vous"
                    value={fournisseur.service_dependance ?? empty}
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

                  <PhoneInputComponent
                    label="Tél portable"
                    name=""
                    placeholder={empty}
                    value={fournisseur.mobile ?? ''}
                    defaultSelectedKeys={fournisseur.mobile ?? ''}
                    disabled
                  />
                  <PhoneInputComponent
                    label="Tél fixe"
                    name=""
                    placeholder={empty}
                    value={fournisseur.fix ?? ''}
                    defaultSelectedKeys={fournisseur.fix ?? ''}
                    disabled
                  />

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
                {
                  'block max-h-full':
                    fournisseurIdOpened === fournisseur.generated_id,
                }
              )}
            >
              <div className="grid grid-cols-4 gap-3 p-[14px]">
                <FilterButton
                  options={[]}
                  onValueChange={() => {}}
                  placeholder="Date de début/fin"
                />
                <FilterButton
                  options={[]}
                  onValueChange={() => {}}
                  placeholder="N° de mission"
                />
                <FilterButton
                  options={[]}
                  onValueChange={() => {}}
                  placeholder="Intitulé de poste"
                />
                <FilterButton
                  options={[]}
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
          </React.Fragment>
        ))}
      </div>
      <InfiniteScroll
        hasMore={hasMore}
        next={fetchFournisseurs}
        isLoading={false}
      >
        {hasMore && (
          <div className="mt-4 flex w-full items-center justify-center">
            <Loader />
          </div>
        )}
      </InfiniteScroll>
    </>
  );
}
