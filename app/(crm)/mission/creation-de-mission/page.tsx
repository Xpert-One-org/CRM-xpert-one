'use client';
import Info from '@/components/Info';
import Input from '@/components/inputs/Input';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';
import TextArea from '@/components/inputs/TextArea';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import SelectComponent from '@/components/SelectComponent';
import Separator from '@/components/Separator';
import {
  booleanSelect,
  degreeSelect,
  energyRenewableSelect,
  energySelect,
  expertiseSelect,
  infrastructureSelect,
  jobTitleSelect,
  languageSelect,
  postTypesSelect,
  profilSearchedSelect,
  sectorSelect,
  specialitySelect,
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
import { ComboboxSelect } from './_components/ComboboxSelect';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CreatableSelect from '@/components/CreatableSelect';
import { getLabel } from '@/utils/getLabel';
import MultiCreatableSelect from '@/components/MultiCreatableSelect';

export default function Page() {
  const [mission, setMission] = useState<DBMission>(emptyMission);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isSavingLoading, setIsSavingLoading] = useState(false);
  const {
    job_title,
    sector,
    sector_other,
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
  const { fetchCollaborators, collaborators } = useAdminCollaborators();
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

    let missionState;
    if (validationState === 'refused') {
      missionState = 'refused';
    } else if (openAllToValidate && !isValidated) {
      missionState = 'open_all_to_validate';
    } else if (isValidated && !openAllToValidate) {
      missionState = 'open';
    } else if (isValidated && openAllToValidate) {
      missionState = 'open_all';
    } else if (validationState === 'in_process') {
      missionState = 'in_process';
    } else {
      missionState = 'refused';
    }

    const missionData = {
      ...usedDataJson,
      state: missionState,
      affected_referent_id: mission.affected_referent_id,
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
        return;
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

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    if (isCompleted) {
      router.push('/mission/etats?etat=in_process');
    }
  }, [isCompleted]);

  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern', 'hr', 'adv']}>
      <div className="flex flex-col gap-y-spaceSmall px-spaceContainer pt-spaceContainer md:px-0">
        <InformativePopup />
        <p className={cn('text-lg font-medium')}>Informations de mission</p>

        {/* Line 1 */}
        <div className="flex w-full flex-wrap gap-x-spaceContainer gap-y-spaceSmall">
          <CreatableSelect
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.profile_searched?.name as keyof UserType
            )}
            className="xl:w-fit"
            label={'Profil recherché'}
            options={profilSearchedSelect}
            defaultValue={{
              label: '',
              value: '',
            }}
            required
            onChange={(e) => handleChangeSelect(e.value, 'profile_searched')}
          />

          <CreatableSelect
            required
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.job_title?.name as keyof UserType
            )}
            className="xl:w-fit"
            options={jobTitleSelect}
            creatable
            defaultValue={{
              label: '',
              value: '',
            }}
            onChange={(e) => handleChangeSelect(e.value, 'job_title')}
            label={'Intitulé de poste'}
          />

          <MultiCreatableSelect
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.post_type?.name as keyof UserType
            )}
            label={creationMissionData.post_type?.label}
            options={postTypesSelect}
            placeholder={'Type de poste'}
            className="w-fit"
            defaultValue={[]}
            name={creationMissionData.post_type?.name ?? ''}
            onChange={(selectedOption) => {
              const values = selectedOption.map((option) => option.value);
              handleChangeSelect(values, 'post_type');
            }}
          />

          <CreatableSelect
            label={creationMissionData.sector?.label}
            creatable
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.sector?.name as keyof UserType
            )}
            options={sectorSelect}
            placeholder={'Choisir'}
            className="w-fit"
            defaultValue={{
              label: '',
              value: '',
            }}
            name={creationMissionData.sector?.name ?? ''}
            onChange={(e) => handleChangeSelect(e.value, 'sector')}
          />

          {sector == 'energy' && (
            <CreatableSelect
              hasError={checkIfRequiredAndNotMissing(
                creationMissionData.sector_energy?.name as keyof UserType
              )}
              className="xpertise_input w-fit"
              defaultValue={{
                label: '',
                value: '',
              }}
              placeholder="Choisir"
              options={energySelect}
              label={creationMissionData.sector_energy?.label}
              onChange={(e) => handleChangeSelect(e.value, 'sector_energy')}
            />
          )}

          {sector == 'renewable_energy' && (
            <CreatableSelect
              hasError={checkIfRequiredAndNotMissing(
                creationMissionData.sector_renewable_energy
                  ?.name as keyof UserType
              )}
              className="xpertise_input w-fit"
              defaultValue={{
                label: '',
                value: '',
              }}
              placeholder="Choisir"
              options={energyRenewableSelect}
              label={creationMissionData.sector_renewable_energy?.label}
              onChange={(e) =>
                handleChangeSelect(e.value, 'sector_renewable_energy')
              }
            />
          )}

          {sector == 'waste_treatment' && (
            <CreatableSelect
              hasError={checkIfRequiredAndNotMissing(
                creationMissionData.sector_waste_treatment
                  ?.name as keyof UserType
              )}
              className="xpertise_input w-fit"
              placeholder="Choisir"
              options={wasteTreatmentSelect}
              label={creationMissionData.sector_waste_treatment?.label}
              onChange={(e) =>
                handleChangeSelect(e.value, 'sector_waste_treatment')
              }
            />
          )}

          {sector == 'infrastructure' && (
            <CreatableSelect
              hasError={checkIfRequiredAndNotMissing(
                creationMissionData.sector_infrastructure
                  ?.name as keyof UserType
              )}
              className="xpertise_input w-fit"
              defaultValue={{
                label: '',
                value: '',
              }}
              placeholder={'Choisir'}
              options={infrastructureSelect}
              label={creationMissionData.sector_infrastructure?.label}
              name={creationMissionData.sector_infrastructure?.name ?? ''}
              onChange={(e) =>
                handleChangeSelect(e.value, 'sector_infrastructure')
              }
            />
          )}

          <MultiCreatableSelect
            creatable
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.specialties?.name as keyof UserType
            )}
            label={creationMissionData.specialties?.label}
            options={specialitySelect}
            placeholder={'Spécialités'}
            className="w-fit"
            name={creationMissionData.specialties?.name ?? ''}
            onChange={(selectedOption) => {
              const values = selectedOption.map((option) => option.value);
              handleChangeSelect(values, 'specialties');
            }}
          />

          <MultiCreatableSelect
            creatable
            label={creationMissionData.expertises?.label}
            className="w-fit"
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.expertises?.name as keyof UserType
            )}
            options={expertiseSelect}
            placeholder={'Expertise'}
            onChange={(selectedOption) => {
              const values = selectedOption.map((option) => option.value);
              handleChangeSelect(values, 'expertises');
            }}
          />

          <MultiCreatableSelect
            creatable
            label={creationMissionData.diplomas?.label}
            className="w-fit"
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.diplomas?.name as keyof UserType
            )}
            options={degreeSelect}
            placeholder={'Diplômes'}
            onChange={(selectedOption) => {
              const values = selectedOption.map((option) => option.value);
              handleChangeSelect(values, 'diplomas');
            }}
          />

          <MultiCreatableSelect
            creatable
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.languages?.name as keyof UserType
            )}
            label={creationMissionData.languages?.label}
            placeholder={'Langues parlées'}
            className="w-fit"
            options={languageSelect}
            onChange={(selectedOption) => {
              const values = selectedOption.map((option) => option.value);
              handleChangeSelect(values, 'languages');
            }}
          />

          <Input
            label={creationMissionData.tjm?.label}
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.tjm?.name as keyof UserType
            )}
            explain={'Votre TJM doit inclure la notion de grands déplacements'}
            sideEplain="top"
            placeholder="TJM Max"
            name={creationMissionData.tjm?.name}
            onChange={handleChange}
          />

          <CreatableSelect
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.open_to_disabled?.name as keyof UserType
            )}
            label={creationMissionData.open_to_disabled?.label}
            options={booleanSelect}
            className="w-fit xl:max-w-[340px]"
            onChange={(e) => handleChangeSelect(e.value, 'open_to_disabled')}
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

          {countries.length && (
            <CreatableSelect
              hasError={
                countries.length > 0 &&
                checkIfRequiredAndNotMissing(
                  creationMissionData.country?.name as keyof UserType
                )
              }
              options={countries}
              className="w-fit"
              label={creationMissionData.country?.label}
              name={creationMissionData.country?.name ?? ''}
              onChange={(e) => handleChangeSelect(e.value, 'country')}
            />
          )}
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
                {/* Si c'est pas selectionne c'est auto */}
                Sélectionnez le référent de mission qui sera en charge de
                l'accueil de votre Xpert. <br /> Si vous ne sélectionnez
                personne, un référent sera automatiquement attribué.
              </p>
            </Info>
          </span>{' '}
        </p>

        <div className="grid grid-cols-4 gap-4">
          <Select
            value={mission.affected_referent_id ?? 'none'}
            onValueChange={(value) =>
              handleChangeSelect(value, 'affected_referent_id')
            }
          >
            <SelectTrigger className="h-full justify-center gap-2 border-0 bg-[#F5F5F5]">
              <SelectValue placeholder="Référent de mission" />
            </SelectTrigger>{' '}
            <SelectContent>
              <SelectItem value="none">Aucun</SelectItem>
              {collaborators
                .filter(
                  (c) => c.role === 'admin' || c.role === 'project_manager'
                )
                .map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.firstname} {c.lastname}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Separator className="my-spaceSmall" />

        <div className="grid grid-cols-4 gap-4">
          <ComboboxFournisseur
            name={creationMissionData.created_by?.name ?? ''}
            required={true}
            label={creationMissionData.created_by?.label ?? ''}
            onChange={handleChange}
            hasError={checkIfRequiredAndNotMissing(
              creationMissionData.created_by?.name as keyof UserType
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
    </ProtectedRoleRoutes>
  );
}
