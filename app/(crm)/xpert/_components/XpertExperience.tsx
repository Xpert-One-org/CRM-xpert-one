import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import SelectComponent from '@/components/inputs/SelectComponent';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { empty } from '@/data/constant';
import {
  booleanSelect,
  dureeSelect,
  energyRenewableSelect,
  energySelect,
  howManyPeopleLedSelect,
  infrastructureSelect,
  posts,
  postTypesSelect,
  sectorSelect,
  specialitySelect,
  wasteTreatmentSelect,
} from '@/data/mocked_select';
import { profileDataExperience } from '@/data/profile';
import { cn } from '@/lib/utils';
import { useSelect } from '@/store/select';
import type { DBProfileExperience, DBXpert } from '@/types/typesDb';
import React, { useState } from 'react';
import type { NestedTableKey } from './row/XpertRowContent';
import CreatableSelect from '@/components/CreatableSelect';
import { getLabel } from '@/utils/getLabel';
import { number } from 'zod';
import MultiCreatableSelect from '@/components/MultiCreatableSelect';
import { Plus } from 'lucide-react';
import { useXpertStore } from '@/store/xpert';

// type XpertExperienceProps = {
//   xpert: DBXpert;
//   setXpert: React.Dispatch<React.SetStateAction<DBXpert | null>>;
// };

type XpertExperienceProps = {
  handleKeyChanges: (table: NestedTableKey | undefined, name: string) => void;
};

