import Button from '@/components/Button';
import { Box } from '@/components/ui/box';
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaTrigger,
} from '@/components/ui/credenza';
import { empty } from '@/data/constant';
import {
  jobTitleSelect,
  reasonDeleteMissionSelect,
} from '@/data/mocked_select';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { formatDateHour } from '@/utils/formatDates';
import { getLabel } from '@/utils/getLabel';
import { EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { useMissionStore } from '@/store/mission';

export default function MissionEtatDeletedRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();
  const createdAt = formatDate(mission.created_at);
  const [isLoading, setIsLoading] = useState(false);

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const handleRedirectXpert = (xpertId: string) => {
    router.push(`/xpert?id=${xpertId}`);
  };
  const { updateMission } = useMissionStore();

  const handleReOpen = async () => {
    setIsLoading(true);
    await updateMission(mission.id.toString(), 'open');
    setIsLoading(false);
  };

  return (
    <>
      <Box className="col-span-1">{createdAt}</Box>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() =>
          handleRedirectFournisseur(mission.supplier?.generated_id ?? '')
        }
      >
        {mission.supplier?.generated_id} - {mission.supplier?.firstname}{' '}
        {mission.supplier?.lastname}
      </Box>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() => handleRedirectXpert(mission.xpert?.generated_id ?? '')}
      >
        {mission.xpert?.generated_id
          ? `${mission.xpert?.generated_id} - ${mission.xpert?.firstname} ${mission.xpert?.lastname}`
          : empty}
      </Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number} -{' '}
        {getLabel({
          value: mission.job_title ?? empty,
          select: jobTitleSelect,
        }) ?? empty}
      </Box>
      <Box className="col-span-1">{`${mission.referent?.firstname ?? ''} ${mission.referent?.lastname ?? ''}`}</Box>
      <Box className="col-span-1">
        {mission.deleted_at ? formatDateHour(mission.deleted_at) : ''}
      </Box>
      <Box className="col-span-1">
        {getLabel({
          value: mission.reason_deletion ?? '',
          select: reasonDeleteMissionSelect,
        })}
      </Box>
      <Box className="col-span-2 gap-2">
        {mission.detail_deletion}
        <></>
      </Box>
      <Credenza>
        <CredenzaTrigger asChild>
          <Button>Réouvrir la mission</Button>
        </CredenzaTrigger>
        <CredenzaContent className="font-fira mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white bg-opacity-70 p-0 backdrop-blur-sm">
          <div className="relative h-[175px] w-full">
            <Image
              src="/static/background.jpg"
              fill
              objectFit="cover"
              alt="confirm-popup"
            />
          </div>
          <div className="flex flex-col gap-y-spaceContainer p-6">
            <div className="text-xl font-semibold text-gray-800">
              Êtes-vous sûr de vouloir réouvrir cette mission ?
              <p className="text-base font-normal text-gray-600">
                Cette action restaurera la mission dans l'état "Ouverte"
              </p>
            </div>

            <div className="flex gap-x-spaceSmall self-end">
              <CredenzaClose asChild>
                <Button variant={'outline'}>Annuler</Button>
              </CredenzaClose>

              <Button
                onClick={handleReOpen}
                className="w-fit self-end px-spaceContainer"
                variant={'primary'}
              >
                {isLoading ? 'Chargement...' : 'Réouvrir'}
              </Button>
            </div>
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
