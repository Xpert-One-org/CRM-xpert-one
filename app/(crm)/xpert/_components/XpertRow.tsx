import { Badge } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import type { DBXpert } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { uppercaseFirstLetter } from '@/utils/string';
import { Eye } from 'lucide-react';
import { X } from 'lucide-react';
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
    ? xpert.profile_mission.job_titles?.map((job) => {
        const jobTitle = uppercaseFirstLetter(job.replaceAll('_', ' '));

        const otherJobTitle = xpert.profile_mission?.job_titles_other
          ? xpert.profile_mission.job_titles_other
          : '';

        if (job === 'other') {
          return (
            <Badge className="m-1" key={job}>
              {otherJobTitle}
            </Badge>
          );
        } else {
          return (
            <Badge className="m-1" key={job}>
              {jobTitle}
            </Badge>
          );
        }
      })
    : '';

  const availableDate = xpert.profile_mission
    ? formatDate(xpert.profile_mission.availability ?? '')
    : '';

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
      <Box className="col-span-1 flex flex-col p-2" isSelected={isOpen}>
        <div className="flex size-full flex-col items-center justify-center border bg-white">
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
        {isOpen ? (
          <X size={18} strokeWidth={4} />
        ) : (
          <Eye size={18} strokeWidth={1} />
        )}
      </Button>
    </>
  );
}
