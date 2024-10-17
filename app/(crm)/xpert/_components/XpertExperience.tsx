import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/inputs/MultiSelectComponent';
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
  postTypesSelect,
  wasteTreatmentSelect,
} from '@/data/mocked_select';
import { profileDataExperience } from '@/data/profile';
import { cn } from '@/lib/utils';
import { useSelect } from '@/store/select';
import { UserType } from '@/types/types';
import type { DBXpert } from '@/types/typesDb';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function XpertExperience({ xpert }: { xpert: DBXpert }) {
  const { experiences } = xpert.profile_expertise ?? {};
  const [experienceSelected, setExperienceSelected] = useState(0);
  const {
    posts,
    sectors,
    infrastructures,
    fetchPosts,
    fetchSectors,
    fetchInfrastructures,
  } = useSelect();
  useEffect(() => {
    fetchPosts();
    fetchSectors();
    fetchInfrastructures();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-spaceXSmall gap-y-spaceXXSmall">
        {experiences?.map((e, index) => {
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
        {/* {experiences && experiences.length < 5 && (
          <Button
            onClick={() => ({})}
            className="px-spaceMedium text-md text-white lg:w-fit rounded-b-none"
            >
            <Plus />
          </Button>
        )} */}
      </div>
      <div className="rounded-r-s bg-white p-spaceSmall shadow-container">
        {experiences?.map((experience, index) => {
          const isNotLastExperience = index !== experiences.length - 1;
          const isNotFirstExperience = index !== 0;
          return (
            <div
              key={experience.id}
              className={cn('flex flex-col', {
                'invisible absolute': experienceSelected != index,
              })}
            >
              <div className="grid w-full grid-cols-1 flex-wrap items-center gap-spaceSmall 2xl:grid-cols-2">
                <SelectComponent
                  className="xpertise_input xl:max-w-full"
                  options={posts}
                  placeholder={experience.post ?? 'Choisir'}
                  defaultSelectedKeys={experience.post ?? empty}
                  label={profileDataExperience.post?.label}
                  name={profileDataExperience.post?.name as string}
                  onValueChange={() => ({})}
                  disabled
                />

                {experience.post === 'other' && (
                  <Input
                    name={profileDataExperience.post_other?.name}
                    label={profileDataExperience.post_other?.label}
                    className="xpertise_input sm:min-w-[280px] xl:max-w-full"
                    disabled
                    defaultValue={experience.post_other ?? empty}
                    placeholder="Précisez votre poste"
                    onChange={() => ({})}
                  />
                )}

                <Input
                  name={profileDataExperience.company?.name}
                  label={profileDataExperience.company?.label}
                  className="xpertise_input"
                  disabled
                  defaultValue={experience.company ?? empty}
                  placeholder="Nom de l'entreprise"
                  onChange={() => ({})}
                />
                <SelectComponent
                  className="xpertise_input xl:max-w-full"
                  defaultSelectedKeys={experience.duree ?? empty}
                  options={dureeSelect}
                  disabled
                  label={profileDataExperience.duree?.label}
                  placeholder="Choisir"
                  name={profileDataExperience.duree?.name as string}
                  onValueChange={() => ({})}
                />

                <SelectComponent
                  className="xpertise_input xl:max-w-full"
                  defaultSelectedKeys={String(experience.has_led_team)}
                  placeholder="Choisir"
                  disabled
                  label={profileDataExperience.has_led_team?.label}
                  name={profileDataExperience.has_led_team?.name as string}
                  onValueChange={() => ({})}
                  options={booleanSelect}
                />

                {experience.has_led_team == 'true' && (
                  <SelectComponent
                    className="xpertise_input xl:max-w-full"
                    defaultSelectedKeys={
                      experience.how_many_people_led ?? empty
                    }
                    disabled
                    options={howManyPeopleLedSelect}
                    label={profileDataExperience.how_many_people_led?.label}
                    name={
                      profileDataExperience.how_many_people_led?.name as string
                    }
                    onValueChange={() => ({})}
                  />
                )}

                <SelectComponent
                  className="xpertise_input xl:max-w-full"
                  defaultSelectedKeys={experience.sector ?? empty}
                  placeholder={experience.sector ?? 'Choisir'}
                  options={sectors}
                  label={profileDataExperience.sector?.label}
                  name={profileDataExperience.sector?.name as string}
                  onValueChange={() => ({})}
                  disabled={true}
                />
                {experience.sector === 'others' && (
                  <Input
                    // key={`index_${experience.post_other}`}
                    name={profileDataExperience.sector_other?.name}
                    label={profileDataExperience.sector_other?.label}
                    className="xpertise_input flex-1 sm:min-w-[280px] xl:max-w-full"
                    disabled
                    defaultValue={experience.sector_other ?? empty}
                    placeholder="Précisez votre secteur d'activité"
                    onChange={() => ({})}
                  />
                )}

                {experience.sector == 'energy' && (
                  <SelectComponent
                    className="xpertise_input xl:max-w-full"
                    defaultSelectedKeys={experience.sector_energy ?? empty}
                    placeholder="Choisir"
                    disabled
                    options={energySelect}
                    label={profileDataExperience.sector_energy?.label}
                    name={profileDataExperience.sector_energy?.name as string}
                    onValueChange={() => ({})}
                  />
                )}

                {experience.sector == 'renewable_energy' && (
                  <SelectComponent
                    className="xpertise_input xl:max-w-full"
                    defaultSelectedKeys={
                      experience.sector_renewable_energy ?? empty
                    }
                    placeholder="Choisir"
                    disabled
                    options={energyRenewableSelect}
                    label={profileDataExperience.sector_renewable_energy?.label}
                    name={
                      profileDataExperience.sector_renewable_energy
                        ?.name as string
                    }
                    onValueChange={() => ({})}
                  />
                )}

                {experience.sector_renewable_energy === 'other' && (
                  <Input
                    name={
                      profileDataExperience.sector_renewable_energy_other?.name
                    }
                    label={
                      profileDataExperience.sector_renewable_energy_other?.label
                    }
                    className="xpertise_input flex-1 sm:min-w-[280px] xl:max-w-full"
                    disabled
                    defaultValue={
                      experience.sector_renewable_energy_other ?? empty
                    }
                    placeholder="Précisez votre énergie renouvelable"
                    onChange={() => ({})}
                  />
                )}

                {experience.sector == 'waste_treatment' && (
                  <SelectComponent
                    className="xpertise_input xl:max-w-full"
                    disabled
                    defaultSelectedKeys={
                      experience.sector_waste_treatment ?? empty
                    }
                    placeholder="Choisir"
                    options={wasteTreatmentSelect}
                    label={profileDataExperience.sector_waste_treatment?.label}
                    name={
                      profileDataExperience.sector_waste_treatment
                        ?.name as string
                    }
                    onValueChange={() => ({})}
                  />
                )}

                {experience.sector == 'infrastructure' && (
                  <SelectComponent
                    className="xpertise_input xl:max-w-full"
                    defaultSelectedKeys={
                      experience.sector_infrastructure ?? empty
                    }
                    placeholder={experience.sector_infrastructure ?? 'Choisir'}
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
                {experience.sector_infrastructure === 'other' && (
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
                      experience.sector_infrastructure_other ?? empty
                    }
                    placeholder="Précisez votre infrastructure"
                    onChange={() => ({})}
                  />
                )}

                <MultiSelectComponent
                  options={postTypesSelect}
                  className="xpertise_input xl:max-w-full"
                  defaultSelectedKeys={experience.post_type ?? []}
                  placeholder="Choisir"
                  label={profileDataExperience.post_type?.label}
                  name={profileDataExperience.post_type?.name as string}
                  disabled
                  onValueChange={() => ({})}
                />
                <Input
                  defaultValue={experience.comments ?? empty}
                  label={profileDataExperience.comments?.label}
                  disabled
                  name={profileDataExperience.comments?.name}
                  placeholder="Commentaires"
                  className="flex-1 xl:max-w-full"
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
                  disabled={true}
                  checked={index === 0}
                />
              </Label>
              <div className="flex items-center justify-end gap-x-spaceSmall">
                {/* {isNotFirstExperience && (
                  <Button
                    className="text-important mt-spaceSmall self-end bg-transparent px-0 lg:w-fit"
                    onClick={() => ({})}
                  >
                    Supprimer l'expérience
                  </Button>
                )} */}
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
