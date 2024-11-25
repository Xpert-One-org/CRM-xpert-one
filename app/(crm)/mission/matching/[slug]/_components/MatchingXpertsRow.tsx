import React from 'react';
import type { DBMatchedXpert, DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { Checkbox } from '@/components/ui/checkbox';
import { uppercaseFirstLetter } from '@/utils/string';

export default function MatchingXpertsRow({
  matchedXpert,
  mission,
}: {
  matchedXpert: DBMatchedXpert;
  mission: DBMission;
}) {
  const getNonMatchingCriteria = () => {
    const criteriaMapping = [
      {
        name: 'Intitulé de poste',
        mission: mission.job_title,
        expert:
          matchedXpert.profile_mission &&
          matchedXpert.profile_mission.job_titles,
      },
      {
        name: 'Type de poste',
        mission: mission.post_type,
        expert:
          matchedXpert.profile_mission &&
          matchedXpert.profile_mission.posts_type,
      },
      {
        name: "Secteur d'activité",
        mission: mission.sector,
        expert:
          matchedXpert.profile_mission && matchedXpert.profile_mission.sector,
      },
      {
        name: 'Spécialités',
        mission: mission.specialties,
        expert:
          matchedXpert.profile_mission &&
          matchedXpert.profile_mission.specialties,
      },
      {
        name: 'Expertises',
        mission: mission.expertises,
        expert:
          matchedXpert.profile_expertise &&
          matchedXpert.profile_expertise.expertises,
      },
      {
        name: 'Langues',
        mission: mission.languages,
        expert:
          matchedXpert.profile_expertise &&
          matchedXpert.profile_expertise.maternal_language,
      },
      {
        name: 'Diplômes',
        mission: mission.diplomas,
        expert:
          matchedXpert.profile_education &&
          matchedXpert.profile_education.map((e) => e.education_diploma),
      },
    ];

    return criteriaMapping.reduce((nonMatching, criteria) => {
      const {
        name,
        mission: missionCriteria,
        expert: expertCriteria,
      } = criteria;

      if (!expertCriteria) {
        nonMatching.push(`${name} : Non renseigné`);
        return nonMatching;
      }

      if (Array.isArray(missionCriteria)) {
        if (
          !missionCriteria.some((item) =>
            Array.isArray(expertCriteria)
              ? expertCriteria.includes(item)
              : expertCriteria === item
          )
        ) {
          nonMatching.push(
            `${name} : ${Array.isArray(expertCriteria) ? expertCriteria.join(', ') : expertCriteria}`
          );
        }
      } else if (missionCriteria !== expertCriteria) {
        nonMatching.push(
          `${name} : ${Array.isArray(expertCriteria) ? expertCriteria.join(', ') : expertCriteria}`
        );
      }

      return nonMatching;
    }, [] as string[]);
  };

  const calculateMatchingPercentage = () => {
    const missionCriteria = [
      mission.job_title,
      mission.post_type,
      mission.sector,
      mission.specialties,
      mission.expertises,
      mission.languages,
      mission.diplomas,
    ];

    const expertCriteria = [
      matchedXpert.profile_mission && matchedXpert.profile_mission.job_titles,
      matchedXpert.profile_mission && matchedXpert.profile_mission.posts_type,
      matchedXpert.profile_mission && matchedXpert.profile_mission.sector,
      matchedXpert.profile_mission && matchedXpert.profile_mission.specialties,
      matchedXpert.profile_expertise &&
        matchedXpert.profile_expertise.expertises,
      matchedXpert.profile_expertise &&
        matchedXpert.profile_expertise.maternal_language,
      matchedXpert.profile_education &&
        matchedXpert.profile_education.map((e) => e.education_diploma),
    ];

    const matchingCount = missionCriteria.reduce((count, criterion, index) => {
      if (Array.isArray(criterion)) {
        return (
          count +
          (criterion.some((item) => expertCriteria[index]?.includes(item))
            ? 1
            : 0)
        );
      }
      return count + (criterion === expertCriteria[index] ? 1 : 0);
    }, 0);

    const totalCriteria = missionCriteria.length;
    return Math.round((matchingCount / totalCriteria) * 100);
  };

  const matchingPercentage = calculateMatchingPercentage();
  const nonMatchingCriteria = getNonMatchingCriteria();

  return (
    <>
      <Box className="col-span-2">
        <span>
          {`${uppercaseFirstLetter(matchedXpert.firstname)} ${uppercaseFirstLetter(matchedXpert.lastname)} : ${matchingPercentage}%`}
        </span>
      </Box>
      <Box className="col-span-2">
        {nonMatchingCriteria.map((criteria, index) => (
          <p key={index} className="text-wrap text-sm">
            {criteria}
          </p>
        ))}
      </Box>
      <Box className="col-span-1">{'disponible'}</Box>
      <div className="col-span-1 flex items-center justify-center">
        <Checkbox />
      </div>
    </>
  );
}
