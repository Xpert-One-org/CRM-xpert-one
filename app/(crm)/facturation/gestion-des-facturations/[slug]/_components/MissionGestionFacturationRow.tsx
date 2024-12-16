import React from 'react';
import { empty } from '@/data/constant';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { convertStateValue } from '@/utils/stateMissionConverter';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import { uppercaseFirstLetter } from '@/utils/string';

export default function MissionGestionFacturationRow({
  mission,
}: {
  mission: DBMission;
}) {
  const calculateTJMWithCharges = () => {
    const baseAmount = parseInt(mission.tjm ?? '0');
    return baseAmount * 1.55;
  };

  return (
    <>
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <ComboboxMission slug="gestion-des-facturations" />
      <Box className="col-span-1">{mission.referent_name ?? empty}</Box>
      <Box className="col-span-1">
        {uppercaseFirstLetter(
          new Date().toLocaleString('fr-FR', { month: 'long' })
        )}
      </Box>
      <Box className="col-span-1">{calculateTJMWithCharges()} €</Box>
    </>
  );
}
