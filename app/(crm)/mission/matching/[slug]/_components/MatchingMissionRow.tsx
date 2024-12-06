import { Box } from '@/components/ui/box';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { DBMission } from '@/types/typesDb';
import { uppercaseFirstLetter } from '@/utils/string';
import ComboboxMission from '@/components/combobox/ComboboxMission';

export default function MatchingMissionRow({
  mission,
  slug,
}: {
  mission: DBMission;
  slug: string;
}) {
  const router = useRouter();

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const options = [
    { label: 'OUI', value: 'open_all_to_validate' },
    { label: 'NON', value: 'to_validate' },
  ];

  return (
    <>
      <div className="col-span-1">
        <ComboboxMission slug={slug} />
      </div>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() =>
          handleRedirectFournisseur(mission.supplier?.generated_id ?? '')
        }
      >
        {mission.supplier?.generated_id ?? ''}
      </Box>
      <Box className="col-span-1">
        {mission.supplier?.company_name?.toUpperCase() ?? ''}
      </Box>
      <Box className="col-span-1">
        {uppercaseFirstLetter(mission.supplier?.lastname ?? '')}
      </Box>
      <Box className="col-span-1">{mission.supplier?.firstname ?? ''}</Box>
      <Box className="col-span-1" isSelectable options={options}>
        {mission.state === 'open_all_to_validate' ||
        mission.state === 'open_all'
          ? 'OUI'
          : 'NON'}
      </Box>
    </>
  );
}
