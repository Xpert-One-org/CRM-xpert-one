import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getTimeBeforeMission, uppercaseFirstLetter } from '@/utils/string';
import { useRouter } from 'next/navigation';

export default function MissionEtatToValidateRow({
  mission,
  onValidationChange,
  onValidationChangeAll,
}: {
  mission: DBMission;
  onValidationChange: (missionId: string, isValidated: boolean) => void;
  onValidationChangeAll: (missionId: string, isValidated: boolean) => void;
}) {
  const router = useRouter();
  const [isValidated, setIsValidated] = useState(mission.state === 'open');
  const [openAllToValidate, setOpenAllToValidate] = useState(
    mission.state === 'open_all_to_validate'
  );

  const createdAt = formatDate(mission.created_at);
  const timeBeforeMission = getTimeBeforeMission(mission.start_date ?? '');

  const getBackgroundClass = (() => {
    const createdDate = new Date(mission.created_at);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 2) {
      return 'bg-accent text-white';
    } else if (diffDays >= 5) {
      return 'bg-[#D64242] text-white';
    }
    return '';
  })();

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const handleValidationChange = (value: string) => {
    const newIsValidated = value === 'open';
    setIsValidated(newIsValidated);
    onValidationChange(mission.id.toString(), newIsValidated);
  };

  const handleOpenAllValidationChange = (value: string) => {
    const newIsValidated = value === 'open_all_to_validate';
    setOpenAllToValidate(newIsValidated);
    onValidationChangeAll(mission.id.toString(), newIsValidated);
  };

  const openAllToValidateOptions = [
    { label: 'OUI', value: 'open_all_to_validate' },
    { label: 'NON', value: 'to_validate' },
  ];

  const toValidateOptions = [
    { label: 'OUI', value: 'open' },
    { label: 'NON', value: 'to_validate' },
  ];

  return (
    <>
      <Box className={`col-span-1 ${getBackgroundClass}`}>{createdAt}</Box>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() =>
          handleRedirectFournisseur(mission.supplier?.generated_id ?? '')
        }
      >
        {mission.supplier?.generated_id}
      </Box>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{mission.referent_name}</Box>
      <Box className="col-span-1">{timeBeforeMission}</Box>
      <Box className="col-span-1">
        {uppercaseFirstLetter(mission.job_title?.replaceAll('_', ' ') ?? '')}
      </Box>
      <Box
        className="col-span-1"
        isSelectable
        options={openAllToValidateOptions}
        onValueChange={handleOpenAllValidationChange}
      >
        {openAllToValidate ? 'OUI' : 'NON'}
      </Box>
      <Box
        className={`col-span-1 ${
          isValidated ? 'bg-[#92C6B0]' : 'bg-[#D64242]'
        } text-white`}
        isSelectable
        options={toValidateOptions}
        onValueChange={handleValidationChange}
      >
        {isValidated ? 'OUI' : 'NON'}
      </Box>
    </>
  );
}
