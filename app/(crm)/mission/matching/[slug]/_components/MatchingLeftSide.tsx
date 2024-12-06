'use client';

import React, { useEffect, useState } from 'react';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import AddIcon from '@/components/svg/AddIcon';
import { getLabel } from '@/utils/getLabel';
import { empty } from '@/data/constant';
import { useSelect } from '@/store/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import { useMatchingCriteriaStore } from '@/store/matchingCriteria';

export default function MatchingLeftSide({
  missionData,
}: {
  missionData: DBMission;
}) {
  const {
    excludedCriteria,
    additionalCriteria,
    setExcludedCriteria,
    setAdditionalCriteria,
    saveCriteria,
  } = useMatchingCriteriaStore();

  const [showAdditionalSelects, setShowAdditionalSelects] = useState({
    jobTitle: false,
    postType: false,
    sector: false,
    specialties: false,
    expertises: false,
    languages: false,
    diplomas: false,
  });

  const [criteriaIconShow, setCriteriaIconShow] = useState({
    jobTitle: false,
    postType: false,
    sector: false,
    specialties: false,
    expertises: false,
    languages: false,
    diplomas: false,
  });

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

  const handleAddClick = (criteriaType: keyof typeof showAdditionalSelects) => {
    setShowAdditionalSelects((prev) => ({
      ...prev,
      [criteriaType]: !prev[criteriaType],
    }));
    setCriteriaIconShow((prev) => ({
      ...prev,
      [criteriaType]: !prev[criteriaType],
    }));
  };

  const isExcludedCriteriaSelected = (type: string, value: string) => {
    return excludedCriteria[type] && excludedCriteria[type].includes(value);
  };

  const handleExcludedCriteriaClick = (type: string, value: string) => {
    setExcludedCriteria((prev) => {
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
      setHasChanges(true);
      return newSelected;
    });
  };

  const handleRemoveAdditionalCriteria = (
    type: string,
    valueToRemove: string
  ) => {
    setAdditionalCriteria((prev) => {
      const newCriteria = { ...prev };
      if (newCriteria[type]) {
        newCriteria[type] = newCriteria[type].filter(
          (value) => value !== valueToRemove
        );

        if (newCriteria[type].length === 0) {
          delete newCriteria[type];
        }
      }
      setHasChanges(true);
      return newCriteria;
    });
  };

  const handleAdditionalSelection = (type: string, values: string[]) => {
    setAdditionalCriteria((prev) => {
      const newCriteria = {
        ...prev,
        [type]: values,
      };
      setHasChanges(true);
      return newCriteria;
    });
  };
  const handleAvailabilityChange = (value: string) => {
    setAdditionalCriteria((prev) => {
      const newCriteria = {
        ...prev,
        availability: value === 'yes' ? ['yes'] : [],
      };
      setHasChanges(true);
      return newCriteria;
    });
  };

  return (
    <>
      <div className="flex w-full flex-col gap-y-spaceSmall">
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Poste
              {!criteriaIconShow.jobTitle ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('jobTitle')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('jobTitle')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <Box
              className={`relative cursor-pointer px-6 py-3 ${isExcludedCriteriaSelected('job_title', missionData.job_title ?? empty) ? 'bg-[#D64242] text-white' : ''}`}
              onClick={() =>
                handleExcludedCriteriaClick(
                  'job_title',
                  missionData.job_title ?? empty
                )
              }
            >
              {getLabel({
                value: missionData.job_title ?? empty,
                select: jobTitles,
              }) ?? empty}
              {isExcludedCriteriaSelected(
                'job_title',
                missionData.job_title ?? empty
              ) && (
                <div className="absolute right-1 top-1">
                  <X className="size-4" />
                </div>
              )}
            </Box>
            {additionalCriteria.job_title &&
              additionalCriteria.job_title.map((option) => (
                <Box
                  key={option}
                  className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                  onClick={() => {
                    handleRemoveAdditionalCriteria('job_title', option);
                  }}
                >
                  {getLabel({
                    value: option,
                    select: jobTitles,
                  }) ?? empty}
                  <div className="absolute right-1 top-1" onClick={() => {}}>
                    <X className="size-4" />
                  </div>
                </Box>
              ))}
          </div>
        </div>
        {showAdditionalSelects.jobTitle && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={jobTitles}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'job_title',
                  values as unknown as string[]
                )
              }
              name="job_title"
              defaultSelectedKeys={additionalCriteria.job_title || []}
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Type de poste
              {!criteriaIconShow.postType ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('postType')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('postType')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.post_type?.map((post) => (
              <Box
                key={post}
                className={`relative cursor-pointer px-6 py-3 ${isExcludedCriteriaSelected('post_type', post) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() => handleExcludedCriteriaClick('post_type', post)}
              >
                {getLabel({ value: post, select: posts })?.toUpperCase() ??
                  empty}
                {isExcludedCriteriaSelected('post_type', post) && (
                  <div className="absolute right-1 top-1">
                    <X className="size-4" />
                  </div>
                )}
              </Box>
            ))}
            {additionalCriteria.post_type &&
              additionalCriteria.post_type.map((option) => (
                <Box
                  key={option}
                  className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                  onClick={() => {
                    handleRemoveAdditionalCriteria('post_type', option);
                  }}
                >
                  {getLabel({
                    value: option,
                    select: posts,
                  })?.toUpperCase() ?? empty}
                  <div className="absolute right-1 top-1" onClick={() => {}}>
                    <X className="size-4" />
                  </div>
                </Box>
              ))}
          </div>
        </div>
        {showAdditionalSelects.postType && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={posts}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'post_type',
                  values as unknown as string[]
                )
              }
              name="post_type"
              defaultSelectedKeys={additionalCriteria.post_type || []}
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Secteur d’activité
              {!criteriaIconShow.sector ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('sector')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('sector')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            <Box
              className={`relative cursor-pointer px-6 py-3 ${isExcludedCriteriaSelected('sector', missionData.sector ?? empty) ? 'bg-[#D64242] text-white' : ''}`}
              onClick={() =>
                handleExcludedCriteriaClick(
                  'sector',
                  missionData.sector ?? empty
                )
              }
            >
              {getLabel({
                value: missionData.sector ?? empty,
                select: sectors,
              }) ?? empty}
              {isExcludedCriteriaSelected(
                'sector',
                missionData.sector ?? empty
              ) && (
                <div className="absolute right-1 top-1">
                  <X className="size-4" />
                </div>
              )}
            </Box>
            {additionalCriteria.sector &&
              additionalCriteria.sector.map((option) => (
                <Box
                  key={option}
                  className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                  onClick={() => {
                    handleRemoveAdditionalCriteria('sector', option);
                  }}
                >
                  {getLabel({
                    value: option,
                    select: sectors,
                  }) ?? empty}
                  <div className="absolute right-1 top-1" onClick={() => {}}>
                    <X className="size-4" />
                  </div>
                </Box>
              ))}
          </div>
        </div>
        {showAdditionalSelects.sector && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={sectors}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'sector',
                  values as unknown as string[]
                )
              }
              name="sector"
              defaultSelectedKeys={additionalCriteria.sector || []}
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Spécialité
              {!criteriaIconShow.specialties ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('specialties')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('specialties')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.specialties?.map((specialty) => (
              <Box
                key={specialty}
                className={`relative cursor-pointer px-6 py-3 ${isExcludedCriteriaSelected('specialties', specialty) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() =>
                  handleExcludedCriteriaClick('specialties', specialty)
                }
              >
                {getLabel({ value: specialty, select: specialitiesSelect }) ??
                  empty}
                {isExcludedCriteriaSelected('specialties', specialty) && (
                  <div className="absolute right-1 top-1">
                    <X className="size-4" />
                  </div>
                )}
              </Box>
            ))}
            {additionalCriteria.specialties &&
              additionalCriteria.specialties.map((option) => (
                <Box
                  key={option}
                  className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                  onClick={() => {
                    handleRemoveAdditionalCriteria('specialties', option);
                  }}
                >
                  {getLabel({
                    value: option,
                    select: specialitiesSelect,
                  }) ?? empty}
                  <div className="absolute right-1 top-1" onClick={() => {}}>
                    <X className="size-4" />
                  </div>
                </Box>
              ))}
          </div>
        </div>
        {showAdditionalSelects.specialties && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={specialitiesSelect}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'specialties',
                  values as unknown as string[]
                )
              }
              name="specialties"
              defaultSelectedKeys={additionalCriteria.specialties || []}
              className="w-full"
            />
          </div>
        )}
        {/* <div className="flex w-full gap-6">
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
        </div> */}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Expertise
              {!criteriaIconShow.expertises ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('expertises')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('expertises')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.expertises?.map((expertise) => (
              <Box
                key={expertise}
                className={`relative cursor-pointer px-6 py-3 ${isExcludedCriteriaSelected('expertises', expertise) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() =>
                  handleExcludedCriteriaClick('expertises', expertise)
                }
              >
                {getLabel({ value: expertise, select: expertises }) ?? empty}
                {isExcludedCriteriaSelected('expertises', expertise) && (
                  <div className="absolute right-1 top-1">
                    <X className="size-4" />
                  </div>
                )}
              </Box>
            ))}
            {additionalCriteria.expertises &&
              additionalCriteria.expertises.map((option) => (
                <Box
                  key={option}
                  className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                  onClick={() => {
                    handleRemoveAdditionalCriteria('expertises', option);
                  }}
                >
                  {getLabel({
                    value: option,
                    select: expertises,
                  }) ?? empty}
                  <div className="absolute right-1 top-1" onClick={() => {}}>
                    <X className="size-4" />
                  </div>
                </Box>
              ))}
          </div>
        </div>
        {showAdditionalSelects.expertises && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={expertises}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'expertises',
                  values as unknown as string[]
                )
              }
              name="expertises"
              defaultSelectedKeys={additionalCriteria.expertises || []}
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Disponibilité durant la mission
            </Box>
          </div>
          <div>
            <Box
              className={`p-3 ${
                additionalCriteria.availability?.length > 0
                  ? 'bg-[#FBBE40] text-white'
                  : ''
              }`}
              isSelectable
              options={actionOptions}
              onValueChange={handleAvailabilityChange}
            >
              {additionalCriteria.availability?.length > 0 ? 'OUI' : 'NON'}
            </Box>
          </div>
        </div>
        {/* <div className="flex w-full gap-6">
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
        </div> */}
        {/* <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">Management</Box>
          </div>
          <div>
            <Box className="p-3" isSelectable options={actionOptions}>
              {'OUI'}
            </Box>
          </div>
        </div> */}
        {/* <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Zone géographique
              {!criteriaIconShow.location ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('location')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('location')}
                />
              )}
            </Box>
          </div>
          <div>
            <Box className="p-3">{missionData.country ?? empty}</Box>
          </div>
        </div> */}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Langues
              {!criteriaIconShow.languages ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('languages')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('languages')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.languages?.map((language) => (
              <Box
                key={language}
                className={`relative cursor-pointer px-6 py-3 ${isExcludedCriteriaSelected('languages', language) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() =>
                  handleExcludedCriteriaClick('languages', language)
                }
              >
                {getLabel({ value: language, select: languages }) ?? empty}
                {isExcludedCriteriaSelected('languages', language) && (
                  <div className="absolute right-1 top-1">
                    <X className="size-4" />
                  </div>
                )}
              </Box>
            ))}
            {additionalCriteria.languages &&
              additionalCriteria.languages.map((option) => (
                <Box
                  key={option}
                  className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                  onClick={() => {
                    handleRemoveAdditionalCriteria('languages', option);
                  }}
                >
                  {getLabel({
                    value: option,
                    select: languages,
                  }) ?? empty}
                  <div className="absolute right-1 top-1" onClick={() => {}}>
                    <X className="size-4" />
                  </div>
                </Box>
              ))}
          </div>
        </div>
        {showAdditionalSelects.languages && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={languages}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'languages',
                  values as unknown as string[]
                )
              }
              name="languages"
              defaultSelectedKeys={additionalCriteria.languages || []}
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Diplômes
              {!criteriaIconShow.diplomas ? (
                <AddIcon
                  width={20}
                  height={20}
                  className="rounded bg-primary p-1 hover:cursor-pointer"
                  onClick={() => handleAddClick('diplomas')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('diplomas')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {missionData.diplomas?.map((diploma) => (
              <Box
                key={diploma}
                className={`relative cursor-pointer px-6 py-3 ${isExcludedCriteriaSelected('diplomas', diploma) ? 'bg-[#D64242] text-white' : ''}`}
                onClick={() => handleExcludedCriteriaClick('diplomas', diploma)}
              >
                {getLabel({ value: diploma, select: diplomas }) ?? empty}
                {isExcludedCriteriaSelected('diplomas', diploma) && (
                  <div className="absolute right-1 top-1">
                    <X className="size-4" />
                  </div>
                )}
              </Box>
            ))}
            {additionalCriteria.diplomas &&
              additionalCriteria.diplomas.map((option) => (
                <Box
                  key={option}
                  className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                  onClick={() => {
                    handleRemoveAdditionalCriteria('diplomas', option);
                  }}
                >
                  {getLabel({
                    value: option,
                    select: diplomas,
                  }) ?? empty}
                  <div className="absolute right-1 top-1" onClick={() => {}}>
                    <X className="size-4" />
                  </div>
                </Box>
              ))}
          </div>
        </div>
        {showAdditionalSelects.diplomas && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={diplomas}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'diplomas',
                  values as unknown as string[]
                )
              }
              name="diplomas"
              defaultSelectedKeys={additionalCriteria.diplomas || []}
              className="w-full"
            />
          </div>
        )}
        {/* <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              TJM cible MAX
            </Box>
          </div>
          <div>
            <Box className="p-3">{missionData.tjm ?? empty}</Box>
          </div>
        </div> */}
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
        {/* <div className="flex w-full gap-6">
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
        </div> */}
      </div>

      {hasChanges && (
        <div className="fixed bottom-10 right-10">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={() => {
              saveCriteria(missionData.mission_number ?? '');
              setHasChanges(false);
            }}
          >
            Enregistrer
          </Button>
        </div>
      )}
    </>
  );
}
