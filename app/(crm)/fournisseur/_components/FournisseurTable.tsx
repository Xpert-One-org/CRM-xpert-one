'use client';

import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect, useMemo } from 'react';
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
  companyRoleSelect,
  energyRenewableSelect,
  energySelect,
  franceSelect,
  genres,
  sectorSelect,
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
import { FournisseurNotes } from './FournisseurNotes';
import CreatableSelect from '@/components/CreatableSelect';
import MultiCreatableSelect from '@/components/MultiCreatableSelect';
import { Checkbox } from '@/components/ui/checkbox';
import {
  sortAlphaOptions,
  sortDateOptions,
  sortNumberOptions,
} from '@/data/filter';
import { Search } from 'lucide-react';

type SortKey =
  | 'created_at'
  | 'lastname'
  | 'firstname'
  | 'company_role'
  | 'generated_id'
  | 'company_name'
  | 'mission';

export default function FournisseurTable() {
  const [fournisseurIdOpened, setFournisseurIdOpened] = useState('');
  const [hasChanged, setHasChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    order: 'asc' | 'desc';
  } | null>(null);

  const { regions, countries, fetchRegions, fetchCountries } = useSelect();

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
    fetchRegions();
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
      setOpenedFournisseurNotSaved(null);
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

  const handleSortChange = (key: SortKey) => (value: string) => {
    setSortConfig(
      value === '' ? null : { key, order: value as 'asc' | 'desc' }
    );
  };

  const getSortValue = (fournisseur: DBFournisseur, key: SortKey) => {
    if (key === 'mission') return fournisseur.mission?.length ?? 0;
    if (key === 'created_at') return new Date(fournisseur.created_at).getTime();
    return fournisseur[key as keyof DBFournisseur] ?? '';
  };

  // Recherche texte + tri appliqués sur la liste complète chargée côté client
  const displayFournisseurs = useMemo(() => {
    let list = [...(fournisseurs || [])];

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((fournisseur) =>
        [
          fournisseur.firstname,
          fournisseur.lastname,
          fournisseur.company_name,
          fournisseur.generated_id,
          fournisseur.company_role,
          fournisseur.email,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    if (sortConfig) {
      const { key, order } = sortConfig;
      list.sort((a, b) => {
        const valueA = getSortValue(a, key);
        const valueB = getSortValue(b, key);

        let comparison: number;
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          comparison = valueA - valueB;
        } else {
          comparison = String(valueA)
            .toLowerCase()
            .localeCompare(String(valueB).toLowerCase());
        }
        return order === 'asc' ? comparison : -comparison;
      });
    }

    return list;
  }, [fournisseurs, searchQuery, sortConfig]);

  return (
    <>
      <div className="mb-2 flex w-full flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
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
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un fournisseur (nom, société, ID...)"
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-8 gap-3">
        <FilterButton
          options={sortDateOptions}
          onValueChange={handleSortChange('created_at')}
          placeholder="Date d'inscription"
          showSelectedOption={true}
        />
        <FilterButton
          options={sortAlphaOptions}
          onValueChange={handleSortChange('lastname')}
          placeholder="Nom"
          showSelectedOption={true}
        />
        <FilterButton
          options={sortAlphaOptions}
          onValueChange={handleSortChange('firstname')}
          placeholder="Prénom"
          showSelectedOption={true}
        />
        <FilterButton
          options={sortAlphaOptions}
          onValueChange={handleSortChange('company_role')}
          placeholder="Poste"
          showSelectedOption={true}
        />
        <FilterButton
          options={sortAlphaOptions}
          onValueChange={handleSortChange('generated_id')}
          placeholder="N° identification"
          showSelectedOption={true}
        />
        <FilterButton
          options={sortAlphaOptions}
          onValueChange={handleSortChange('company_name')}
          placeholder="Société"
          showSelectedOption={true}
        />
        <FilterButton
          options={sortNumberOptions}
          onValueChange={handleSortChange('mission')}
          placeholder="Nombre de missions"
          showSelectedOption={true}
        />
        <FilterButton
          className="font-bold"
          placeholder="Fiche détaillée"
          filter={false}
        />

        {displayFournisseurs?.map((fournisseur) => (
          <React.Fragment key={fournisseur.id}>
            <FournisseurRow
              fournisseur={fournisseur}
              isOpen={fournisseurIdOpened === fournisseur.generated_id}
              onClick={() =>
                handleFournisseurIdOpened(fournisseur.generated_id)
              }
            />
            {fournisseurIdOpened === fournisseur.generated_id && (
              <>
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
                          value={
                            openedFournisseurNotSaved?.referent
                              ? `${openedFournisseurNotSaved.referent.firstname || ''} ${openedFournisseurNotSaved.referent.lastname || ''}`
                              : 'Non assigné'
                          }
                          disabled={true}
                        />
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={
                              openedFournisseurNotSaved?.allow_documents_notifications
                            }
                            onCheckedChange={(check) =>
                              handleInputChange(
                                'allow_documents_notifications',
                                check
                              )
                            }
                          />
                          <label className="whitespace-nowrap text-sm font-medium">
                            Si décoché, le fournisseur ne recevra pas les
                            notifications
                          </label>
                        </div>
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

                      <CreatableSelect
                        creatable
                        label="Votre fonction"
                        defaultValue={{
                          label:
                            getLabel({
                              value:
                                openedFournisseurNotSaved?.company_role ?? '',
                              select: companyRoleSelect,
                            }) ?? '',
                          value: openedFournisseurNotSaved?.company_role ?? '',
                        }}
                        options={
                          openedFournisseurNotSaved?.company_role_other
                            ? [
                                ...companyRoleSelect,
                                {
                                  label:
                                    openedFournisseurNotSaved?.company_role_other,
                                  value:
                                    openedFournisseurNotSaved?.company_role_other,
                                },
                              ]
                            : companyRoleSelect
                        }
                        optionsOther={
                          openedFournisseurNotSaved?.company_role_other
                        }
                        onChange={(e) =>
                          handleInputChange('company_role', e.value)
                        }
                        name="company_role"
                      />

                      <CreatableSelect
                        className="xl:max-w-full"
                        defaultValue={{
                          label:
                            getLabel({
                              value: openedFournisseurNotSaved?.sector ?? '',
                              select: sectorSelect,
                            }) ?? '',
                          value: openedFournisseurNotSaved?.sector ?? '',
                        }}
                        options={
                          openedFournisseurNotSaved?.sector_other
                            ? [
                                ...sectorSelect,
                                {
                                  label:
                                    openedFournisseurNotSaved?.sector_other,
                                  value:
                                    openedFournisseurNotSaved?.sector_other,
                                },
                              ]
                            : sectorSelect
                        }
                        optionsOther={openedFournisseurNotSaved?.sector_other}
                        label={profileDataExperience.sector?.label}
                        name="sector"
                        onChange={(e) => handleInputChange('sector', e.value)}
                      />

                      <MultiCreatableSelect
                        label="Zone de couverture géographique"
                        defaultValue={openedFournisseurNotSaved?.area?.map(
                          (area) => ({
                            label:
                              getLabel({ value: area, select: areaSelect }) ??
                              '',
                            value: area,
                          })
                        )}
                        options={areaSelect}
                        name="area"
                        onChange={(selectedOption) => {
                          const values = selectedOption.map(
                            (option) => option.value
                          );
                          handleInputChange('area', values);
                        }}
                      />

                      <MultiCreatableSelect
                        label="Zone géographique précise"
                        defaultValue={openedFournisseurNotSaved?.france_detail?.map(
                          (fr) => ({
                            label:
                              getLabel({ value: fr, select: franceSelect }) ??
                              '',
                            value: fr,
                          })
                        )}
                        options={franceSelect}
                        onChange={(selectedOption) => {
                          const values = selectedOption.map(
                            (option) => option.value
                          );
                          handleInputChange('france_detail', values);
                        }}
                      />

                      <MultiCreatableSelect
                        label="Région"
                        defaultValue={openedFournisseurNotSaved?.regions?.map(
                          (region) => ({
                            label:
                              getLabel({ value: region, select: regions }) ??
                              '',
                            value: region,
                          })
                        )}
                        options={regions as { label: string; value: string }[]}
                        onChange={(selectedOption) => {
                          const values = selectedOption.map(
                            (option) => option.value
                          );
                          handleInputChange('regions', values);
                        }}
                      />

                      <Input
                        label="De quel service dépendez vous"
                        value={
                          openedFournisseurNotSaved?.service_dependance ?? empty
                        }
                        onChange={(e) =>
                          handleInputChange(
                            'service_dependance',
                            e.target.value
                          )
                        }
                        disabled={!openedFournisseurNotSaved}
                      />

                      <Input
                        label="Votre numéro de SIRET"
                        value={openedFournisseurNotSaved?.siret ?? ''}
                        onChange={(e) =>
                          handleInputChange('siret', e.target.value)
                        }
                        disabled={!openedFournisseurNotSaved}
                      />
                    </div>

                    <CreatableSelect
                      label={'Civilité'}
                      options={genres}
                      defaultValue={{
                        label:
                          getLabel({
                            value: openedFournisseurNotSaved?.civility ?? '',
                            select: genres,
                          }) ?? '',
                        value: openedFournisseurNotSaved?.civility ?? '',
                      }}
                      onChange={(e) => handleInputChange('civility', e.value)}
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
                        defaultSelectedKeys={
                          openedFournisseurNotSaved?.fix ?? ''
                        }
                        onValueChange={(value) =>
                          handleInputChange('fix', value)
                        }
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
                        onChange={(e) =>
                          handleInputChange('city', e.target.value)
                        }
                        disabled={!openedFournisseurNotSaved}
                      />
                      <Input
                        label="Code postal"
                        value={openedFournisseurNotSaved?.postal_code ?? ''}
                        onChange={(e) =>
                          handleInputChange('postal_code', e.target.value)
                        }
                        disabled={!openedFournisseurNotSaved}
                      />

                      <CreatableSelect
                        label={'Pays'}
                        options={countries.map((country) => ({
                          label: country.label!,
                          value: country.value!,
                        }))}
                        defaultValue={{
                          label:
                            getLabel({
                              value: openedFournisseurNotSaved?.country ?? '',
                              select: countries,
                            }) ?? '',
                          value: openedFournisseurNotSaved?.country ?? '',
                        }}
                        onChange={(e) => handleInputChange('country', e.value)}
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
                  {fournisseurIdOpened === fournisseur.generated_id && (
                    <FournisseurNotes fournisseurId={fournisseur.id} />
                  )}
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
                        fournisseurEmail={fournisseur.email}
                        fournisseurFirstName={fournisseur.firstname}
                        fournisseurLastName={fournisseur.lastname}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
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
