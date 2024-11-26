import React, { useEffect, useState } from 'react';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import AddIcon from '@/components/svg/AddIcon';
import { getLabel } from '@/utils/getLabel';
import { empty } from '@/data/constant';
import { useSelect } from '@/store/select';
import { Button } from '@/components/ui/button';

export default function MatchingLeftSide({
  missionData,
  onCriteriaChange,
}: {
  missionData: DBMission;
  onCriteriaChange: (criteria: Record<string, string[]>) => void;
}) {
  const [selectedCriteria, setSelectedCriteria] = useState<
    Record<string, string[]>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  const {
    jobTitles,
    posts,
    expertises,
    specialities: specialitiesSelect,
    sectors,
    languages,
    diplomas,
    fetchJobTitles,
    fetchPosts,
    fetchSpecialties,
    fetchExpertises,
    fetchSectors,
    fetchLanguages,
    fetchDiplomas,
  } = useSelect();

  useEffect(() => {
    fetchJobTitles();
    fetchPosts();
    fetchSpecialties();
    fetchExpertises();
    fetchSectors();
    fetchLanguages();
    fetchDiplomas();
  }, [
    fetchJobTitles,
    fetchPosts,
    fetchSpecialties,
    fetchExpertises,
    fetchSectors,
    fetchLanguages,
    fetchDiplomas,
  ]);

  const seniorityOptions = [
    { label: '1 an', value: '1' },
    { label: '2 ans', value: '2' },
    { label: '3 ans', value: '3' },
  ];

  const actionOptions = [
    { label: 'OUI', value: 'yes' },
    { label: 'NON', value: 'no' },
  ];

  const handleCriteriaClick = (type: string, value: string) => {
    setSelectedCriteria((prev) => {
      const newSelected = { ...prev };
      if (!newSelected[type]) {
        newSelected[type] = [];
      }

      const index = newSelected[type].indexOf(value);
      if (index > -1) {
        newSelected[type] = newSelected[type].filter((v) => v !== value);

        if (newSelected[type].length === 0) {
          delete newSelected[type];
        }
      } else {
        newSelected[type] = [...(newSelected[type] || []), value];
      }

      const hasRemainingChanges = Object.values(newSelected).some(
        (arr) => arr.length > 0
      );
      setHasChanges(hasRemainingChanges);
      onCriteriaChange(newSelected);

      return newSelected;
    });
  };

  const handleSave = async () => {
    setSelectedCriteria({});
    setHasChanges(false);
    onCriteriaChange({});
  };

  const isCriteriaSelected = (type: string, value: string) => {
    return selectedCriteria[type] && selectedCriteria[type].includes(value);
  };

  return (
    <>
      <div className="flex w-full flex-col gap-y-spaceSmall">
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Poste
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <Box
              className={`cursor-pointer p-3 ${isCriteriaSelected('job_title', missionData.job_title ?? empty) ? 'bg-[#D64242] text-white' : ''}`}
              onClick={() =>
                handleCriteriaClick('job_title', missionData.job_title ?? empty)
              }
            >
              {getLabel({
                value: missionData.job_title ?? empty,
                select: jobTitles,
              }) ?? empty}
            </Box>
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Type de poste
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.post_type?.map((post) => (
              <Box
                key={post}
                className={`cursor-pointer p-3 ${isCriteriaSelected('post_type', post) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() => handleCriteriaClick('post_type', post)}
              >
                {getLabel({ value: post, select: posts })?.toUpperCase() ??
                  empty}
              </Box>
            ))}
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Secteur d’activité
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <Box
              className={`cursor-pointer p-3 ${isCriteriaSelected('sector', missionData.sector ?? empty) ? 'bg-[#D64242] text-white' : ''}`}
              onClick={() =>
                handleCriteriaClick('sector', missionData.sector ?? empty)
              }
            >
              {getLabel({
                value: missionData.sector ?? empty,
                select: sectors,
              }) ?? empty}
            </Box>
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Spécialité
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.specialties?.map((specialty) => (
              <Box
                key={specialty}
                className={`cursor-pointer p-3 ${isCriteriaSelected('specialties', specialty) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() => handleCriteriaClick('specialties', specialty)}
              >
                {getLabel({ value: specialty, select: specialitiesSelect }) ??
                  empty}
              </Box>
            ))}
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Séniorité en année
            </Box>
          </div>
          <div>
            <Box className="p-3" isSelectable options={seniorityOptions}>
              {'1'}
            </Box>
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Expertise
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.expertises?.map((expertise) => (
              <Box
                key={expertise}
                className={`cursor-pointer p-3 ${isCriteriaSelected('expertises', expertise) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() => handleCriteriaClick('expertises', expertise)}
              >
                {getLabel({ value: expertise, select: expertises }) ?? empty}
              </Box>
            ))}
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Disponibilité durant la mission
            </Box>
          </div>
          <div>
            <Box className="p-3" isSelectable options={actionOptions}>
              {'OUI'}
            </Box>
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              En recherche active ?
            </Box>
          </div>
          <div>
            <Box className="p-3" isSelectable options={actionOptions}>
              {'NON'}
            </Box>
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">Management</Box>
          </div>
          <div>
            <Box className="p-3" isSelectable options={actionOptions}>
              {'OUI'}
            </Box>
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Zone géographique
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div>
            <Box className="p-3">{missionData.country ?? empty}</Box>
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Langues
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.languages?.map((language) => (
              <Box
                key={language}
                className={`cursor-pointer p-3 ${isCriteriaSelected('languages', language) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() => handleCriteriaClick('languages', language)}
              >
                {getLabel({ value: language, select: languages }) ?? empty}
              </Box>
            ))}
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Diplômes
              <AddIcon
                width={20}
                height={20}
                className="rounded bg-primary p-1 hover:cursor-pointer"
                onClick={() => {}}
              />
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.diplomas?.map((diploma) => (
              <Box
                key={diploma}
                className={`cursor-pointer p-3 ${isCriteriaSelected('diplomas', diploma) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() => handleCriteriaClick('diplomas', diploma)}
              >
                {getLabel({ value: diploma, select: diplomas }) ?? empty}
              </Box>
            ))}
          </div>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              TJM cible MAX
            </Box>
          </div>
          <div>
            <Box className="p-3">{missionData.tjm ?? empty}</Box>
          </div>
        </div>
        {/* <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Évaluation de l’XPERT
            </Box>
          </div>
          <div>
            <Box className="p-3" isSelectable>
              {'non évalué'}
            </Box>
          </div>
        </div> */}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Travailleurs handicapés ?
            </Box>
          </div>
          <div>
            <Box className="p-3" isSelectable options={actionOptions}>
              {'OUI'}
            </Box>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-10 right-10">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={handleSave}
          >
            Enregistrer
          </Button>
        </div>
      )}
    </>
  );
}
