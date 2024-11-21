import React from 'react';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';

export default function MatchingLeftSideSecond({
  missionData,
}: {
  missionData: DBMission;
}) {
  return (
    <>
      <div className="col-span-1 flex flex-col gap-y-spaceSmall">
        <Box className="justify-between bg-[#D0DDE1] p-3">Poste</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">Type de poste</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">
          Secteur d’activité
        </Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">Spécialité</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">Expertise</Box>
      </div>
      <div className="col-span-1 flex flex-col gap-y-spaceSmall">
        <Box className="p-3">{''}</Box>
        <Box className="p-3">{''}</Box>
        <Box className="p-3">{''}</Box>
        <Box className="p-3">{''}</Box>
        <Box className="p-3">{''}</Box>
      </div>
    </>
  );
}
