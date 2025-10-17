'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@/components/ui/box';
import AddIcon from '@/components/svg/AddIcon';
import { Check, X } from 'lucide-react';
import { useSelect } from '@/store/select';
import MultiSelectComponent from '@/components/MultiSelectComponent';
import { useMatchingCriteriaStore } from '@/store/matchingCriteria';
import { getLabel } from '@/utils/getLabel';
import { empty } from '@/data/constant';
import { Button } from '@/components/ui/button';

import Input from '@/components/inputs/Input';
import {
  expertiseSelect,
  jobTitleSelect,
  posts,
  sectorSelect,
  specialitySelect,
} from '@/data/mocked_select';
import { AuthContext } from '@/components/auth/AuthProvider';

export default function MatchingLeftSideSecond({
  missionNumber,
}: {
  missionNumber: string;
}) {
  const { isIntern } = useContext(AuthContext);

  const { additionalCriteria, setAdditionalCriteria, saveCriteria } =
    useMatchingCriteriaStore();

  const [showAdditionalSelects, setShowAdditionalSelects] = useState({
    jobTitle: false,
    postType: false,
    sector: false,
    specialties: false,
    expertises: false,
    firstname: false,
    xpert_id: false,
    lastname: false,
    country: false,
    region: false,
  });

  const [criteriaIconShow, setCriteriaIconShow] = useState({
    jobTitle: false,
    postType: false,
    sector: false,
    specialties: false,
    expertises: false,
    firstname: false,
    xpert_id: false,
    lastname: false,
    country: false,
    region: false,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [addingFirstname, setAddingFirstname] = useState('');
  const [addingLastname, setAddingLastname] = useState('');
  const [addingXpertId, setAddingXpertId] = useState('');
  const { regions, countries, fetchRegions, fetchCountries } = useSelect();

  useEffect(() => {
    fetchRegions();
    fetchCountries();
  }, [fetchRegions, fetchCountries]);

  const handleAddClick = (criteriaType: keyof typeof showAdditionalSelects) => {
    if (isIntern) return;
    setShowAdditionalSelects((prev) => ({
      ...prev,
      [criteriaType]: !prev[criteriaType],
    }));
    setCriteriaIconShow((prev) => ({
      ...prev,
      [criteriaType]: !prev[criteriaType],
    }));
  };

  const handleRemoveAdditionalCriteria = (
    type: string,
    valueToRemove: string
  ) => {
    setAdditionalCriteria((prev) => {
      const newCriteria = { ...prev };
      if (newCriteria[`secondary_${type}`]) {
        newCriteria[`secondary_${type}`] = newCriteria[
          `secondary_${type}`
        ].filter((value) => value !== valueToRemove);

        if (newCriteria[`secondary_${type}`].length === 0) {
          delete newCriteria[`secondary_${type}`];
        }
      }
      setHasChanges(true);
      return newCriteria;
    });
  };

  const handleAdditionalSelection = (type: string, values: string[]) => {
    if (isIntern) return;
    setAdditionalCriteria((prev) => {
      const newCriteria = {
        ...prev,
        [`secondary_${type}`]: values,
      };
      setHasChanges(true);
      return newCriteria;
    });
  };

  return (
    <>
      <div className="flex w-1/2 flex-col gap-y-spaceSmall">
        <div>
          <div className="mb-1 h-px w-full bg-black"></div>
          <h2 className="text-lg font-medium text-black">
            Recherche supplémentaire
          </h2>
          <p className="text-sm font-light text-black">
            Missions recherchées par les XPERTS
          </p>
        </div>
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Prénom
              {!criteriaIconShow.firstname ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('firstname')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('firstname')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {additionalCriteria.secondary_firstname?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('firstname', option);
                }}
              >
                {option}
                <div className="absolute right-1 top-1" onClick={() => {}}>
                  <X className="size-4" />
                </div>
              </Box>
            ))}
          </div>
        </div>
        {showAdditionalSelects.firstname && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <Input
              onChange={(e) => setAddingFirstname(e.target.value)}
              value={addingFirstname}
            />
            <Button
              className="h-full rounded-sm bg-primary p-2 text-white"
              onClick={() => {
                handleAdditionalSelection('firstname', [addingFirstname]),
                  setAddingFirstname('');
              }}
            >
              <Check size={20} />
            </Button>
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Nom
              {!criteriaIconShow.lastname ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('lastname')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('lastname')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {additionalCriteria.secondary_lastname?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('lastname', option);
                }}
              >
                {option}
                <div className="absolute right-1 top-1" onClick={() => {}}>
                  <X className="size-4" />
                </div>
              </Box>
            ))}
          </div>
        </div>
        {showAdditionalSelects.lastname && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <Input
              onChange={(e) => setAddingLastname(e.target.value)}
              value={addingLastname}
            />
            <Button
              className="h-full rounded-sm bg-primary p-2 text-white"
              onClick={(e) => {
                handleAdditionalSelection('lastname', [addingLastname]),
                  setAddingLastname('');
              }}
            >
              <Check size={20} />
            </Button>
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              N° XPERT
              {!criteriaIconShow.xpert_id ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('xpert_id')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('xpert_id')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {additionalCriteria.secondary_xpert_id?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('xpert_id', option);
                }}
              >
                {option}
                <div className="absolute right-1 top-1" onClick={() => {}}>
                  <X className="size-4" />
                </div>
              </Box>
            ))}
          </div>
        </div>
        {showAdditionalSelects.xpert_id && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <Input
              onChange={(e) => setAddingXpertId(e.target.value)}
              value={addingXpertId}
            />
            <Button
              className="h-full rounded-sm bg-primary p-2 text-white"
              onClick={(e) => {
                handleAdditionalSelection('xpert_id', [addingXpertId]),
                  setAddingXpertId('');
              }}
            >
              <Check size={20} />
            </Button>
          </div>
        )}

        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Poste
              {!criteriaIconShow.jobTitle ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('jobTitle')}
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
            {additionalCriteria.secondary_job_title?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('job_title', option);
                }}
              >
                {getLabel({
                  value: option,
                  select: jobTitleSelect,
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
              options={jobTitleSelect}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'job_title',
                  values as unknown as string[]
                )
              }
              name="secondary_job_title"
              defaultSelectedKeys={additionalCriteria.secondary_job_title || []}
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
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('postType')}
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
            {additionalCriteria.secondary_post_type?.map((option) => (
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
                <div className="absolute right-1 top-1">
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
              name="secondary_post_type"
              defaultSelectedKeys={additionalCriteria.secondary_post_type || []}
              className="w-full"
            />
          </div>
        )}

        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Secteur d'activité
              {!criteriaIconShow.sector ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('sector')}
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
            {additionalCriteria.secondary_sector?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('sector', option);
                }}
              >
                {getLabel({
                  value: option,
                  select: sectorSelect,
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
              options={sectorSelect}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'sector',
                  values as unknown as string[]
                )
              }
              name="secondary_sector"
              defaultSelectedKeys={additionalCriteria.secondary_sector || []}
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
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('specialties')}
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
            {additionalCriteria.secondary_specialties?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('specialties', option);
                }}
              >
                {getLabel({
                  value: option,
                  select: specialitySelect,
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
              options={specialitySelect}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'specialties',
                  values as unknown as string[]
                )
              }
              name="secondary_specialties"
              defaultSelectedKeys={
                additionalCriteria.secondary_specialties || []
              }
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Expertise
              {!criteriaIconShow.expertises ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('expertises')}
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
            {additionalCriteria.secondary_expertises?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('expertises', option);
                }}
              >
                {getLabel({
                  value: option,
                  select: expertiseSelect,
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
              options={expertiseSelect}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'expertises',
                  values as unknown as string[]
                )
              }
              name="secondary_expertises"
              defaultSelectedKeys={
                additionalCriteria.secondary_expertises || []
              }
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Pays
              {!criteriaIconShow.country ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('country')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('country')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {additionalCriteria.secondary_country?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('country', option);
                }}
              >
                {getLabel({
                  value: option,
                  select: countries,
                }) ?? empty}
                <div className="absolute right-1 top-1" onClick={() => {}}>
                  <X className="size-4" />
                </div>
              </Box>
            ))}
          </div>
        </div>
        {showAdditionalSelects.country && (
          <div className="flex max-w-[300px] items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
            <MultiSelectComponent
              options={countries}
              onValueChange={(values) =>
                handleAdditionalSelection(
                  'country',
                  values as unknown as string[]
                )
              }
              name="secondary_country"
              defaultSelectedKeys={additionalCriteria.secondary_country || []}
              className="w-full"
            />
          </div>
        )}
        <div className="flex w-full gap-6">
          <div className="min-w-[300px]">
            <Box className="justify-between bg-[#D0DDE1] p-3">
              Région
              {!criteriaIconShow.region ? (
                <AddIcon
                  width={20}
                  height={20}
                  className={`rounded bg-primary p-1 ${
                    isIntern
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:cursor-pointer'
                  }`}
                  onClick={() => !isIntern && handleAddClick('region')}
                />
              ) : (
                <X
                  width={20}
                  height={20}
                  strokeWidth={6}
                  className="rounded bg-primary p-1 text-white hover:cursor-pointer"
                  onClick={() => handleAddClick('region')}
                />
              )}
            </Box>
          </div>
          <div className="flex flex-wrap gap-[10px]">
            {additionalCriteria.secondary_region?.map((option) => (
              <Box
                key={option}
                className="relative cursor-pointer bg-[#FBBE40] p-3 px-6 text-white"
                onClick={() => {
                  handleRemoveAdditionalCriteria('region', option);
                }}
              >
                {getLabel({
                  value: option,
                  select: regions,
                }) ?? empty}
                <div className="absolute right-1 top-1" onClick={() => {}}>
                  <X className="size-4" />
                </div>
              </Box>
            ))}
          </div>
        </div>
        {showAdditionalSelects.region && (
          <div className="flex max-w-[300px] flex-col gap-2">
            <div className="flex items-center gap-2 rounded-xs bg-[#D0DDE1] p-3">
              <MultiSelectComponent
                options={regions}
                onValueChange={(values) =>
                  handleAdditionalSelection(
                    'region',
                    values as unknown as string[]
                  )
                }
                name="secondary_region"
                defaultSelectedKeys={additionalCriteria.secondary_region || []}
                className="w-full"
              />
            </div>
            <p className="text-xs italic text-gray-600">
              Note : Les XPERTS ayant sélectionné "France métropolitaine" seront
              également affichés.
            </p>
          </div>
        )}
      </div>
      {hasChanges && (
        <div className="fixed bottom-10 right-10">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={() => {
              saveCriteria(missionNumber);
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
