'use client';

import React, { useEffect } from 'react';
import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { Checkbox } from '@/components/ui/checkbox';
import { uppercaseFirstLetter } from '@/utils/string';
import { getLabel } from '@/utils/getLabel';
import { useSelect } from '@/store/select';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { getNonMatchingCriteria } from '../_functions/getNonMatchingCriteria';
import { calculateTotalMatchingScore } from '../_functions/calculateMatchingPercentage';

export default function MatchingXpertsRow({
  matchedXpert,
  missionData,
}: {
  matchedXpert: DBMatchedXpert;
  missionData: DBMission;
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

  const matchingScore = calculateTotalMatchingScore(matchedXpert, missionData);
  const nonMatchingCriteria = getNonMatchingCriteria(matchedXpert, missionData);
  const hasNonMatchingCriteria = Object.keys(nonMatchingCriteria).length > 0;

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
          {`${uppercaseFirstLetter(matchedXpert.firstname)} ${uppercaseFirstLetter(matchedXpert.lastname)} : ${matchingScore}%`}
        </span>
      </Box>
      <Box
        className="col-span-2 flex flex-col divide-y divide-gray-200"
        collapsible={hasNonMatchingCriteria ? true : false}
      >
        {hasNonMatchingCriteria ? (
          Object.entries(nonMatchingCriteria).map(([key, value], index) => {
            return (
              <div
                key={key}
                className={`py-2 ${index === 0 ? 'pt-0' : ''} ${
                  index === Object.entries(nonMatchingCriteria).length - 1
                    ? 'pb-0'
                    : ''
                }`}
              >
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
                  <div className="font-medium text-gray-600">Spécialités :</div>
                )}
                {key === 'expertises' && value.length > 0 && (
                  <div className="font-medium text-gray-600">Expertises :</div>
                )}
                {key === 'diplomas' && value.length > 0 && (
                  <div className="font-medium text-gray-600">Diplômes :</div>
                )}
                {key === 'languages' && value.length > 0 && (
                  <div className="font-medium text-gray-600">Langues :</div>
                )}
                <div className="text-sm">
                  {value.map((val) => (
                    <Badge key={val} className="my-[2px] text-gray-800">
                      {getLabel({
                        value: val,
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
          })
        ) : (
          <p>Tous les critères correspondent parfaitement !</p>
        )}
      </Box>
      <Box className="col-span-1">{isAvailable ? 'OUI' : 'NON'}</Box>
      <div className="col-span-1 flex items-center justify-center">
        <Checkbox />
      </div>
    </>
  );
}
