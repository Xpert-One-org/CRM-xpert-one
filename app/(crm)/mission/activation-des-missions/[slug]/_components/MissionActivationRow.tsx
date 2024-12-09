import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/date';
import { empty } from '@/data/constant';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { convertStateValue } from '@/utils/stateMissionConverter';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';
import ComboboxMission from '@/components/combobox/ComboboxMission';

export default function MissionActivationRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const handleRedirectXpert = (xpertId: string) => {
    router.push(`/xpert?id=${xpertId}`);
  };

  const options = [
    {
      value: 'cdi',
      label: 'CDI ',
    },
  ];

  return (
    <>
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <ComboboxMission slug="activation-des-missions" />
      <Box className="col-span-1">{mission.referent_name ?? empty}</Box>
      <Box className="col-span-1 bg-[#65ADAF] text-white" isSelectable>
        {convertStatusXpertValue(mission.xpert?.profile_status?.status ?? '')}
      </Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() =>
          handleRedirectFournisseur(mission.supplier?.generated_id ?? '')
        }
      >
        {mission.supplier?.generated_id}
      </Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() => handleRedirectXpert(mission.xpert?.generated_id ?? '')}
      >
        {mission.xpert?.generated_id ?? empty}
      </Box>
    </>
  );
}
