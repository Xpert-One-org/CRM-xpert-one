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
} from '@/data/mocked_select';
import { useSelect } from '@/store/select';
import { useEditMissionStore } from '../../../editMissionStore';
import { ComboboxSelect } from '../../../../../mission/creation-de-mission/_components/ComboboxSelect';

export function MissionDetails() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  const {
    jobTitles,
    sectors,
    specialities,
    languages: languagesSelect,
    expertises: expertisesSelect,
    infrastructures: infrastructuresSelect,
    loadingJobTitles,
    loadingSectors,
    loadingSpecialties,
    loadingDiplomas,
    loadingLanguages,
    loadingExpertises,
    loadingInfrastructures,
    fetchJobTitles,
    fetchSectors,
    fetchSpecialties,
    fetchExpertises,
    fetchLanguages,
    fetchInfrastructures,
  } = useSelect();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchJobTitles(),
        fetchSectors(),
        fetchSpecialties(),
        fetchExpertises(),
        fetchLanguages(),
        fetchInfrastructures(),
      ]);
    };

    fetchData();
  }, []);

  if (!mission) return null;

  const loadingText = 'Chargement...';

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">
        Informations de mission
      </h3>

      {/* Première ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <SelectComponent
          className="w-[200px]"
          label="Profil recherché"
          options={profilSearchedSelect}
          defaultSelectedKeys={mission.profile_searched ?? ''}
          name="profile_searched"
          onValueChange={(value) =>
            handleUpdateField('profile_searched', value)
          }
        />

        <ComboboxSelect
          className="w-[280px]"
          label="Intitulé de mission"
          options={jobTitles}
          defaultSelectedKeys={mission.job_title}
          name="job_title"
          onValueChange={(value) => handleUpdateField('job_title', value)}
        />

        {mission.job_title === 'other' && (
          <Input
            label="Préciser l'intitulé"
            name="job_title_other"
            value={mission.job_title_other ?? ''}
            onChange={(e) =>
              handleUpdateField('job_title_other', e.target.value)
            }
            placeholder="Préciser votre intitulé de mission"
            className="w-[280px]"
          />
        )}

        <MultiSelectComponent
          className="w-[280px]"
          label="Type de poste"
          options={postTypesSelect}
          defaultSelectedKeys={mission.post_type}
          name="post_type"
          onValueChange={(value) => handleUpdateField('post_type', value)}
        />
      </div>

      {/* Deuxième ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <ComboboxSelect
          className="w-[280px]"
          label="Secteur d'activité"
          options={sectors}
          defaultSelectedKeys={mission.sector}
          name="sector"
          onValueChange={(value) => handleUpdateField('sector', value)}
        />

        {mission.sector === 'energy' && (
          <SelectComponent
            className="w-[280px]"
            label="Type d'énergie"
            options={energySelect}
            defaultSelectedKeys={mission.sector_energy ?? ''}
            name="sector_energy"
            onValueChange={(value) => handleUpdateField('sector_energy', value)}
          />
        )}

        {mission.sector === 'renewable_energy' && (
          <SelectComponent
            className="w-[280px]"
            label="Type d'énergie renouvelable"
            options={energyRenewableSelect}
            defaultSelectedKeys={mission.sector_renewable_energy ?? ''}
            name="sector_renewable_energy"
            onValueChange={(value) =>
              handleUpdateField('sector_renewable_energy', value)
            }
          />
        )}

        {mission.sector_renewable_energy === 'other' && (
          <Input
            label="Préciser l'énergie renouvelable"
            name="sector_renewable_energy_other"
            value={mission.sector_renewable_energy_other ?? ''}
            onChange={(e) =>
              handleUpdateField('sector_renewable_energy_other', e.target.value)
            }
            placeholder="Préciser votre énergie renouvelable"
            className="w-[280px]"
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
          <SelectComponent
            className="w-[280px]"
            label="Type d'infrastructure"
            options={infrastructuresSelect}
            defaultSelectedKeys={mission.sector_infrastructure ?? ''}
            name="sector_infrastructure"
            onValueChange={(value) =>
              handleUpdateField('sector_infrastructure', value)
            }
            disabled={loadingInfrastructures}
          />
        )}

        {mission.sector_infrastructure === 'other' && (
          <Input
            label="Préciser l'infrastructure"
            name="sector_infrastructure_other"
            value={mission.sector_infrastructure_other ?? ''}
            onChange={(e) =>
              handleUpdateField('sector_infrastructure_other', e.target.value)
            }
            placeholder="Préciser votre infrastructure"
            className="w-[280px]"
          />
        )}
      </div>

      {/* Troisième ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <MultiSelectComponent
          className="w-[280px]"
          label="Spécialité"
          options={specialities}
          defaultSelectedKeys={mission.specialties}
          name="specialties"
          onValueChange={(value) => handleUpdateField('specialties', value)}
          disabled={loadingSpecialties}
          placeholder={loadingSpecialties ? loadingText : 'Spécialités'}
        />

        {mission.specialties?.includes('others') && (
          <Input
            label="Préciser la spécialité"
            name="specialties_other"
            value={mission.specialties_other ?? ''}
            onChange={(e) =>
              handleUpdateField('specialties_other', e.target.value)
            }
            placeholder="Préciser la spécialité"
            className="w-[280px]"
          />
        )}

        <MultiSelectComponent
          className="w-[280px]"
          label="Expertise"
          options={expertisesSelect}
          defaultSelectedKeys={mission.expertises}
          name="expertises"
          onValueChange={(value) => handleUpdateField('expertises', value)}
          disabled={loadingExpertises}
          placeholder={loadingExpertises ? loadingText : 'Expertise'}
        />

        {mission.expertises?.includes('others') && (
          <Input
            label="Préciser l'expertise"
            name="expertises_other"
            value={mission.expertises_other ?? ''}
            onChange={(e) =>
              handleUpdateField('expertises_other', e.target.value)
            }
            placeholder="Préciser l'expertise"
            className="w-[280px]"
          />
        )}
      </div>

      {/* Quatrième ligne */}
      <div className="flex w-full flex-wrap gap-4">
        <MultiSelectComponent
          className="w-[280px]"
          label="Diplôme / Niveau d'étude"
          options={degreeSelect}
          defaultSelectedKeys={mission.diplomas}
          name="diplomas"
          onValueChange={(value) => handleUpdateField('diplomas', value)}
          disabled={loadingDiplomas}
          placeholder={loadingDiplomas ? loadingText : 'Diplômes'}
        />

        {mission.diplomas?.includes('other') && (
          <Input
            label="Préciser le diplôme"
            name="diplomas_other"
            value={mission.diplomas_other ?? ''}
            onChange={(e) =>
              handleUpdateField('diplomas_other', e.target.value)
            }
            placeholder="Préciser le diplôme"
            className="w-[280px]"
          />
        )}

        <MultiSelectComponent
          className="w-[280px]"
          label="Langues"
          options={languagesSelect}
          defaultSelectedKeys={mission.languages}
          name="languages"
          onValueChange={(value) => handleUpdateField('languages', value)}
          disabled={loadingLanguages}
          placeholder={loadingLanguages ? loadingText : 'Langues parlées'}
        />

        {mission.languages?.includes('other') && (
          <Input
            label="Préciser la langue"
            name="languages_other"
            value={mission.languages_other ?? ''}
            onChange={(e) =>
              handleUpdateField('languages_other', e.target.value)
            }
            placeholder="Préciser la langue"
            className="w-[280px]"
          />
        )}

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
