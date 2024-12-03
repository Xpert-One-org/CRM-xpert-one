'use client';
import { Combobox } from '@/components/combobox/Combobox';
import Info from '@/components/Info';
import Input from '@/components/inputs/Input';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';
import TextArea from '@/components/inputs/TextArea';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import SelectComponent from '@/components/SelectComponent';
import Separator from '@/components/Separator';
import {
  booleanSelect,
  energyRenewableSelect,
  energySelect,
  postTypesSelect,
  profilSearchedSelect,
  wasteTreatmentSelect,
} from '@/data/mocked_select';
import { cn } from '@/lib/utils';
import type { Country, UserType } from '@/types/types';
import type { DBMission } from '@/types/typesDb';
import { fetchCountries } from '@/utils/functions/fetchCountries';
import React, { useEffect, useState } from 'react';
import { emptyMission } from '@/data/empty_array';
import { toast } from 'sonner';
import { creationMissionData } from '@/data/mission';
import { useRouter } from 'next/navigation';
import { insertMission } from '@functions/missions';
import { useField } from '@/hooks/useField';
import { useSelect } from '@/store/select';
import { deepEqual } from '@/utils/deepEqual';
import { useWarnIfUnsavedChanges } from '@/hooks/useLeavePageConfirm';
import InformativePopup from '@/components/InformativePopup';
import Button from '@/components/Button';
import { FilterButton } from '@/components/FilterButton';
import { Box } from '@/components/ui/box';
import ComboboxFournisseur from '@/components/combobox/ComboboxFournisseur';

