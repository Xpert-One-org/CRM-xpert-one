// components/mission/sections/MissionDetails.tsx
import Input from '@/components/inputs/Input';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import TextArea from '@/components/inputs/TextArea';
import { empty } from '@/data/constant';
import { profilSearchedSelect, postTypesSelect } from '@/data/mocked_select';
import { getLabel } from '@/utils/getLabel';
import { useSelect } from '@/store/select';
import { useEffect } from 'react';
import { useEditMissionStore } from '../../../editMissionStore';

export function MissionDetails() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  const {
    jobTitles,
    sectors,
    specialities,
    diplomas: diplomasSelect,
    languages: languagesSelect,
    expertises: expertisesSelect,
    fetchJobTitles,
    fetchSectors,
    fetchSpecialties,
    fetchExpertises,
    fetchDiplomas,
    fetchLanguages,
  } = useSelect();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchJobTitles(),
        fetchSpecialties(),
        fetchDiplomas(),
        fetchExpertises(),
        fetchLanguages(),
        fetchSectors(),
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
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-full max-w-[200px]"
          label="Profil recherché"
          value={
            getLabel({
              value: mission.profile_searched ?? '',
              select: profilSearchedSelect,
            }) ?? empty
          }
          onChange={(e) =>
            handleUpdateField('profile_searched', e.target.value)
          }
        />
        <Input
          className="w-full max-w-[280px]"
          label="Intitulé de mission"
          value={
            jobTitles.length
              ? (getLabel({
                  value: mission.job_title ?? '',
                  select: jobTitles,
                }) ?? empty)
              : loadingText
          }
          onChange={(e) => handleUpdateField('job_title', e.target.value)}
        />
        <MultiSelectComponent
          className="w-[280px]"
          label="Type de poste"
          name="post_type"
          defaultSelectedKeys={mission.post_type}
          onValueChange={(value) => handleUpdateField('post_type', value)}
          options={postTypesSelect}
        />
      </div>

      {/* Deuxième ligne */}
      <div className="gap flex w-full flex-row flex-wrap gap-4">
        <Input
          className="w-1/3"
          label="Secteur d'activité"
          value={
            sectors.length
              ? (getLabel({ value: mission.sector ?? '', select: sectors }) ??
                empty)
              : loadingText
          }
          onChange={(e) => handleUpdateField('sector', e.target.value)}
        />

        <MultiSelectComponent
          className="w-[280px]"
          label="Spécialité"
          name="specialties"
          placeholder={loadingText}
          defaultSelectedKeys={mission.specialties}
          onValueChange={(value) => handleUpdateField('specialties', value)}
          options={specialities ?? []}
        />

        {mission.specialties_other && (
          <TextArea
            className="w-1/3"
            label="Détails de la spécialité"
            value={mission.specialties_other}
            onChange={(e) =>
              handleUpdateField('specialties_other', e.target.value)
            }
          />
        )}

        <MultiSelectComponent
          className="w-[280px]"
          label="Expertise"
          name="expertises"
          placeholder={loadingText}
          defaultSelectedKeys={mission.expertises}
          onValueChange={(value) => handleUpdateField('expertises', value)}
          options={expertisesSelect ?? []}
        />

        {mission.expertises_other && (
          <TextArea
            className="w-1/3"
            label="Détails de l'expertise"
            value={mission.expertises_other}
            onChange={(e) =>
              handleUpdateField('expertises_other', e.target.value)
            }
          />
        )}
      </div>

      {/* Troisième ligne */}
      <div className="gap flex w-full flex-row gap-4">
        <MultiSelectComponent
          className="w-[280px]"
          label="Diplôme / Niveau d'étude"
          name="diplomas"
          placeholder={loadingText}
          defaultSelectedKeys={mission.diplomas}
          onValueChange={(value) => handleUpdateField('diplomas', value)}
          options={diplomasSelect ?? []}
        />

        {mission.diplomas_other && (
          <TextArea
            className="w-1/3"
            label="Détails du diplôme"
            value={mission.diplomas_other}
            onChange={(e) =>
              handleUpdateField('diplomas_other', e.target.value)
            }
          />
        )}

        <MultiSelectComponent
          className="w-[280px]"
          label="Langues"
          name="languages"
          placeholder={loadingText}
          defaultSelectedKeys={mission.languages}
          onValueChange={(value) => handleUpdateField('languages', value)}
          options={languagesSelect ?? []}
        />

        {mission.languages_other && (
          <TextArea
            className="w-1/3"
            label="Détails des langues"
            value={mission.languages_other}
            onChange={(e) =>
              handleUpdateField('languages_other', e.target.value)
            }
          />
        )}

        <Input
          className="w-1/3"
          label="TJM cible MAX"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
      </div>

      {/* Quatrième ligne */}
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-1/3"
          label="Poste ouvert aux situations de handicap"
          value={mission.open_to_disabled ?? 'Non renseigné'}
          onChange={(e) =>
            handleUpdateField('open_to_disabled', e.target.value)
          }
        />
      </div>
    </div>
  );
}
