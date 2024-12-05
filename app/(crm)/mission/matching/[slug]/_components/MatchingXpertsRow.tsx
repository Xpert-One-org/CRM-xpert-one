'use client';

import React, { useEffect } from 'react';
import type { DBMatchedXpert } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { Checkbox } from '@/components/ui/checkbox';
import { uppercaseFirstLetter } from '@/utils/string';
import { getLabel } from '@/utils/getLabel';
import { useSelect } from '@/store/select';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function MatchingXpertsRow({
  matchedXpert,
  onXpertSelection,
  isSelected,
}: {
  matchedXpert: DBMatchedXpert;
  onXpertSelection: (xpertId: string, checked: boolean) => void;
  isSelected: boolean;
}) {
  const {
    jobTitles,
    sectors,
    specialities,
    expertises,
    diplomas,
    languages,
    posts,
    fetchJobTitles,
    fetchSectors,
    fetchSpecialties,
    fetchExpertises,
    fetchDiplomas,
    fetchLanguages,
    fetchPosts,
  } = useSelect();

  const router = useRouter();

  const hasNonMatchingCriteria =
    Object.keys(matchedXpert.nonMatchingCriteria).length > 0;

  const availability =
    matchedXpert.profile_mission && matchedXpert.profile_mission.availability;

  const isAvailable = availability && new Date(availability) > new Date();

  useEffect(() => {
    fetchJobTitles();
    fetchSectors();
    fetchSpecialties();
    fetchExpertises();
    fetchDiplomas();
    fetchLanguages();
    fetchPosts();
  }, [
    fetchDiplomas,
    fetchExpertises,
    fetchJobTitles,
    fetchLanguages,
    fetchSectors,
    fetchSpecialties,
    fetchPosts,
  ]);

  return (
    <>
      <Box
        className="col-span-2 cursor-pointer text-white"
        primary
        onClick={() => router.push(`/xpert?id=${matchedXpert.generated_id}`)}
      >
        <span>
          {`${uppercaseFirstLetter(matchedXpert.firstname)} ${uppercaseFirstLetter(matchedXpert.lastname)} : ${matchedXpert.matchingScore}%`}
        </span>
      </Box>
      <Box
        className="col-span-2 flex flex-col divide-y divide-gray-200"
        collapsible={
          hasNonMatchingCriteria &&
          Object.keys(matchedXpert.nonMatchingCriteria).length !== 1
            ? true
            : false
        }
      >
        {hasNonMatchingCriteria ? (
          Object.entries(matchedXpert.nonMatchingCriteria).map(
            ([key, value], index) => {
              return (
                <div key={key} className="p-1">
                  {key === 'job_title' && value.length > 0 && (
                    <div className="font-medium text-gray-600">Poste :</div>
                  )}
                  {key === 'post_type' && value.length > 0 && (
                    <div className="font-medium text-gray-600">
                      Type de postes :
                    </div>
                  )}
                  {key === 'sector' && value.length > 0 && (
                    <div className="font-medium text-gray-600">
                      Secteur d'activités :
                    </div>
                  )}
                  {key === 'specialties' && value.length > 0 && (
                    <div className="font-medium text-gray-600">
                      Spécialités :
                    </div>
                  )}
                  {key === 'expertises' && value.length > 0 && (
                    <div className="font-medium text-gray-600">
                      Expertises :
                    </div>
                  )}
                  {key === 'diplomas' && value.length > 0 && (
                    <div className="font-medium text-gray-600">Diplômes :</div>
                  )}
                  {key === 'languages' && value.length > 0 && (
                    <div className="font-medium text-gray-600">Langues :</div>
                  )}
                  <div className="text-sm">
                    {value.map((val) => (
                      <Badge
                        key={`${key}-${val}`}
                        variant={'outline'}
                        className="mb-1 mr-1 border-none bg-[#D64242]"
                      >
                        {getLabel({
                          value: key === 'post_type' ? val.toUpperCase() : val,
                          select:
                            key === 'job_title'
                              ? jobTitles
                              : key === 'sector'
                                ? sectors
                                : key === 'specialties'
                                  ? specialities
                                  : key === 'expertises'
                                    ? expertises
                                    : key === 'diplomas'
                                      ? diplomas
                                      : key === 'languages'
                                        ? languages
                                        : key === 'post_type'
                                          ? posts
                                          : [],
                        })}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            }
          )
        ) : (
          <p>Tous les critères correspondent parfaitement !</p>
        )}
      </Box>
      <Box className="col-span-2">{isAvailable ? 'OUI' : 'NON'}</Box>
      <div className="col-span-1 flex items-center justify-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onXpertSelection(matchedXpert.id, checked as boolean)
          }
        />
      </div>
    </>
  );
}
