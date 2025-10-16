import React from 'react';
import { empty } from '@/data/constant';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { convertStateValue } from '@/utils/stateMissionConverter';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import { uppercaseFirstLetter } from '@/utils/string';

export default function MissionGestionFacturationRow({
  mission,
  selectedYear,
  selectedMonth,
}: {
  mission: DBMission;
  selectedYear: number;
  selectedMonth: number;
}) {
  const calculateTJMWithCharges = () => {
    const baseAmount = parseInt(mission.tjm ?? '0');
    if (isNaN(baseAmount)) {
      return empty;
    }
    return `${(baseAmount * 1.55).toFixed(2)} €`;
  };

  return (
    <>
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <ComboboxMission
        slug="gestion-des-facturations"
        jobTitle={mission.job_title ?? empty}
      />
      <Box className="col-span-1">
        {mission.xpert?.generated_id
          ? `${mission.xpert?.generated_id} - ${mission.xpert?.firstname} ${mission.xpert?.lastname}`
          : empty}
      </Box>
      <Box className="col-span-1">
        {' '}
        {`${mission.referent?.firstname ?? ''} ${mission.referent?.lastname ?? ''}`}
      </Box>

      <Box className="col-span-1">
        {uppercaseFirstLetter(
          new Date(mission.start_date ?? new Date()).toLocaleString('fr-FR', {
            month: 'long',
          })
        )}
        {` ${new Date(mission.start_date ?? new Date()).getFullYear()}`}
      </Box>
      <Box className="col-span-1">
        {uppercaseFirstLetter(
          new Date(mission.end_date ?? new Date()).toLocaleString('fr-FR', {
            month: 'long',
          })
        )}
        {` ${new Date(mission.end_date ?? new Date()).getFullYear()}`}
      </Box>
      <Box className="col-span-1">{`${uppercaseFirstLetter(
        new Date(selectedYear, selectedMonth).toLocaleString('fr-FR', {
          month: 'long',
        })
      )} ${selectedYear}`}</Box>
      <Box className="col-span-1">{calculateTJMWithCharges()}</Box>
    </>
  );
}
