import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { empty } from '@/data/constant';
import { cn } from '@/lib/utils';
import type { DBXpert } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { uppercaseFirstLetter } from '@/utils/string';
import React from 'react';

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

  const postTypes = xpert.profile_mission
    ? xpert.profile_mission.job_titles?.map((job, i, arr) => {
        const jobTitle = uppercaseFirstLetter(job.replaceAll('_', ' '));
        const badge = (
          <Badge className="m-1 max-w-[95%] font-normal" key={`badge-${i}`}>
            {job === 'other' ? 'Autre' : jobTitle.length ? jobTitle : empty}
          </Badge>
        );

        if (i < arr.length - 1) {
          return (
            <React.Fragment key={i}>
              {badge}
              <span className="text-gray-400">|</span>
            </React.Fragment>
          );
        }
        return badge;
      })
    : empty;

  const availableDate = xpert.profile_mission
    ? formatDate(xpert.profile_mission.availability ?? '')
    : empty;

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
        {xpert.generated_id}
      </Box>
      <Box className="col-span-1" isSelected={isOpen}>
        {availableDate}
      </Box>
      <Button className="col-span-1 h-full gap-1 text-white" onClick={onClick}>
        {isOpen ? 'Fermer la fiche' : 'Ouvrir la fiche'}
      </Button>
    </>
  );
}
