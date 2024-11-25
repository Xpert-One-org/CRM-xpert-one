import React from 'react';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import AddIcon from '@/components/svg/AddIcon';

export default function MatchingLeftSideSecond({
  missionData,
}: {
  missionData: DBMission;
}) {
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
            <Box className="p-3">{''}</Box>
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
            <Box className="p-3">{''}</Box>
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
            <Box className="p-3">{''}</Box>
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
            <Box className="p-3">{''}</Box>
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
            <Box className="p-3">{''}</Box>
          </div>
        </div>
      </div>
    </>
  );
}
