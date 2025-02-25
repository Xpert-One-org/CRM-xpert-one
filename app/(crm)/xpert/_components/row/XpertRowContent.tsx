import Input from '@/components/inputs/Input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelect } from '@/store/select';
import type { DBXpert, DBXpertOptimized } from '@/types/typesDb';
import { getLabel } from '@/utils/getLabel';
import React, { useEffect, useState } from 'react';
import {
  degreeSelect,
  expertiseSelect,
  genres,
  habilitationsSelect,
  how,
  iamSelect,
  languageLevelSelect,
  languageSelect,
  specialitySelect,
  statusSelectEmployee,
  statusSelectInde,
} from '@/data/mocked_select';
import { ageMax, empty } from '@/data/constant';
import { Slider } from '@/components/ui/slider';
import XpertExperience from '../XpertExperience';
import { getYears } from '@/utils/string';
import TextArea from '@/components/inputs/TextArea';
import { useXpertStore } from '@/store/xpert';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';
import CreatableSelect from '@/components/CreatableSelect';
import MultiCreatableSelect from '@/components/MultiCreatableSelect';
import Button from '@/components/Button';
import Plus from '@/components/svg/Plus';
import { Minus } from 'lucide-react';
import { useXpertDebounce } from '@/hooks/use-xpert-debounce';
import XpertAlertSettings from '../XpertAlertSettings';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { updateUserAlerts } from '../../xpert.action';
import { toast } from 'sonner';

export type NestedTableKey =
  | 'profile_expertise'
  | 'profile_mission'
  | 'profile_status'
  | 'user_alerts';

