import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/utils/date';
import { empty } from '@/data/constant';
import type { DBMission } from '@/types/typesDb';
import { Box } from '@/components/ui/box';
import { convertStateValue } from '@/utils/stateMissionConverter';
import { convertStatusXpertValue } from '@/utils/statusXpertConverter';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMissionStore } from '@/store/mission';
import { useIsIntern } from '@/hooks/useIsIntern';

export default function MissionActivationRow({
  mission,
}: {
  mission: DBMission;
}) {
  const { updateXpertAssociatedStatus } = useMissionStore();
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<string | null>(
    mission.xpert_associated_status
  );
  const [hasChanges, setHasChanges] = useState(false);
  const isIntern = useIsIntern();

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const handleRedirectXpert = (xpertId: string) => {
    router.push(`/xpert?id=${xpertId}`);
  };

  const options = [
    {
      label: 'CDI DE MISSION',
      value: 'cdi',
    },
    {
      label: 'FREELANCE',
      value: 'freelance',
    },
    {
      label: 'PORTAGE',
      value: 'portage',
    },
  ];

  const handleStatusChange = (value: string) => {
    setPendingStatus(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges || !mission.id) return;
    await updateXpertAssociatedStatus(mission.id, pendingStatus ?? '');
    setHasChanges(false);
  };

  return (
    <>
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <ComboboxMission slug="activation-des-missions" />
      <Box className="col-span-1">{mission.referent_name ?? empty}</Box>
      <Box
        className="col-span-1 bg-[#65ADAF] text-white"
        isSelectable={!isIntern}
        options={options}
        onValueChange={handleStatusChange}
      >
        {convertStatusXpertValue(pendingStatus ?? 'Choisir un statut')}
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
      {hasChanges && (
        <div className="fixed bottom-10 right-10">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={handleSave}
          >
            Enregistrer
          </Button>
        </div>
      )}
    </>
  );
}
