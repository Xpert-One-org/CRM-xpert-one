import React, { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { getTimeBeforeMission } from '@/utils/string';
import { useRouter } from 'next/navigation';
import { getLabel } from '@/utils/getLabel';
import { empty } from '@/data/constant';
import { useSelect } from '@/store/select';

export default function MissionEtatInProcessRow({
  mission,
  onValidationChange,
  onValidationChangeAll,
}: {
  mission: DBMission;
  onValidationChange: (missionId: string, state: string | null) => void;
  onValidationChangeAll: (missionId: string, isValidated: boolean) => void;
}) {
  const router = useRouter();
  const { jobTitles, fetchJobTitles } = useSelect();

  const [validationState, setValidationState] = useState<string>(
    mission.state === 'in_process' || mission.state === 'open_all_to_validate'
      ? 'in_process'
      : mission.state
  );

  const [openAllInProcess, setOpenAllInProcess] = useState(
    mission.state === 'open_all_to_validate'
  );

  useEffect(() => {
    fetchJobTitles();
  }, [fetchJobTitles]);

  useEffect(() => {
    setValidationState(
      mission.state === 'in_process' || mission.state === 'open_all_to_validate'
        ? 'in_process'
        : mission.state
    );
    setOpenAllInProcess(mission.state === 'open_all_to_validate');
  }, [mission.state]);

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
    let newState: string | null;

    switch (value) {
      case 'open':
        newState = 'open';
        break;
      case 'refused':
        newState = 'refused';
        break;
      default:
        newState = 'in_process';
        break;
    }

    setValidationState(newState);
    onValidationChange(mission.id.toString(), newState);
  };

  const handleOpenAllValidationChange = (value: string) => {
    const newIsValidated = value === 'open_all_to_validate';

    setOpenAllInProcess(newIsValidated);
    onValidationChangeAll(mission.id.toString(), newIsValidated);
  };

  const openAllInProcessOptions = [
    { label: 'OUI', value: 'open_all_to_validate' },
    { label: 'NON', value: 'to_validate' },
  ];

  const InProcessOptions = [
    { label: 'OUI', value: 'open' },
    { label: 'NON', value: 'refused' },
    { label: 'En cours de traitement', value: 'in_process' },
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
        {getLabel({ value: mission.job_title ?? empty, select: jobTitles }) ??
          empty}
      </Box>
      <Box
        className="col-span-1"
        isSelectable
        options={openAllInProcessOptions}
        onValueChange={handleOpenAllValidationChange}
      >
        {openAllInProcess ? 'OUI' : 'NON'}
      </Box>
      <Box
        className={`col-span-1 ${
          validationState === 'open'
            ? 'bg-[#92C6B0]'
            : validationState === 'in_process'
              ? 'bg-[#67b6c1]'
              : 'bg-[#D64242]'
        } text-white`}
        isSelectable
        options={InProcessOptions}
        onValueChange={handleValidationChange}
      >
        {validationState === 'open'
          ? 'OUI'
          : validationState === 'in_process'
            ? 'En cours de traitement'
            : 'NON'}
      </Box>
    </>
  );
}
