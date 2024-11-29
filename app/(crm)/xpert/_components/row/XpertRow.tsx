import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { empty } from '@/data/constant';
import { cn } from '@/lib/utils';
import { useSelect } from '@/store/select';
import type { DBXpert } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getLabel } from '@/utils/getLabel';
import { uppercaseFirstLetter } from '@/utils/string';
import React, { useEffect } from 'react';
import Image from 'next/image';

export default function XpertRow({
  xpert,
  isOpen,
  onClick,
}: {
  xpert: DBXpert;
  isOpen: boolean;
  onClick: () => void;
}) {
  const dateSignUp = formatDate(xpert.created_at);
  const { jobTitles, fetchJobTitles, countries, fetchCountries } = useSelect();

  useEffect(() => {
    fetchJobTitles();
    fetchCountries();
  }, [fetchJobTitles, fetchCountries]);

  const postTypes = xpert.profile_mission
    ? xpert.profile_mission.job_titles?.map((job, i, arr) => {
        const badge = (
          <div key={`${xpert.generated_id}-${i}`}>
            <Badge
              variant="secondary"
              className="m-1 max-w-[95%] font-normal"
              key={`${xpert.generated_id}-${i}`}
            >
              {getLabel({ value: job, select: jobTitles }) ?? empty}
            </Badge>
            {i < arr.length - 1 && <span className="text-gray-400">|</span>}
          </div>
        );
        return badge;
      })
    : empty;

  const availableDate = xpert.profile_mission
    ? formatDate(xpert.profile_mission.availability ?? '')
    : empty;

  const availabilityStatus = (() => {
    if (xpert.profile_mission?.availability === undefined) {
      return 'bg-[#D64242]';
    } else if (
      new Date(xpert.profile_mission.availability ?? '') > new Date()
    ) {
      return 'bg-[#D64242]';
    } else if (
      xpert.mission
        .map((mission) => mission.xpert_associated_id)
        .some((xpertId) => xpertId === xpert.id)
    ) {
      return 'bg-accent';
    } else {
      return 'bg-[#92C6B0]';
    }
  })();

  return (
    <>
      <Box className="col-span-1" isSelected={isOpen}>
        {dateSignUp}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {xpert.lastname?.toUpperCase()}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {uppercaseFirstLetter(xpert.firstname ?? '')}
      </Box>
      <Box className="col-span-2 flex flex-col p-2" isSelected={isOpen}>
        <div
          className={cn('flex size-full flex-row flex-wrap items-center', {
            'border bg-white': postTypes?.length,
          })}
        >
          {postTypes}
        </div>
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {countries.find((c) => c.value === xpert.country)?.flag && (
          <Image
            src={countries.find((c) => c.value === xpert.country)?.flag ?? ''}
            alt={`${countries.find((c) => c.value === xpert.country)?.label}-flag`}
            width={24}
            height={16}
          />
        )}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {xpert.generated_id}
      </Box>
      <Box className={`col-span-1 ${availabilityStatus} text-white`}>
        {availableDate}
      </Box>
      <Box
        className={`col-span-1 ${xpert.cv_name ? 'bg-[#92C6B0]' : 'bg-[#D64242]'} text-white`}
      >
        {xpert.cv_name ? 'OUI' : 'NON'}
      </Box>
      <Button className="col-span-1 h-full gap-1 text-white" onClick={onClick}>
        {isOpen ? 'Fermer la fiche' : 'Ouvrir la fiche'}
      </Button>
    </>
  );
}
