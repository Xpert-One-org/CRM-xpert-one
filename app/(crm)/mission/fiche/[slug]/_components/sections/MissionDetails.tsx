// components/mission/sections/MissionDetails.tsx
import { useEffect } from 'react';
import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import TextArea from '@/components/inputs/TextArea';
import SelectComponent from '@/components/SelectComponent';
import { empty } from '@/data/constant';
import {
  profilSearchedSelect,
  postTypesSelect,
  booleanSelect,
  energyRenewableSelect,
  energySelect,
  wasteTreatmentSelect,
  degreeSelect,
  jobTitleSelect,
  sectorSelect,
  infrastructureSelect,
  specialitySelect,
  expertiseSelect,
  languageSelect,
} from '@/data/mocked_select';
import { useSelect } from '@/store/select';
import { useEditMissionStore } from '../../../editMissionStore';
import { ComboboxSelect } from '../../../../../mission/creation-de-mission/_components/ComboboxSelect';
import MultiCreatableSelect from '@/components/MultiCreatableSelect';
import { getLabel } from '@/utils/getLabel';
import CreatableSelect from '@/components/CreatableSelect';

export function MissionDetails() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  const loadingText = 'Chargement...';

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">
        Informations de mission
      </h3>

      {/* Première ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <CreatableSelect
          className="w-[200px]"
          label="Profil recherché"
          options={profilSearchedSelect}
          defaultValue={{
            label:
              getLabel({
                value: mission.profile_searched ?? '',
                select: profilSearchedSelect,
              }) ?? '',
            value: mission.profile_searched ?? '',
          }}
          onChange={(value) => handleUpdateField('profile_searched', value)}
        />

        <CreatableSelect
          className="w-[280px]"
          label="Intitulé de mission"
          options={jobTitleSelect}
          optionsOther={mission.job_title_other}
          defaultValue={{
            label:
              getLabel({
                value: mission.job_title ?? '',
                select: jobTitleSelect,
              }) ?? '',
            value: mission.job_title ?? '',
          }}
          name="job_title"
          onChange={(selectedOption) => {
            handleUpdateField('job_title', selectedOption.value);
          }}
        />

        <MultiCreatableSelect
          className="w-fit"
          label="Type de poste"
          options={postTypesSelect}
          defaultValue={mission.post_type?.map((post_type) => ({
            label:
              getLabel({ value: post_type, select: postTypesSelect }) ?? '',
            value: post_type ?? '',
          }))}
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleUpdateField('post_type', values);
          }}
        />
      </div>

      {/* Deuxième ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <CreatableSelect
          creatable
          className="w-[280px]"
          label="Secteur d'activité"
          options={sectorSelect}
          optionsOther={mission.sector_other}
          defaultValue={{
            label:
              getLabel({ value: mission.sector ?? '', select: sectorSelect }) ??
              '',
            value: mission.sector ?? '',
          }}
          onChange={(selectedOption) =>
            handleUpdateField('sector', selectedOption.value)
          }
        />

        {mission.sector === 'energy' && (
          <CreatableSelect
            className="w-[280px]"
            label="Type d'énergie"
            options={energySelect}
            defaultValue={{
              label:
                getLabel({
                  value: mission.sector_energy ?? '',
                  select: energySelect,
                }) ?? '',
              value: mission.sector_energy ?? '',
            }}
            name="sector_energy"
            onChange={(selectedOption) =>
              handleUpdateField('sector_energy', selectedOption.value)
            }
          />
        )}

        {mission.sector === 'renewable_energy' && (
          <CreatableSelect
            className="w-[280px]"
            label="Type d'énergie renouvelable"
            options={energyRenewableSelect}
            optionsOther={mission.sector_renewable_energy_other}
            defaultValue={{
              label:
                getLabel({
                  value: mission.sector_renewable_energy ?? '',
                  select: energyRenewableSelect,
                }) ?? '',
              value: mission.sector_renewable_energy ?? '',
            }}
            name="sector_renewable_energy"
            onChange={(selectedOption) =>
              handleUpdateField('sector_renewable_energy', selectedOption.value)
            }
          />
        )}

        {mission.sector === 'waste_treatment' && (
          <SelectComponent
            className="w-[280px]"
            label="Type de traitement des déchets"
            options={wasteTreatmentSelect}
            defaultSelectedKeys={mission.sector_waste_treatment ?? ''}
            name="sector_waste_treatment"
            onValueChange={(value) =>
              handleUpdateField('sector_waste_treatment', value)
            }
          />
        )}

        {mission.sector === 'infrastructure' && (
          <CreatableSelect
            className="w-[280px]"
            label="Type d'infrastructure"
            options={infrastructureSelect}
            optionsOther={mission.sector_infrastructure_other}
            defaultValue={{
              label:
                getLabel({
                  value: mission.sector_infrastructure ?? '',
                  select: infrastructureSelect,
                }) ?? '',
              value: mission.sector_infrastructure ?? '',
            }}
            name="sector_infrastructure"
            onChange={(selectedOption) =>
              handleUpdateField('sector_infrastructure', selectedOption.value)
            }
          />
        )}
      </div>

      {/* Troisième ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <MultiCreatableSelect
          className="w-[280px]"
          label="Spécialité"
          options={specialitySelect}
          optionsOther={mission.specialties_other}
          defaultValue={mission.specialties?.map((specialty) => ({
            label:
              getLabel({ value: specialty, select: specialitySelect }) ?? '',
            value: specialty ?? '',
          }))}
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleUpdateField('specialties', values);
          }}
          placeholder={'Spécialités'}
        />

        <MultiCreatableSelect
          className="w-[280px]"
          label="Expertise"
          options={expertiseSelect}
          optionsOther={mission.expertises_other}
          defaultValue={mission.expertises?.map((expertise) => ({
            label:
              getLabel({ value: expertise, select: expertiseSelect }) ?? '',
            value: expertise ?? '',
          }))}
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleUpdateField('expertises', values);
          }}
          placeholder={'Expertise'}
        />
      </div>

      {/* Quatrième ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <MultiCreatableSelect
          className="w-[280px]"
          label="Diplôme / Niveau d'étude"
          options={degreeSelect}
          optionsOther={mission.diplomas_other}
          defaultValue={mission.diplomas?.map((diploma) => ({
            label: getLabel({ value: diploma, select: degreeSelect }) ?? '',
            value: diploma ?? '',
          }))}
          name="diplomas"
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleUpdateField('diplomas', values);
          }}
          placeholder={'Diplômes'}
        />

        <MultiCreatableSelect
          className="w-[280px]"
          label="Langues"
          options={languageSelect}
          optionsOther={mission.languages_other}
          defaultValue={mission.languages?.map((language) => ({
            label: getLabel({ value: language, select: languageSelect }) ?? '',
            value: language ?? '',
          }))}
          name="languages"
          onChange={(selectedOption) => {
            const values = selectedOption.map((option) => option.value);
            handleUpdateField('languages', values);
          }}
          placeholder={'Langues parlées'}
        />

        <Input
          className="w-[280px]"
          label="TJM cible MAX"
          name="tjm"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
          placeholder="TJM Max"
        />

        <SelectComponent
          className="w-[280px]"
          label="Poste ouvert aux situations de handicap"
          options={booleanSelect}
          defaultSelectedKeys={mission.open_to_disabled ?? ''}
          name="open_to_disabled"
          onValueChange={(value) =>
            handleUpdateField('open_to_disabled', value)
          }
        />
      </div>
    </div>
  );
}