export default function XpertRowContent({
  xpertOptimized,
  handleKeyChanges,
  enableEmailEdit,
}: {
  xpertOptimized: DBXpertOptimized;
  handleKeyChanges: (table: NestedTableKey | undefined, name: string) => void;
  enableEmailEdit: boolean;
}) {
  // remove duplicate status
  const selectStatus = [...statusSelectEmployee, ...statusSelectInde].filter(
    (status, index, self) =>
      index ===
      self.findIndex(
        (t) => t.value === status.value && t.label === status.label
      )
  );

  const {
    countries,
    languages,
    subjects, // Ajout
    sectors, // Ajout
    loadingSubjects, // Ajout de l'état de chargement
    loadingSectors, // Ajout de l'état de chargement
    fetchSubjects, // Ajout pour charger les données
    fetchSectors,
  } = useSelect();

  useEffect(() => {
    fetchSubjects();
    fetchSectors();
  }, []);

  const {
    getXpertSelected,
    setOpenedXpert,
    openedXpertNotSaved: xpert,
    setOpenedXpertNotSaved: setXpert,
  } = useXpertStore();
  const { handleKeyChangesDebounced, handleUIChange } = useXpertDebounce();

  const handleGetSpecificXpert = async () => {
    try {
      const { xpert: specificXpert } = await getXpertSelected(
        xpertOptimized.generated_id
      );
      if (specificXpert) {
        setXpert(specificXpert);
        setOpenedXpert(specificXpert.id);
      }
    } catch (error) {
      console.error('Error fetching xpert:', error);
    }
  };
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    table?: NestedTableKey
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    // Mise à jour immédiate de l'UI
    const newXpert = xpert
      ? {
          ...xpert,
          [table ? table : name]: table
            ? { ...xpert[table], [name]: value }
            : value,
        }
      : null;

    handleUIChange(newXpert);

    // Version debouncée de handleKeyChanges
    handleKeyChangesDebounced(table, name);
  };

  const handleChangeValueInput = (
    value: string,
    name: string,
    table?: NestedTableKey
  ) => {
    handleKeyChanges(table, name);

    const newXpert = xpert
      ? {
          ...xpert,
          [table ? table : name]: table
            ? { ...xpert[table], [name]: value }
            : value,
        }
      : null;
    setXpert(newXpert);
  };

  const handleChangeSelect = (
    value: string | number,
    name: string,
    table?: NestedTableKey
  ) => {
    handleKeyChanges(table, name);

    const newXpert = xpert
      ? {
          ...xpert,
          [table ? table : name]: table
            ? { ...xpert[table], [name]: value }
            : value,
        }
      : null;
    setXpert(newXpert);
  };

  const handleChangeJsonLanguage = (
    value: string,
    name: 'language' | 'level',
    index: number
  ) => {
    const newOtherLanguage = xpert?.profile_expertise?.other_language?.map(
      (lang, i) => {
        if (i === index) {
          return {
            ...(lang as { language: string; level: string }),
            [name]: value,
          };
        }
        return lang;
      }
    );
    handleKeyChanges('profile_expertise', 'other_language');

    const newXpert = xpert
      ? {
          ...xpert,
          profile_expertise: {
            ...xpert.profile_expertise!,
            other_language: newOtherLanguage!,
          },
        }
      : null;
    setXpert(newXpert);
  };

  const handleChangeMultiSelect = (
    value: string[] | string,
    name: string,
    table?: NestedTableKey
  ) => {
    handleKeyChanges(table, name);

    if (table) {
      const newXpert = xpert
        ? { ...xpert, [table]: { ...xpert[table], [name]: value } }
        : null;
      setXpert(newXpert);
      return;
    }
    const newXpert = xpert ? { ...xpert, [name]: value } : null;
    setXpert(newXpert);
  };

  const addNewLanguage = () => {
    const newXpert = xpert
      ? {
          ...xpert,
          profile_expertise: {
            ...xpert.profile_expertise!,
            other_language: [
              ...(xpert.profile_expertise?.other_language ?? []),
              { language: '', level: '' },
            ],
          },
        }
      : null;
    setXpert(newXpert);
  };

  const removeLanguage = (index: number) => {
    const newOtherLanguage = xpert?.profile_expertise?.other_language?.filter(
      (_, i) => i !== index
    );
    const newXpert = xpert
      ? {
          ...xpert,
          profile_expertise: {
            ...xpert.profile_expertise!,
            other_language: newOtherLanguage!,
          },
        }
      : null;
    handleKeyChanges('profile_expertise', 'other_language');

    setXpert(newXpert);
  };

  const handleChangeAlertCheckbox = async (
    checked: CheckedState,
    name: string
  ) => {
    if (!xpert?.user_alerts) return;

    const updatedAlerts = {
      ...xpert.user_alerts,
      [name]: checked,
    };

    const { error } = await updateUserAlerts({
      xpert_id: xpert.id,
      userAlerts: updatedAlerts,
    });

    if (error) {
      toast.error('Erreur lors de la mise à jour des préférences');
      return;
    }

    // Crée un nouvel objet xpert complet pour satisfaire le type DBXpert
    const updatedXpert: DBXpert = {
      ...xpert,
      user_alerts: updatedAlerts,
    };

    setXpert(updatedXpert);
  };

  const handleChangeAlertSelect = async (
    value: string[] | string,
    name: string
  ) => {
    if (!xpert?.user_alerts) return;

    const updatedAlerts = {
      ...xpert.user_alerts,
      [name]: value,
    };

    const { error } = await updateUserAlerts({
      xpert_id: xpert.id,
      userAlerts: updatedAlerts,
    });

    if (error) {
      toast.error('Erreur lors de la mise à jour des préférences');
      return;
    }

    const updatedXpert: DBXpert = {
      ...xpert,
      user_alerts: updatedAlerts,
    };

    setXpert(updatedXpert);
  };

  const [specialtiesOther, setSpecialtiesOther] = useState<string>('');
  const [expertisesOther, setExpertisesOther] = useState<string>('');
  const [habilitationsOther, setHabilitationsOther] = useState<string>('');

  useEffect(() => {
    if (xpert?.profile_expertise) {
      setSpecialtiesOther(xpert.profile_expertise.specialties_other || '');
      setExpertisesOther(xpert.profile_expertise.expertises_other || '');
      setHabilitationsOther(xpert.profile_expertise.habilitations_other || '');
    }
  }, [xpert]);

  const handleOtherInput = (value: string, field: string) => {
    handleKeyChanges('profile_expertise', `${field}_other`);
    const newXpert = xpert
      ? {
          ...xpert,
          profile_expertise: {
            ...xpert.profile_expertise!,
            [`${field}_other`]: value,
          },
        }
      : null;
    setXpert(newXpert);

    switch (field) {
      case 'specialties':
        setSpecialtiesOther(value);
        break;
      case 'expertises':
        setExpertisesOther(value);
        break;
      case 'habilitations':
        setHabilitationsOther(value);
        break;
    }
  };

  useEffect(() => {
    if (!xpert) {
      handleGetSpecificXpert();
    }
  }, [xpertOptimized.generated_id]);

  if (!xpert) {
    return null;
  }

  const years = getYears({
    data: (xpert.profile_expertise && xpert.profile_expertise.seniority) ?? 0,
    max: ageMax,
  });

  return (
    <div className="flex flex-col gap-y-spaceXSmall p-spaceSmall">
      <div className="grid w-full grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <Input
            hasPreIcon
            label="Référant XPERT ONE"
            value={`${xpert.referent?.firstname ?? ''} ${xpert.referent?.lastname ?? ''}`}
            disabled
          />
          <div className="flex gap-x-4">
            <Input
              label="Prénom"
              value={`${xpert.firstname}`}
              name="firstname"
              onChange={handleChangeInput}
            />
            <Input
              label="Nom"
              value={`${xpert.lastname}`}
              name="lastname"
              onChange={handleChangeInput}
            />
          </div>
          <Input
            label="Email"
            name="email"
            value={xpert?.email || ''}
            onChange={(e) => handleChangeInput(e)}
          />
        </div>
        <div className="flex items-center justify-end">
          <Avatar className="aspect-square size-[120px]">
            <AvatarImage
              src={xpert.avatar_url ?? ''}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-xl uppercase text-white">
              {xpert.firstname?.substring(0, 1)}
              {xpert.lastname?.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <p className="pt-4 text-lg font-medium text-black">Mon profil</p>
      <div className="grid w-full grid-cols-3 gap-4">
        <CreatableSelect
          label={'Civilité'}
          options={genres}
          defaultValue={{
            label:
              getLabel({ value: xpert.civility ?? '', select: genres }) ?? '',
            value: xpert.civility ?? '',
          }}
          onChange={(e) => handleChangeSelect(e.value, 'civility')}
        />
        <Input
          type="date"
          label="Date de naissance"
          value={xpert.birthdate ?? ''}
          name="birthdate"
          onChange={handleChangeInput}
        />
        <Input hasPreIcon label="Notation" disabled value={'Indisponible'} />
      </div>
      <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <PhoneInputComponent
          label="Tél portable"
          name="mobile"
          placeholder={''}
          onValueChange={(value, name) => handleChangeValueInput(value, name)}
          value={xpert.mobile ?? ''}
          defaultSelectedKeys={xpert.mobile ?? ''}
        />
        <PhoneInputComponent
          label="Tél fixe"
          name="fix"
          placeholder={''}
          onValueChange={(value, name) => handleChangeValueInput(value, name)}
          value={xpert.fix ?? ''}
          defaultSelectedKeys={xpert.fix ?? ''}
        />

        <Input
          label="N° de rue"
          value={xpert.street_number ?? ''}
          name="street_number"
          onChange={handleChangeInput}
        />
        <Input
          label="Addresse postale"
          value={xpert.address ?? ''}
          name="address"
          onChange={handleChangeInput}
        />

        <Input
          label="Ville"
          value={xpert.city ?? ''}
          name="city"
          onChange={handleChangeInput}
        />
        <Input
          label="Code postal"
          value={xpert.postal_code ?? ''}
          name="postal_code"
          onChange={handleChangeInput}
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
                value: xpert.country ?? '',
                select: countries,
              }) ?? '',
            value: xpert.country ?? '',
          }}
          onChange={(e) => handleChangeSelect(e.value, 'country')}
        />
      </div>
      <div className="mb-spaceContainer mt-[60px] h-px w-full bg-[#BEBEC0]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          label="Profil LinkedIn"
          value={xpert.linkedin ?? ''}
          name="linkedin"
          onChange={handleChangeInput}
        />

        <CreatableSelect
          creatable
          label="Comment a-t-il connu Xpert One ?"
          defaultValue={{
            label:
              getLabel({
                value: xpert.how_did_you_hear_about_us ?? '',
                select: how,
              }) ?? '',
            value: xpert.how_did_you_hear_about_us ?? '',
          }}
          onChange={(e) =>
            handleChangeSelect(e.value, 'how_did_you_hear_about_us')
          }
          optionsOther={xpert.how_did_you_hear_about_us_other}
          options={
            xpert.how_did_you_hear_about_us_other
              ? [
                  ...how,
                  {
                    label: xpert.how_did_you_hear_about_us_other,
                    value: xpert.how_did_you_hear_about_us_other,
                  },
                ]
              : how
          }
        />
        <Input
          hasPreIcon
          label="Parrainé par"
          value={xpert.referent_id ?? empty}
          disabled={true}
        />
      </div>
      <p className="pt-spaceContainer text-lg font-medium text-black">
        Mon statut
      </p>
      <div className="grid w-full grid-cols-2 gap-4">
        <CreatableSelect
          label={'Il est...'}
          options={iamSelect}
          defaultValue={{
            label:
              getLabel({
                value: xpert.profile_status?.iam ?? '',
                select: iamSelect,
              }) ?? '',
            value: xpert.profile_status?.iam ?? '',
          }}
          onChange={(e) => handleChangeSelect(e.value, 'iam', 'profile_status')}
        />

        <CreatableSelect
          label={'Statut'}
          options={selectStatus}
          defaultValue={{
            label:
              getLabel({
                value: xpert.profile_status?.status ?? '',
                select: selectStatus,
              }) ?? '',
            value: xpert.profile_status?.status ?? '',
          }}
          onChange={(e) =>
            handleChangeSelect(e.value, 'status', 'profile_status')
          }
        />
      </div>
      <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          label="N° de SIRET"
          value={xpert.profile_status?.siret ?? empty}
          name="siret"
          onChange={(e) => handleChangeInput(e, 'profile_status')}
        />
      </div>
      <div className="mb-spaceMediumContainer mt-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <p className="pt-spaceContainer text-lg font-medium text-black">
        Mon expertise
      </p>
      <p className="text-md font-medium text-black">
        Depuis combien de temps exercez-vous dans les métiers de la transition
        énergétique ?
      </p>
      <Slider
        defaultValue={[
          xpert.profile_expertise && xpert.profile_expertise.seniority
            ? xpert.profile_expertise.seniority
            : 0,
        ]}
        max={35}
        step={1}
        onValueChange={(value) =>
          handleChangeSelect(value[0], 'seniority', 'profile_expertise')
        }
        className="mt-[25px] w-3/4 max-w-[538px]"
        textValue={String(
          `${
            (xpert.profile_expertise && xpert.profile_expertise.seniority) ?? 0
          } ${years}`
        )}
      />
      <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <XpertExperience handleKeyChanges={handleKeyChanges} />
      <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <MultiCreatableSelect
          creatable
          label="Spécialités"
          defaultValue={xpert.profile_expertise?.specialties?.map(
            (specialty) => ({
              label:
                getLabel({ value: specialty, select: specialitySelect }) ?? '',
              value: specialty ?? '',
            })
          )}
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleChangeMultiSelect(values, 'specialties', 'profile_expertise');
            if (
              !values.some((v) => v.includes('Autre') || v.includes('other'))
            ) {
              handleOtherInput('', 'specialties');
            }
          }}
          optionsOther={xpert.profile_expertise?.specialties_other}
          options={specialitySelect}
        />
        {xpert.profile_expertise?.specialties?.some(
          (v) => v.includes('Autre') || v.includes('other')
        ) && (
          <Input
            label="Précisez la spécialité"
            value={specialtiesOther}
            onChange={(e) => handleOtherInput(e.target.value, 'specialties')}
          />
        )}

        <MultiCreatableSelect
          creatable
          label="Expertises"
          defaultValue={xpert.profile_expertise?.expertises?.map(
            (expertise) => ({
              label:
                getLabel({ value: expertise, select: expertiseSelect }) ?? '',
              value: expertise ?? '',
            })
          )}
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleChangeMultiSelect(values, 'expertises', 'profile_expertise');
            if (
              !values.some((v) => v.includes('Autre') || v.includes('other'))
            ) {
              handleOtherInput('', 'expertises');
            }
          }}
          optionsOther={xpert.profile_expertise?.expertises_other}
          options={expertiseSelect}
        />
        {xpert.profile_expertise?.expertises?.some(
          (v) => v.includes('Autre') || v.includes('other')
        ) && (
          <Input
            label="Précisez l'expertise"
            value={expertisesOther}
            onChange={(e) => handleOtherInput(e.target.value, 'expertises')}
          />
        )}

        <MultiCreatableSelect
          creatable
          label="Habilitations"
          defaultValue={xpert.profile_expertise?.habilitations?.map(
            (habilitation) => ({
              label:
                getLabel({
                  value: habilitation,
                  select: habilitationsSelect,
                }) ?? '',
              value: habilitation ?? '',
            })
          )}
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleChangeMultiSelect(
              values,
              'habilitations',
              'profile_expertise'
            );
            if (
              !values.some((v) => v.includes('Autre') || v.includes('other'))
            ) {
              handleOtherInput('', 'habilitations');
            }
          }}
          optionsOther={xpert.profile_expertise?.habilitations_other}
          options={habilitationsSelect}
        />
        {xpert.profile_expertise?.habilitations?.some(
          (v) => v.includes('Autre') || v.includes('other')
        ) && (
          <Input
            label="Précisez l'habilitation"
            value={habilitationsOther}
            onChange={(e) => handleOtherInput(e.target.value, 'habilitations')}
          />
        )}
      </div>
      <div className="my-spaceContainer h-px w-full bg-[#BEBEC0]" />
      <div className="grid w-full grid-cols-2 gap-4">
        <CreatableSelect
          creatable
          label="Niveau d'étude"
          defaultValue={{
            label:
              getLabel({
                value: xpert.profile_expertise?.degree ?? '',
                select: degreeSelect,
              }) ?? '',
            value: xpert.profile_expertise?.degree ?? '',
          }}
          optionsOther={xpert.profile_expertise?.degree_other}
          onChange={(e) =>
            handleChangeSelect(e.value, 'degree', 'profile_expertise')
          }
          options={
            xpert.profile_expertise?.degree_other
              ? [
                  ...degreeSelect,
                  {
                    label: xpert.profile_expertise.degree_other,
                    value: xpert.profile_expertise.degree_other,
                  },
                ]
              : degreeSelect
          }
        />

        <Input
          label="Diplôme précis"
          name="diploma"
          value={
            (xpert.profile_expertise && xpert.profile_expertise.diploma) ?? ''
          }
          onChange={(e) => handleChangeInput(e, 'profile_expertise')}
        />
        <Input
          label="Éléments supplémentaires"
          name="others"
          value={
            (xpert.profile_expertise && xpert.profile_expertise.others) ?? empty
          }
          onChange={(e) => handleChangeInput(e, 'profile_expertise')}
        />
      </div>
      <div className="my-4 w-full">
        <CreatableSelect
          creatable
          label="Langue maternelle"
          defaultValue={{
            label:
              getLabel({
                value: xpert.profile_expertise?.maternal_language ?? '',
                select: languageSelect,
              }) ?? '',
            value: xpert.profile_expertise?.maternal_language ?? '',
          }}
          optionsOther={xpert.profile_expertise?.maternal_language_other}
          onChange={(e) =>
            handleChangeSelect(
              e.value,
              'maternal_language',
              'profile_expertise'
            )
          }
          options={
            xpert.profile_expertise?.maternal_language_other
              ? [
                  ...languageSelect,
                  {
                    label: xpert.profile_expertise.maternal_language_other,
                    value: xpert.profile_expertise.maternal_language_other,
                  },
                ]
              : languageSelect
          }
        />
      </div>

      <div className="mb-4 flex w-full flex-col gap-4">
        {xpert.profile_expertise?.other_language?.map((lang, index) => (
          <div key={index} className="flex gap-4">
            <CreatableSelect
              creatable
              label={`Langue ${index + 2}`}
              defaultValue={{
                label:
                  getLabel({
                    value:
                      (lang as { level: string; language: string }).language ??
                      '',
                    select: languageSelect,
                  }) ?? '',
                value:
                  (lang as { level: string; language: string }).language ?? '',
              }}
              onChange={(e) =>
                handleChangeJsonLanguage(e.value, 'language', index)
              }
              options={languageSelect}
            />
            <CreatableSelect
              creatable
              label={`Niveau langue ${index + 2}`}
              defaultValue={{
                label:
                  getLabel({
                    value:
                      (lang as { level: string; language: string }).level ?? '',
                    select: languageLevelSelect,
                  }) ?? '',
                value:
                  (lang as { level: string; language: string }).level ?? '',
              }}
              onChange={(e) =>
                handleChangeJsonLanguage(e.value, 'level', index)
              }
              options={languageLevelSelect}
            />
            <Button
              className="flex size-fit self-end"
              variant={'previous'}
              onClick={() => removeLanguage(index)}
            >
              <Minus />
            </Button>
          </div>
        ))}
        {/* 
        Add new language
         */}
        <Button className="w-fit" onClick={addNewLanguage}>
          <Plus />
        </Button>
      </div>

      <div className="grid w-full grid-cols-2 gap-4">
        <Input
          hasPreIcon
          label="Auto-Évaluation"
          value={empty}
          disabled={true}
        />
      </div>
      <XpertAlertSettings
        userAlerts={xpert.user_alerts}
        onChangeCheckbox={handleChangeAlertCheckbox}
        onChangeSelect={handleChangeAlertSelect}
        subjects={subjects}
        sectors={sectors}
        loadingSubjects={loadingSubjects}
        loadingSectors={loadingSectors}
        categories={xpert.user_alerts?.categories ?? []}
        topics={xpert.user_alerts?.topics ?? []}
        center_of_interest={xpert.user_alerts?.center_of_interest ?? []}
      />
    </div>
  );
}
