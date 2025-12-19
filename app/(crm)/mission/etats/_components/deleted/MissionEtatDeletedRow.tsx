import Button from '@/components/Button';
import { Box } from '@/components/ui/box';
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaTrigger,
} from '@/components/ui/credenza';
import { empty } from '@/data/constant';
import { jobTitleSelect } from '@/data/mocked_select';
import { reasonDeleteMissionSelect } from '@/data/mocked_select';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { formatDateHour } from '@/utils/formatDates';
import { getLabel } from '@/utils/getLabel';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import { useMissionStore } from '@/store/mission';
import type { ReasonMissionDeletion } from '@/types/typesDb';
import { updateMission as updateMissionAction } from '../../../fiche/mission.action';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        <Select
          value={mission.reason_deletion ?? ''}
          onValueChange={async (value: ReasonMissionDeletion) => {
            if (mission.reason_deletion !== value) {
              const { error } = await updateMissionAction({
                mission_id: mission.id,
                newData: { reason_deletion: value },
              });
              if (error) {
                toast.error('Erreur lors de la mise à jour du motif');
              } else {
                toast.success('Motif mis à jour');
              }
            }
          }}
        >
          <SelectTrigger className="w-full border-none bg-transparent text-center shadow-none hover:bg-gray-100">
            <SelectValue>
              {getLabel({
                value: mission.reason_deletion ?? '',
                select: reasonDeleteMissionSelect,
              }) || 'Choisir un motif'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {reasonDeleteMissionSelect.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Box>
      <Box className="col-span-2 p-1">
        <Input
          className="h-8 border-none bg-transparent text-center shadow-none hover:bg-gray-100 focus-visible:ring-0"
          defaultValue={mission.detail_deletion ?? ''}
          onBlur={async (e) => {
            const newValue = e.target.value;
            if (mission.detail_deletion !== newValue) {
              const { error } = await updateMissionAction({
                mission_id: mission.id,
                newData: { detail_deletion: newValue },
              });
              if (error) {
                toast.error('Erreur lors de la mise à jour du commentaire');
              } else {
                toast.success('Commentaire mis à jour');
              }
            }
          }}
        />
      </Box>
      <Credenza>
        <CredenzaTrigger asChild>
          <Button>Réouvrir la mission</Button>
        </CredenzaTrigger>
        <CredenzaContent className="font-fira mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white/70 p-0 backdrop-blur-sm">
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
