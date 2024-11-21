import React from 'react';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';

export default function MatchingLeftSide({
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
        <Box className="justify-between bg-[#D0DDE1] p-3">
          Séniorité en année
        </Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">Expertise</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">
          Disponibilité durant la mission
        </Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">
          En recherche active ?
        </Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">Management</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">
          Zone géographique
        </Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">Langues</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">Diplômes</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">TJM cible MAX</Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">
          Évaluation de l’XPERT
        </Box>
        <Box className="justify-between bg-[#D0DDE1] p-3">
          Travailleurs handicapés ?
        </Box>
      </div>
      <div className="col-span-1 flex flex-col gap-y-spaceSmall">
        <Box>{missionData.job_title}</Box>
        <Box>{missionData.post_type}</Box>
        <Box>{missionData.specialties}</Box>
        <Box>{'seniorité'}</Box>
        <Box>{missionData.expertises}</Box>
      </div>
      <div className="col-span-1 flex flex-col gap-y-spaceSmall">
        {/* <Box>{missionData.job_title}</Box> */}
      </div>
    </>
  );
}