export default function Page() {
  const [mission, setMission] = useState<DBMission>(emptyMission);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isSavingLoading, setIsSavingLoading] = useState(false);
  const {
    post_type,
    job_title,
    profile_searched,
    sector,
    country,
    sector_energy,
    sector_other,
    sector_infrastructure,
    sector_renewable_energy,
    sector_waste_treatment,
    specialties,
    expertises,
    languages,
    diplomas,
    job_title_other,
    specialties_other,
    diplomas_other,
    expertises_other,
    languages_other,
  } = mission;

  const router = useRouter();

  const [isCompleted, setIsCompleted] = useState(false);
  const [isValidated, setIsValidated] = useState(mission.state === 'open');
  const [openAllToValidate, setOpenAllToValidate] = useState(
    mission.state === 'open_all_to_validate'
  );
  const { checkIfRequiredAndNotMissing, prepareData, setIsInitialized } =
    useField({ user: mission, page: 'creation_mission' });

  const {
    diplomas: diplomasSelect,
    expertises: expertisesSelect,
    infrastructures: infrastructuresSelect,
    jobTitles: jobTitlesSelect,
    languages: languagesSelect,
    sectors: sectorsSelect,
    specialities: specialtiesSelect,
    loadingDiplomas,
    loadingExpertises,
    loadingInfrastructures,
    loadingJobTitles,
    loadingLanguages,
    loadingSectors,
    loadingSpecialties,
    fetchDiplomas,
    fetchExpertises,
    fetchInfrastructures,
    fetchJobTitles,
    fetchLanguages,
    fetchSectors,
    fetchSpecialties,
    addDiploma,
    addExpertise,
    addJobTitle,
    addSpecialty,
    addLanguage,
    addSector,
  } = useSelect();

  const openAllToValidateOptions = [
    { label: 'OUI', value: 'open_all_to_validate' },
    { label: 'NON', value: 'to_validate' },
  ];

  const toValidateOptions = [
    { label: 'OUI', value: 'open' },
    { label: 'NON', value: 'refused' },
    { label: 'En cours de traitement', value: 'in_process' },
  ];

  const [validationState, setValidationState] = useState<string>('in_process');

  const handleValidationChange = (value: string) => {
    setValidationState(value);
    const newIsValidated = value === 'open';
    setIsValidated(newIsValidated);
  };

  const handleOpenAllValidationChange = (value: string) => {
    const newIsValidated = value === 'open_all_to_validate';
    setOpenAllToValidate(newIsValidated);
  };

  const handleChangeSelect = (value: string | string[], name: string) => {
    if (name == 'infrastructure' && value != 'other' && value != 'others') {
      setMission({
        ...mission,
        sector_infrastructure: value as string,
        sector_infrastructure_other: null,
      });
      return;
    }

    if (name == 'sector' && value != 'others' && value != 'other') {
      if (value !== 'infrastructure' && value !== 'renewable_energy') {
        setMission({
          ...mission,
          sector: value as string,
          sector_infrastructure: null,
          sector_infrastructure_other: null,
          sector_renewable_energy: null,
          sector_renewable_energy_other: null,
        });
        return;
      }
      if (value === 'infrastructure') {
        setMission({
          ...mission,
          sector: value as string,
          sector_renewable_energy: null,
          sector_renewable_energy_other: null,
        });

        return;
      }
      if (value === 'renewable_energy') {
        setMission({
          ...mission,
          sector: value as string,
          sector_infrastructure: null,
          sector_infrastructure_other: null,
        });

        return;
      }
      setMission({ ...mission, sector: value, sector_infrastructure: null });
      return;
    }

    setMission({ ...mission, [name]: value });
  };

  // WARN IF UNSAVED CHANGES
  useWarnIfUnsavedChanges(
    !deepEqual({ obj1: mission, obj2DB: emptyMission }) && !isCompleted
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const getValue = () => {
      if (e.target.value === 'true') return true;
      if (e.target.value === 'false') return false;
      if (e.target.value === '') return null;
      return e.target.value;
    };
    const value = getValue();

    setMission({ ...mission, [e.target.name]: value });
  };

  const handleValueChange = (value: string, name: string) => {
    setMission({ ...mission, [name]: value });
  };

  const getCountries = async () => {
    if (countries.length) return;
    const countriesSorted = await fetchCountries();
    const fr = countriesSorted.find(
      (country: any) => country.label === 'France'
    );
    const index = countriesSorted.findIndex(
      (country: any) => country.label === 'France'
    );
    countriesSorted.splice(index, 1);
    countriesSorted.unshift(fr);
    setCountries(countriesSorted);
  };

  const handleSave = async () => {
    setIsSavingLoading(true);
    setIsInitialized(true);

    const { elementMissings, usedDataJson, customError } = prepareData({
      profileData: creationMissionData,
    });

    let missionState = 'to_validate';
    if (openAllToValidate && !isValidated) {
      missionState = 'open_all_to_validate';
    } else if (isValidated && !openAllToValidate) {
      missionState = 'open';
    } else if (isValidated && openAllToValidate) {
      missionState = 'open_all';
    } else if (validationState === 'in_process') {
      missionState = 'in_process';
    }

    const missionData = {
      ...usedDataJson,
      state: missionState,
    };

    if (elementMissings.length) {
      toast.error(
        `Veuillez remplir tous les champs obligatoires : ${elementMissings.map((el) => el.label).join(', ')}`,
        {
          closeButton: true,
          dismissible: true,
          duration: 5000,
        }
      );
      setIsSavingLoading(false);
      setIsCompleted(false);
      return;
    } else if (customError) {
      toast.error(customError, {
        closeButton: true,
        dismissible: true,
      });
      setIsSavingLoading(false);
      setIsCompleted(false);
    } else {
      const { error } = await insertMission({
        mission: missionData,
      });
      if (error) {
        console.error(error);

        toast.error('Erreur lors de la sauvegarde de votre profil');
        setIsSavingLoading(false);
        setIsInitialized(true);
      }
      setIsCompleted(true);

      if (diplomas?.includes('other')) {
        addDiploma({
          label: diplomas_other,
          value: diplomas_other,
          id: 0,
          json_key: `${diplomas_other}-option`,
        });
      }

      if (expertises?.includes('other')) {
        addExpertise({
          label: expertises_other,
          value: expertises_other,
          id: 0,
          json_key: `${expertises_other}-option`,
        });
      }

      if (job_title == 'other') {
        addJobTitle({
          label: job_title_other,
          value: job_title_other,
          id: 0,
          json_key: `${job_title_other}-option`,
          image: null,
        });
      }

      if (specialties?.includes('others')) {
        addSpecialty({
          label: specialties_other,
          value: specialties_other,
          id: 0,
          json_key: `${specialties_other}-option`,
        });
      }

      if (languages?.includes('other')) {
        addLanguage({
          label: languages_other,
          value: languages_other,
          id: 0,
          json_key: `${languages_other}-option`,
        });
      }

      if (sector == 'others') {
        addSector({
          label: sector_other,
          value: sector_other,
          id: 0,
          json_key: `${sector_other}-option`,
        });
      }

      toast.dismiss();
      toast.success('Votre mission va être étudiée par notre équipe');
    }
  };

  // useEffect(() => {
  //   const missionWithoutNotRequired = deleteUnusedFields(mission);
  //   const isCompleted = Object.values(missionWithoutNotRequired).every(
  //     (value) => value !== null
  //   );

  //   setIsCompleted(isCompleted);
  // }, [mission]);

  useEffect(() => {
    getCountries();
    fetchSectors();
    fetchJobTitles();
    fetchSpecialties();
    fetchExpertises();
    fetchDiplomas();
    fetchLanguages();
    fetchInfrastructures();
  }, []);

  useEffect(() => {
    if (isCompleted) {
      router.push('/mission/etats?etat=in_process');
    }
  }, [isCompleted]);

  return (
    <div className="flex flex-col gap-y-spaceSmall px-spaceContainer pt-spaceContainer md:px-0">
      <InformativePopup />
      <p className={cn('text-lg font-medium')}>Informations de mission</p>

      {/* Line 1 */}
      <div className="flex w-full flex-wrap gap-x-spaceContainer gap-y-spaceSmall">
        <SelectComponent
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.profile_searched?.name as keyof UserType
          )}
          className="xl:max-w-[165px]"
          classNameLabel="h-spaceContainer"
          label={creationMissionData.profile_searched?.label}
          options={profilSearchedSelect}
          defaultSelectedKeys={
            loadingJobTitles ? null : (profile_searched ?? '')
          }
          name={creationMissionData.profile_searched?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
          disabled={loadingJobTitles}
        />

        <Combobox
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.job_title?.name as keyof UserType
          )}
          label={creationMissionData.job_title?.label}
          options={jobTitlesSelect}
          defaultSelectedKeys={loadingJobTitles ? null : (job_title ?? '')}
          name={creationMissionData.job_title?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
        />

        {job_title == 'other' && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.job_title_other?.name as keyof UserType
            )}
            label={creationMissionData.job_title_other?.label}
            name={creationMissionData.job_title_other?.name ?? ''}
            placeholder="Préciser votre intitulé de mission"
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}

        <MultiSelectComponent
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.post_type?.name as keyof UserType
          )}
          label={creationMissionData.post_type?.label}
          options={postTypesSelect}
          placeholder={'Type de poste'}
          defaultSelectedKeys={post_type ?? []}
          name={creationMissionData.post_type?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
        />

        <Combobox
          label={creationMissionData.sector?.label}
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.sector?.name as keyof UserType
          )}
          options={sectorsSelect}
          placeholder={loadingSectors ? 'Chargement...' : 'Choisir'}
          defaultSelectedKeys={loadingSectors ? null : (sector ?? '')}
          name={creationMissionData.sector?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
        />

        {sector == 'energy' && (
          <SelectComponent
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector_energy?.name as keyof UserType
            )}
            className="xpertise_input"
            defaultSelectedKeys={sector_energy ?? ''}
            placeholder="Choisir"
            options={energySelect}
            label={creationMissionData.sector_energy?.label}
            name={creationMissionData.sector_energy?.name ?? ''}
            required
            onValueChange={handleChangeSelect}
          />
        )}

        {sector == 'others' && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector_other?.name as keyof UserType
            )}
            label={creationMissionData.sector_other?.label}
            name={creationMissionData.sector_other?.name ?? ''}
            placeholder="Préciser vos autres secteurs d'activités"
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}

        {sector == 'renewable_energy' && (
          <SelectComponent
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector_renewable_energy
                ?.name as keyof UserType
            )}
            className="xpertise_input"
            defaultSelectedKeys={sector_renewable_energy ?? ''}
            placeholder="Choisir"
            options={energyRenewableSelect}
            label={creationMissionData.sector_renewable_energy?.label}
            name={creationMissionData.sector_renewable_energy?.name ?? ''}
            required
            onValueChange={handleChangeSelect}
          />
        )}

        {(sector_renewable_energy == 'others' ||
          sector_renewable_energy == 'other') && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector_renewable_energy_other
                ?.name as keyof UserType
            )}
            label={creationMissionData.sector_renewable_energy_other?.label}
            name={creationMissionData.sector_renewable_energy_other?.name}
            placeholder="Préciser votre énergie renouvelable"
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}

        {sector == 'waste_treatment' && (
          <SelectComponent
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector_waste_treatment?.name as keyof UserType
            )}
            className="xpertise_input"
            defaultSelectedKeys={sector_waste_treatment ?? ''}
            placeholder="Choisir"
            options={wasteTreatmentSelect}
            label={creationMissionData.sector_waste_treatment?.label}
            name={creationMissionData.sector_waste_treatment?.name ?? ''}
            required
            onValueChange={handleChangeSelect}
          />
        )}

        {sector == 'infrastructure' && (
          <SelectComponent
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector_infrastructure?.name as keyof UserType
            )}
            className="xpertise_input"
            defaultSelectedKeys={
              loadingInfrastructures ? null : (sector_infrastructure ?? '')
            }
            placeholder={loadingInfrastructures ? 'Chargement...' : 'Choisir'}
            options={infrastructuresSelect}
            label={creationMissionData.sector_infrastructure?.label}
            name={creationMissionData.sector_infrastructure?.name ?? ''}
            required
            onValueChange={handleChangeSelect}
            disabled={loadingInfrastructures}
          />
        )}
        {(sector_infrastructure == 'others' ||
          sector_infrastructure == 'other') && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector_infrastructure_other
                ?.name as keyof UserType
            )}
            label={creationMissionData.sector_infrastructure_other?.label}
            name={creationMissionData.sector_infrastructure_other?.name}
            placeholder="Préciser votre infrastructure"
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}

        <MultiSelectComponent
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.specialties?.name as keyof UserType
          )}
          label={creationMissionData.specialties?.label}
          options={specialtiesSelect}
          placeholder={loadingSpecialties ? 'Chargement...' : 'Spécialités'}
          defaultSelectedKeys={loadingSpecialties ? null : (specialties ?? [])}
          name={creationMissionData.specialties?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
          disabled={loadingSpecialties}
        />

        {specialties?.includes('others') && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.specialties_other?.name as keyof UserType
            )}
            label={creationMissionData.specialties_other?.label}
            name={creationMissionData.specialties_other?.name}
            placeholder="Préciser la spécialité"
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}

        <MultiSelectComponent
          label={creationMissionData.expertises?.label}
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.expertises?.name as keyof UserType
          )}
          options={expertisesSelect}
          placeholder={loadingExpertises ? 'Chargement...' : 'Expertise'}
          defaultSelectedKeys={loadingExpertises ? null : (expertises ?? [])}
          name={creationMissionData.expertises?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
          disabled={loadingExpertises}
        />

        {expertises?.includes('others') && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.expertises_other?.name as keyof UserType
            )}
            label={creationMissionData.expertises_other?.label}
            name={creationMissionData.expertises_other?.name ?? ''}
            placeholder="Préciser l'expertise"
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}

        <MultiSelectComponent
          label={creationMissionData.diplomas?.label}
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.diplomas?.name as keyof UserType
          )}
          options={diplomasSelect}
          placeholder={loadingDiplomas ? 'Chargement...' : 'Diplômes'}
          defaultSelectedKeys={loadingDiplomas ? null : (diplomas ?? [])}
          name={creationMissionData.diplomas?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
          disabled={loadingDiplomas}
        />

        {diplomas?.includes('other') && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.diplomas_other?.name as keyof UserType
            )}
            label={creationMissionData.diplomas_other?.label}
            name={creationMissionData.diplomas_other?.name}
            placeholder={creationMissionData.diplomas_other?.label}
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}
        <MultiSelectComponent
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.languages?.name as keyof UserType
          )}
          label={creationMissionData.languages?.label}
          placeholder={loadingLanguages ? 'Chargement...' : 'Langues parlées'}
          options={languagesSelect}
          defaultSelectedKeys={loadingLanguages ? null : (languages ?? [])}
          name={creationMissionData.languages?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
          disabled={loadingLanguages}
        />

        {languages?.includes('other') && (
          <Input
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.languages_other?.name as keyof UserType
            )}
            label={creationMissionData.languages_other?.label}
            name={creationMissionData.languages_other?.name}
            placeholder={creationMissionData.languages_other?.label}
            className="mission_input min-w-[200px] flex-1 xl:max-w-full"
            onChange={handleChange}
          />
        )}

        <Input
          label={creationMissionData.tjm?.label}
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.tjm?.name as keyof UserType
          )}
          explain={'Votre TJM doit inclure la notion de grands déplacements'}
          sideEplain="top"
          placeholder="TJM Max"
          name={creationMissionData.tjm?.name}
          required
          onChange={handleChange}
        />

        <SelectComponent
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.open_to_disabled?.name as keyof UserType
          )}
          label={creationMissionData.open_to_disabled?.label}
          options={booleanSelect}
          defaultSelectedKeys=""
          className="xl:max-w-[340px]"
          name={creationMissionData.open_to_disabled?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
        />
      </div>
      <div className="flex w-full flex-wrap gap-x-spaceContainer gap-y-spaceSmall">
        <Input
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.start_date?.name as keyof UserType
          )}
          label={creationMissionData.start_date?.label}
          type="date"
          placeholder="Date de début de mission"
          name={creationMissionData.start_date?.name}
          required
          onChange={handleChange}
        />

        <Input
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.end_date?.name as keyof UserType
          )}
          label={creationMissionData.end_date?.label}
          type="date"
          placeholder="Date de fin de mission"
          name={creationMissionData.end_date?.name}
          required
          onChange={handleChange}
        />

        <Input
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.deadline_application?.name as keyof UserType
          )}
          label={creationMissionData.deadline_application?.label}
          type="date"
          placeholder="Date de fin de mission"
          name={creationMissionData.deadline_application?.name}
          required
          onChange={handleChange}
        />
      </div>

      <Separator className="my-spaceSmall" />

      <p className={cn('text-lg font-medium')}>Lieu de la mission</p>
      <div className="flex w-full flex-wrap gap-x-spaceContainer gap-y-spaceSmall">
        <Input
          name={creationMissionData.street_number?.name}
          label={creationMissionData.street_number?.label}
          defaultValue={''}
          placeholder="32 bis"
          className="w-fit xl:max-w-[103px]"
          onChange={handleChange}
        />

        <Input
          name={creationMissionData.address?.name}
          label={creationMissionData.address?.label}
          defaultValue={''}
          placeholder="Adresse postale"
          onChange={handleChange}
        />

        <Input
          name={creationMissionData.city?.name}
          label={creationMissionData.city?.label}
          defaultValue={''}
          placeholder="Paris ( 16e )"
          onChange={handleChange}
        />

        <Input
          name={creationMissionData.postal_code?.name}
          label={creationMissionData.postal_code?.label}
          defaultValue={''}
          className="max-w-[103px]"
          placeholder="75016"
          onChange={handleChange}
        />

        <Combobox
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.country?.name as keyof UserType
          )}
          options={countries}
          defaultSelectedKeys={country ?? ''}
          label={creationMissionData.country?.label}
          name={creationMissionData.country?.name ?? ''}
          required
          onValueChange={handleChangeSelect}
        />
      </div>

      {/* Line 1 */}
      <Separator className="my-spaceSmall" />

      <p className={cn('text-lg font-medium')}>Descriptif de la mission</p>

      <div className="flex w-full flex-wrap gap-x-spaceContainer gap-y-spaceSmall">
        <TextArea
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.needed?.name as keyof UserType
          )}
          rows={1}
          placeholder="Description du besoin"
          label={creationMissionData.needed?.label}
          name={creationMissionData.needed?.name}
          required
          defaultValue={''}
          onChange={handleChange}
        />

        <TextArea
          rows={1}
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.description?.name as keyof UserType
          )}
          placeholder="Descriptif du poste"
          label={creationMissionData.description?.label}
          name={creationMissionData.description?.name}
          required
          defaultValue={''}
          onChange={handleChange}
        />

        <TextArea
          rows={1}
          placeholder="Les + de votre entreprise"
          explain="Expliquez ici comment votre Enterprise accueil le freelance (avantages)"
          sideEplain="top"
          label={creationMissionData.advantages_company?.label}
          name={creationMissionData.advantages_company?.name}
          defaultValue={''}
          onChange={handleChange}
        />
      </div>
      <Separator className="my-spaceSmall" />

      <p className={cn('flex gap-x-2 text-lg font-medium')}>
        Référent de mission{' '}
        <span className="flex items-center gap-x-1 whitespace-nowrap font-bold">
          <Info side="right">
            <p>
              Indiquez ici les informations de la personne qui sera en charge de
              l’accueil de votre Xpert
            </p>
          </Info>
        </span>{' '}
      </p>

      <div className="grid grid-cols-4 gap-4">
        <Input
          name={creationMissionData.referent_name?.name}
          label={creationMissionData.referent_name?.label}
          placeholder="Nom"
          defaultValue={''}
          onChange={handleChange}
          classNameLabel="h-[24px]"
        />
        <PhoneInputComponent
          defaultSelectedKeys={'FR'}
          placeholder="Tel"
          label={creationMissionData.referent_mobile?.label}
          className="text-black"
          name={creationMissionData.referent_mobile?.name ?? ''}
          onValueChange={handleValueChange}
        />
        <PhoneInputComponent
          defaultSelectedKeys={'FR'}
          placeholder="Tel"
          label={creationMissionData.referent_fix?.label}
          className="text-black"
          name={creationMissionData.referent_fix?.name ?? ''}
          onValueChange={handleValueChange}
        />
        <Input
          name={creationMissionData.referent_mail?.name ?? ''}
          type="email"
          label={creationMissionData.referent_mail?.label}
          defaultValue={''}
          placeholder="Adresse mail"
          onChange={handleChange}
          classNameLabel="h-[24px]"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <ComboboxFournisseur
          name={creationMissionData.supplier?.name ?? ''}
          required
          label={creationMissionData.supplier?.label ?? ''}
          onChange={handleChange}
          hasError={checkIfRequiredAndNotMissing(
            creationMissionData.supplier?.name as keyof UserType
          )}
        />
      </div>

      <div className="flex w-full flex-wrap">
        <div className="grid grid-cols-2 gap-3">
          <FilterButton placeholder="Ouverte à tous" filter={false} />
          <FilterButton placeholder="Valider la mission ?" filter={false} />
          <Box
            className="col-span-1"
            isSelectable
            options={openAllToValidateOptions}
            onValueChange={handleOpenAllValidationChange}
          >
            {openAllToValidate ? 'OUI' : 'NON'}
          </Box>
          <Box
            className={`col-span-1 ${
              validationState === 'open'
                ? 'bg-[#92C6B0]'
                : validationState === 'in_process'
                  ? 'bg-[#67b6c1]'
                  : 'bg-[#D64242]'
            } text-white`}
            isSelectable
            options={toValidateOptions}
            onValueChange={handleValidationChange}
          >
            {validationState === 'open'
              ? 'OUI'
              : validationState === 'in_process'
                ? 'En cours de traitement'
                : 'NON'}
          </Box>
        </div>
      </div>
      <Button
        onClick={handleSave}
        hover={'only_brightness'}
        variant={isSavingLoading ? 'disabled' : 'primary'}
        type="submit"
        shape={'right_bottom'}
        minWidth={'on'}
        className="mt-spaceSmall w-fit self-end"
      >
        {isSavingLoading ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </div>
  );
}
