import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { getTimeBeforeMission } from '@/utils/string';
import { empty } from '@/data/constant';
import { getLabel } from '@/utils/getLabel';
import { jobTitleSelect } from '@/data/mocked_select';
import Matching from '@/components/svg/Matching';
import Selection from '@/components/svg/Selection';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useMissionStore } from '@/store/mission';
import { toast } from 'sonner';
import {
  getCountMatchedXperts,
  getMissionSelectionXperts,
} from '../../mission-etat-open.action';

export default function MissionEtatOpenRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();
  const { updateMissionWebsiteVisibility } = useMissionStore();
  const [matchingCount, setMatchingCount] = useState<number>(0);
  const [isLoadingMatching, setIsLoadingMatching] = useState<boolean>(false);
  const [isLoadingWebsiteVisibility, setIsLoadingWebsiteVisibility] =
    useState<boolean>(false);
  const [selectionCounts, setSelectionCounts] = useState<{
    discussions: number;
    proposes: number;
    refuses: number;
  }>({
    discussions: 0,
    proposes: 0,
    refuses: 0,
  });
  const [isLoadingSelection, setIsLoadingSelection] = useState<boolean>(false);

  const createdAt = formatDate(mission.created_at);
  const timeBeforeMission = getTimeBeforeMission(mission.start_date ?? '');
  const timeBeforeDeadlineApplication = getTimeBeforeMission(
    mission.deadline_application ?? ''
  );

  const getBackgroundClass = (() => {
    const submissionDate = new Date(mission.deadline_application ?? '');
    const currentDate = new Date();

    // Calculer si la date est dépassée et le nombre de jours restants
    const isPast = currentDate > submissionDate;
    const diffTime = submissionDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Si la date est dépassée, afficher en rouge
    if (isPast) {
      return 'bg-[#D64242] text-white';
    }
    // Si on est à 10 jours ou moins de la deadline, afficher en orange
    else if (diffDays <= 10) {
      return 'bg-accent text-white';
    }

    // Par défaut, pas de couleur particulière (gris)
    return '';
  })();

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  const handleRedirectFournisseur = (fournisseurId: string) => {
    router.push(`/fournisseur?id=${fournisseurId}`);
  };

  const handleRedirectMatching = () => {
    router.push(
      `/mission/matching/${mission.mission_number?.replaceAll(' ', '-')}`
    );
  };

  const handleRedirectSelection = () => {
    router.push(
      `/mission/selection/${mission.mission_number?.replaceAll(' ', '-')}`
    );
  };

  const handleWebsiteVisibilityChange = async (checked: boolean) => {
    try {
      setIsLoadingWebsiteVisibility(true);
      await updateMissionWebsiteVisibility(mission.id, checked);
      toast.success(
        checked ? 'Mission visible sur le site' : 'Mission masquée du site'
      );
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la visibilité');
    } finally {
      setIsLoadingWebsiteVisibility(false);
    }
  };

  useEffect(() => {
    const fetchMatchingCount = async () => {
      setIsLoadingMatching(true);
      try {
        const count = await getCountMatchedXperts(mission);
        setMatchingCount(count.data.length);
      } catch (error) {
        console.error('Error fetching matching count:', error);
      } finally {
        setIsLoadingMatching(false);
      }
    };

    fetchMatchingCount();
  }, [mission]);

  useEffect(() => {
    const fetchSelectionCount = async () => {
      setIsLoadingSelection(true);
      try {
        const { data } = await getMissionSelectionXperts(mission.id);

        const counts = data.reduce(
          (acc, item) => {
            const status = item.column_status as keyof typeof acc;
            if (status in acc) {
              acc[status]++;
            }
            return acc;
          },
          {
            discussions: 0,
            proposes: 0,
            refuses: 0,
          }
        );

        setSelectionCounts(counts);
      } catch (error) {
        console.error('Error fetching selection counts:', error);
      } finally {
        setIsLoadingSelection(false);
      }
    };

    fetchSelectionCount();
  }, [mission.id]);

  return (
    <>
      <Box className="col-span-1">{createdAt}</Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() =>
          handleRedirectFournisseur(mission.supplier?.generated_id ?? '')
        }
      >
        {mission.supplier?.generated_id} - {mission.supplier?.firstname}{' '}
        {mission.supplier?.lastname}
      </Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() =>
          handleRedirectFicheMission(mission.mission_number ?? empty)
        }
      >
        {mission.mission_number} -{' '}
        {getLabel({
          value: mission.job_title ?? empty,
          select: jobTitleSelect,
        }) ?? empty}
      </Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box className="col-span-1">{formatDate(mission.end_date ?? '')}</Box>
      <Box className="col-span-1">{timeBeforeMission}</Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {timeBeforeDeadlineApplication}
      </Box>
      <Box className="col-span-2">
        {getLabel({
          value: mission.job_title ?? empty,
          select: jobTitleSelect,
        }) ?? empty}
      </Box>
      <Box className="col-span-1">{mission.city ?? empty}</Box>
      <Box className="col-span-1">
        {isLoadingMatching ? <Skeleton className="size-full" /> : matchingCount}
      </Box>
      <Box className="col-span-1">
        {isLoadingSelection ? (
          <Skeleton className="size-full" />
        ) : (
          selectionCounts.discussions
        )}
      </Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {isLoadingSelection ? (
          <Skeleton className="size-full" />
        ) : (
          selectionCounts.proposes
        )}
      </Box>
      <Box className={`col-span-1`}>
        {isLoadingSelection ? (
          <Skeleton className="size-full" />
        ) : (
          selectionCounts.refuses
        )}
      </Box>
      <Box className="col-span-1 flex items-center justify-center">
        {isLoadingWebsiteVisibility ? (
          <Skeleton className="size-6" />
        ) : (
          <Switch
            checked={mission.show_on_website ?? false}
            onCheckedChange={handleWebsiteVisibilityChange}
            disabled={isLoadingWebsiteVisibility}
            className="data-[state=checked]:bg-primary"
          />
        )}
      </Box>
      <Button
        className="col-span-1 h-full"
        onClick={handleRedirectMatching}
        disabled={isLoadingMatching}
      >
        <Matching />
      </Button>
      <Button
        className="col-span-1 h-full"
        onClick={handleRedirectSelection}
        disabled={isLoadingSelection}
      >
        <Selection />
      </Button>
    </>
  );
}