export default function XpertExperience({
  handleKeyChanges,
}: XpertExperienceProps) {
  const { openedXpertNotSaved: xpert, setOpenedXpertNotSaved: setXpert } =
    useXpertStore();
  const { experiences } = xpert?.profile_expertise ?? {};
  const [experienceSelected, setExperienceSelected] = useState(0);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    if (xpert && xpert.profile_expertise) {
      const newExperiences = [...xpert.profile_expertise.experiences];
      newExperiences[index] = { ...newExperiences[index], [name]: value };
      const newXpert = {
        ...xpert,
        profile_expertise: {
          ...xpert.profile_expertise,
          experiences: newExperiences,
        },
      };
      handleKeyChanges('profile_expertise', 'experiences');

      setXpert(newXpert);
    }
  };

  const handleChangeSelect = (
    value: string | number,
    name: string,
    index: number
  ) => {
    if (xpert && xpert.profile_expertise) {
      const newExperiences = [...xpert.profile_expertise.experiences];
      newExperiences[index] = { ...newExperiences[index], [name]: value };
      const newXpert = {
        ...xpert,
        profile_expertise: {
          ...xpert.profile_expertise,
          experiences: newExperiences,
        },
      };
      handleKeyChanges('profile_expertise', 'experiences');

      setXpert(newXpert);
    }
  };

  const handleChangeMultiSelect = (
    value: string[] | string,
    name: string,
    index: number
  ) => {
    if (xpert && xpert.profile_expertise) {
      const newExperiences = [...xpert.profile_expertise.experiences];
      newExperiences[index] = { ...newExperiences[index], [name]: value };
      const newXpert = {
        ...xpert,
        profile_expertise: {
          ...xpert.profile_expertise,
          experiences: newExperiences,
        },
      };
      handleKeyChanges('profile_expertise', 'experiences');

      setXpert(newXpert);
    }
  };

  const addExperience = () => {
    const emptyExperience = {
      post: '',
      company: '',
      duree: '',
      is_last:
        xpert?.profile_expertise?.experiences.length === 0 ? 'true' : 'false',
      has_led_team: '',
      post_other: '',
      sector_infrastructure_other: '',
      sector_renewable_energy_other: '',
      profile_id: xpert?.id ?? '',
      id: undefined as any,
      how_many_people_led: '',
      sector: '',
      sector_other: '',
      sector_energy: '',
      sector_renewable_energy: '',
      sector_waste_treatment: '',
      sector_infrastructure: '',
      post_type: [],
      comments: '',
    };
    const newExperiences = [...(xpert?.profile_expertise?.experiences ?? [])];
    newExperiences.push(emptyExperience);
    if (!xpert || !xpert.profile_expertise) return;
    const newXpert = {
      ...xpert,
      profile_expertise: {
        ...xpert.profile_expertise,
        experiences: newExperiences,
      },
    };
    handleKeyChanges('profile_expertise', 'experiences');

    setXpert(newXpert);
    setExperienceSelected(newExperiences.length - 1);
  };

  const removeExperience = (index: number) => {
    if (xpert && xpert.profile_expertise) {
      const newExperiences = xpert.profile_expertise.experiences.filter(
        (_, i) => i !== index
      );
      const newXpert = {
        ...xpert,
        profile_expertise: {
          ...xpert.profile_expertise,
          experiences: newExperiences,
        },
      };
      handleKeyChanges('profile_expertise', 'experiences');

      setXpert(newXpert);
      newExperiences && setExperienceSelected(index - 1);
    }
  };

  const handleChangeLastExperience = (index: number) => {
    if (xpert && xpert.profile_expertise) {
      const newExperiences = xpert.profile_expertise.experiences.map((e) => ({
        ...e,
        is_last: 'false',
      }));
      newExperiences[index] = { ...newExperiences[index], is_last: 'true' };

      const newExperienceSorted = newExperiences.sort((a, b) => {
        if (a.is_last === 'true') return -1;
        if (b.is_last === 'true') return 1;
        return 0;
      });
      const newXpert = {
        ...xpert,
        profile_expertise: {
          ...xpert.profile_expertise,
          experiences: newExperienceSorted,
        },
      };
      handleKeyChanges('profile_expertise', 'experiences');

      setXpert(newXpert);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-spaceXSmall gap-y-spaceXXSmall">
        {experiences
          ?.sort((a, b) => {
            if (a.is_last === 'true') return -1;
            if (b.is_last === 'true') return 1;
            return 0;
          })
          ?.map((e, index) => {
            const selected = experienceSelected === index;
            const text =
              index == 0 ? 'Dernière expérience' : `Expérience ${index + 1}`;
            return (
              <Button
                onClick={() => setExperienceSelected(index)}
                key={e.id}
                className={cn(
                  'rounded-b-none px-spaceMedium text-md text-white shadow-none lg:w-fit',
                  { 'bg-inactive': !selected }
                )}
              >
                {text}
              </Button>
            );
          })}
        {experiences && experiences.length < 5 && (
          <Button
            onClick={addExperience}
            className="rounded-b-none px-spaceMedium text-md text-white lg:w-fit"
          >
            <Plus />
          </Button>
        )}
      </div>
      <div className="rounded-r-s bg-white p-spaceSmall shadow-container">
        {experiences?.map((experience, index) => {
          const isNotLastExperience = index !== experiences.length - 1;
          return (
            <div
              key={experience.id}
              className={cn('flex flex-col', {
                'invisible absolute': experienceSelected != index,
              })}
            >
              <div className="grid w-full grid-cols-1 flex-wrap items-center gap-spaceSmall 2xl:grid-cols-2">
                <CreatableSelect
                  creatable
                  label="Poste"
                  defaultValue={{
                    label:
                      getLabel({
                        value: experience.post ?? '',
                        select: posts,
                      }) ?? '',
                    value: experience.post ?? '',
                  }}
                  onChange={(e) => handleChangeSelect(e.value, 'post', index)}
                  optionsOther={experience.post_other}
                  options={
                    experience.post_other
                      ? [
                          ...posts,
                          {
                            label: experience.post_other,
                            value: experience.post_other,
                          },
                        ]
                      : posts
                  }
                />

                <Input
                  label="Entreprise"
                  value={experience.company ?? empty}
                  name="company"
                  onChange={(e) => handleChangeInput(e, index)}
                />

                <CreatableSelect
                  label={'Durée exercée'}
                  options={dureeSelect}
                  defaultValue={{
                    label:
                      getLabel({
                        value: experience.duree ?? '',
                        select: dureeSelect,
                      }) ?? '',
                    value: experience.duree ?? '',
                  }}
                  onChange={(e) => handleChangeSelect(e.value, 'duree', index)}
                />

                <CreatableSelect
                  options={booleanSelect}
                  defaultValue={{
                    label: String(experience.has_led_team) ?? '',
                    value: String(experience.has_led_team) ?? '',
                  }}
                  onChange={(e) =>
                    handleChangeSelect(e.value, 'has_led_team', index)
                  }
                  label={'A déjà dirigé une équipe ?'}
                />

                {experience.has_led_team == 'true' && (
                  <CreatableSelect
                    defaultValue={{
                      label:
                        getLabel({
                          value: experience.how_many_people_led ?? '',
                          select: howManyPeopleLedSelect,
                        }) ?? '',
                      value: experience.how_many_people_led ?? '',
                    }}
                    options={howManyPeopleLedSelect}
                    label={'Combien de personnes a-t-il dirigé ?'}
                    name={'how_many_people_led'}
                    onChange={(e) =>
                      handleChangeSelect(e.value, 'how_many_people_led', index)
                    }
                  />
                )}

                <CreatableSelect
                  name="sector"
                  creatable
                  label="Secteur d'activité"
                  defaultValue={{
                    label:
                      getLabel({
                        value: experience.sector ?? '',
                        select: sectorSelect,
                      }) ?? '',
                    value: experience.sector ?? '',
                  }}
                  onChange={(e) => handleChangeSelect(e.value, 'sector', index)}
                  optionsOther={experience.sector_other}
                  options={
                    experience.sector_other
                      ? [
                          ...sectorSelect,
                          {
                            label: experience.sector_other,
                            value: experience.sector_other,
                          },
                        ]
                      : sectorSelect
                  }
                />

                {experience.sector == 'energy' && (
                  <CreatableSelect
                    defaultValue={{
                      label:
                        getLabel({
                          value: experience.sector_energy ?? '',
                          select: energySelect,
                        }) ?? '',
                      value: experience.sector_energy ?? '',
                    }}
                    options={energySelect}
                    label={"Type d'énergie"}
                    onChange={(e) =>
                      handleChangeSelect(e.value, 'sector_energy', index)
                    }
                  />
                )}

                {experience.sector == 'renewable_energy' && (
                  <CreatableSelect
                    creatable
                    name="sector_renewable_energy"
                    label="Type d'énergie"
                    defaultValue={{
                      label:
                        getLabel({
                          value: experience.sector_renewable_energy ?? '',
                          select: energyRenewableSelect,
                        }) ?? '',
                      value: experience.sector_renewable_energy ?? '',
                    }}
                    onChange={(e) =>
                      handleChangeSelect(
                        e.value,
                        'sector_renewable_energy',
                        index
                      )
                    }
                    optionsOther={experience.sector_renewable_energy_other}
                    options={
                      experience.sector_renewable_energy_other
                        ? [
                            ...energyRenewableSelect,
                            {
                              label: experience.sector_renewable_energy_other,
                              value: experience.sector_renewable_energy_other,
                            },
                          ]
                        : energyRenewableSelect
                    }
                  />
                )}

                {experience.sector == 'waste_treatment' && (
                  <CreatableSelect
                    defaultValue={{
                      label:
                        getLabel({
                          value: experience.sector_waste_treatment ?? '',
                          select: wasteTreatmentSelect,
                        }) ?? '',
                      value: experience.sector_waste_treatment ?? '',
                    }}
                    options={wasteTreatmentSelect}
                    label={"Type d'énergie"}
                    onChange={(e) =>
                      handleChangeSelect(
                        e.value,
                        'sector_waste_treatment',
                        index
                      )
                    }
                  />
                )}

                {experience.sector == 'infrastructure' && (
                  <CreatableSelect
                    creatable
                    name="sector_infrastructure"
                    label="Type d'énergie"
                    defaultValue={{
                      label:
                        getLabel({
                          value: experience.sector_infrastructure ?? '',
                          select: infrastructureSelect,
                        }) ?? '',
                      value: experience.sector_infrastructure ?? '',
                    }}
                    onChange={(e) =>
                      handleChangeSelect(
                        e.value,
                        'sector_infrastructure',
                        index
                      )
                    }
                    optionsOther={experience.sector_infrastructure_other}
                    options={
                      experience.sector_infrastructure_other
                        ? [
                            ...infrastructureSelect,
                            {
                              label: experience.sector_infrastructure_other,
                              value: experience.sector_infrastructure_other,
                            },
                          ]
                        : infrastructureSelect
                    }
                  />
                )}

                <MultiCreatableSelect
                  name={'post_type'}
                  label={'Type de poste'}
                  defaultValue={experience.post_type?.map((post_type) => ({
                    label:
                      getLabel({ value: post_type, select: postTypesSelect }) ??
                      '',
                    value: post_type ?? '',
                  }))}
                  onChange={(selectedOption) =>
                    handleChangeMultiSelect(
                      selectedOption.map((option) => option.value),
                      'post_type',
                      index
                    )
                  }
                  options={postTypesSelect}
                />
                <Input
                  label="Commentaires"
                  value={experience.comments ?? empty}
                  name="comments"
                  onChange={(e) => handleChangeInput(e, index)}
                />
              </div>
              <Label
                key={`${experience.id}_last_exp`}
                htmlFor="last_exp"
                className="my-spaceContainer flex w-fit items-center gap-x-2 text-sm font-light lg:mb-0"
              >
                Ceci est sa dernière expérience
                <Checkbox
                  id="last_exp"
                  key={`${experience.id}_is_last_exp`}
                  className="scale-90 bg-white"
                  onClick={() => handleChangeLastExperience(index)}
                  checked={experience.is_last === 'true'}
                />
              </Label>
              <div className="flex items-center justify-end gap-x-spaceSmall">
                {/* {index !== 0 && ( */}
                <Button
                  variant={'ghost'}
                  className="mt-spaceSmall self-end bg-transparent px-0 text-important hover:bg-transparent lg:w-fit"
                  onClick={() => removeExperience(index)}
                >
                  Supprimer l'expérience
                </Button>
                {/* )} */}
                {isNotLastExperience && (
                  <Button
                    className="mt-spaceSmall self-end px-spaceSmall text-white lg:w-fit"
                    onClick={() => setExperienceSelected(index + 1)}
                  >
                    Suivant
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
