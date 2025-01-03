'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
import FournisseurRow from './FournisseurRow';
import { areObjectsEqual, cn } from '@/lib/utils';
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
import Button from '@/components/Button';
import FournisseurRedirectButtons from './FournisseurRedirectButtons';
import DeleteFournisseurDialog from './DeleteFournisseurDialog';
import { useWarnIfUnsavedChanges } from '@/hooks/useLeavePageConfirm';
import type { DBFournisseur } from '@/types/typesDb';

export default function FournisseurTable() {
  const [fournisseurIdOpened, setFournisseurIdOpened] = useState('');
  const [hasChanged, setHasChanged] = useState(false);

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

  const {
    fournisseurs,
    openedFournisseur,
    openedFournisseurNotSaved,
    fetchFournisseurs,
    fetchSpecificFournisseur,
    totalFournisseurs,
    handleSaveUpdatedFournisseur,
    setOpenedFournisseurNotSaved,
    setKeyDBProfileChanged,
    setKeyDBProfileStatusChanged,
    keyDBProfileChanged,
    keyDBProfileStatusChanged,
  } = useFournisseurStore();

  const searchParams = useSearchParams();

  useWarnIfUnsavedChanges(
    !areObjectsEqual(openedFournisseur, openedFournisseurNotSaved)
  );

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

  useEffect(() => {
    setHasChanged(
      !areObjectsEqual(openedFournisseur, openedFournisseurNotSaved)
    );
  }, [openedFournisseurNotSaved, openedFournisseur]);

  type FournisseurTableKey = 'profile' | 'profile_status';

  const handleKeyChanges = (table: FournisseurTableKey, name: string) => {
    if (table === 'profile_status') {
      const prevKeys = keyDBProfileStatusChanged;
      const newKeys = prevKeys.includes(name as any)
        ? prevKeys
        : [...prevKeys, name as any];
      setKeyDBProfileStatusChanged(newKeys);
    } else {
      const prevKeys = keyDBProfileChanged;
      const newKeys = prevKeys.includes(name as any)
        ? prevKeys
        : [...prevKeys, name as any];
      setKeyDBProfileChanged(newKeys);
    }
  };

  const handleFournisseurIdOpened = async (id: string) => {
    if (id === fournisseurIdOpened) {
      setFournisseurIdOpened('0');
      setOpenedFournisseurNotSaved(null);
    } else {
      setFournisseurIdOpened(id);
      await fetchSpecificFournisseur(id);
    }
  };

  const handleInputChange = (
    name: keyof DBFournisseur,
    value: string | string[] | null | boolean
  ) => {
    if (openedFournisseurNotSaved) {
      setOpenedFournisseurNotSaved({
        ...openedFournisseurNotSaved,
        [name]: value,
      });
      handleKeyChanges('profile', name);
    }
  };
  return (
    <>
      <div className="mb-2 flex w-fit items-center justify-between gap-2">
        <CreateFournisseurXpertDialog role="company" />
        {fournisseurIdOpened !== '' && fournisseurIdOpened !== '0' && (
          <Button
            className="size-fit disabled:bg-gray-200"
            onClick={handleSaveUpdatedFournisseur}
            disabled={!hasChanged}
          >
            Enregistrer
          </Button>
        )}
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
                      value={openedFournisseurNotSaved?.firstname ?? ''}
                      onChange={(e) =>
                        handleInputChange('firstname', e.target.value)
                      }
                      disabled={!openedFournisseurNotSaved}
                    />
                    <Input
                      label="Adresse mail professionnel"
                      value={openedFournisseurNotSaved?.email ?? empty}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      disabled={!openedFournisseurNotSaved}
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
                    value={openedFournisseurNotSaved?.company_name ?? empty}
                    onChange={(e) =>
                      handleInputChange('company_name', e.target.value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  <SelectComponent
                    label="Votre fonction"
                    defaultSelectedKeys={
                      openedFournisseurNotSaved?.company_role ?? ''
                    }
                    options={companyRoles}
                    onValueChange={(value) =>
                      handleInputChange('company_role', value)
                    }
                    name="company_role"
                    disabled={!openedFournisseurNotSaved}
                  />

                  {openedFournisseurNotSaved?.company_role_other && (
                    <TextArea
                      label="Détails de votre fonction"
                      value={openedFournisseurNotSaved.company_role_other}
                      onChange={(e) =>
                        handleInputChange('company_role_other', e.target.value)
                      }
                      disabled={!openedFournisseurNotSaved}
                    />
                  )}

                  <SelectComponent
                    className="xl:max-w-full"
                    defaultSelectedKeys={
                      openedFournisseurNotSaved?.sector ?? empty
                    }
                    options={sectors}
                    label={profileDataExperience.sector?.label}
                    name="sector"
                    onValueChange={(value) =>
                      handleInputChange('sector', value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  {/* Secteur et autres champs conditionnels similaires... */}

                  <MultiSelectComponent
                    disabled={!openedFournisseurNotSaved}
                    label="Zone de couverture géographique"
                    defaultSelectedKeys={[
                      ...(openedFournisseurNotSaved?.area ?? []),
                      ...(openedFournisseurNotSaved?.france_detail ?? []),
                      ...(openedFournisseurNotSaved?.regions ?? []),
                    ]}
                    options={[...areaSelect, ...franceSelect, ...regions]}
                    name="area"
                    onValueChange={(value) => handleInputChange('area', value)}
                  />

                  <Input
                    label="De quel service dépendez vous"
                    value={
                      openedFournisseurNotSaved?.service_dependance ?? empty
                    }
                    onChange={(e) =>
                      handleInputChange('service_dependance', e.target.value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  <Input
                    label="Votre numéro de SIRET"
                    value={openedFournisseurNotSaved?.siret ?? ''}
                    onChange={(e) => handleInputChange('siret', e.target.value)}
                    disabled={!openedFournisseurNotSaved}
                  />
                </div>

                <SelectComponent
                  label="Civilité"
                  defaultSelectedKeys={
                    openedFournisseurNotSaved?.civility ?? ''
                  }
                  options={genres}
                  onValueChange={(value) =>
                    handleInputChange('civility', value)
                  }
                  name="civility"
                  disabled={!openedFournisseurNotSaved}
                />

                <div className="grid w-full grid-cols-2 gap-4">
                  <Input
                    label="Nom"
                    value={openedFournisseurNotSaved?.lastname ?? ''}
                    onChange={(e) =>
                      handleInputChange('lastname', e.target.value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  <Input
                    label="Prénom"
                    value={openedFournisseurNotSaved?.firstname ?? ''}
                    onChange={(e) =>
                      handleInputChange('firstname', e.target.value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  <PhoneInputComponent
                    label="Tél portable"
                    name="mobile"
                    placeholder={empty}
                    value={openedFournisseurNotSaved?.mobile ?? ''}
                    defaultSelectedKeys={
                      openedFournisseurNotSaved?.mobile ?? ''
                    }
                    onValueChange={(value) =>
                      handleInputChange('mobile', value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  <PhoneInputComponent
                    label="Tél fixe"
                    name="fix"
                    placeholder={empty}
                    value={openedFournisseurNotSaved?.fix ?? ''}
                    defaultSelectedKeys={openedFournisseurNotSaved?.fix ?? ''}
                    onValueChange={(value) => handleInputChange('fix', value)}
                    disabled={!openedFournisseurNotSaved}
                  />

                  <Input
                    label="N° de rue"
                    value={openedFournisseurNotSaved?.street_number ?? ''}
                    onChange={(e) =>
                      handleInputChange('street_number', e.target.value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  <Input
                    label="Addresse postale"
                    value={openedFournisseurNotSaved?.address ?? ''}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    disabled={!openedFournisseurNotSaved}
                  />

                  <Input
                    label="Ville"
                    value={openedFournisseurNotSaved?.city ?? ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!openedFournisseurNotSaved}
                  />

                  <SelectComponent
                    label="Pays"
                    defaultSelectedKeys={
                      openedFournisseurNotSaved?.country ?? ''
                    }
                    options={countries}
                    onValueChange={(value) =>
                      handleInputChange('country', value)
                    }
                    name="country"
                    disabled={!openedFournisseurNotSaved}
                  />
                </div>
              </div>
            </div>

            <div
              className={cn(
                'col-span-4 hidden max-h-0 w-full flex-col justify-between gap-2 overflow-hidden rounded-lg rounded-b-xs transition-all',
                {
                  'flex max-h-full':
                    fournisseurIdOpened === fournisseur.generated_id,
                }
              )}
            >
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

              {/* Boutons de contrôle */}
              <div className="flex w-full justify-between gap-2 py-2">
                <FournisseurRedirectButtons user={fournisseur} />
                <div className="flex gap-x-4">
                  <Button
                    className="size-fit disabled:bg-gray-200"
                    onClick={handleSaveUpdatedFournisseur}
                    disabled={!hasChanged}
                  >
                    Enregistrer
                  </Button>
                  <DeleteFournisseurDialog
                    fournisseurId={fournisseur.id}
                    fournisseurGeneratedId={fournisseur.generated_id}
                  />
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Infinite scroll */}
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
