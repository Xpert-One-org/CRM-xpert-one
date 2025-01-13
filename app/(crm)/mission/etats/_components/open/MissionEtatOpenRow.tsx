import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { getTimeBeforeMission } from '@/utils/string';
import { empty } from '@/data/constant';
import { getLabel } from '@/utils/getLabel';
import { useSelect } from '@/store/select';
import Matching from '@/components/svg/Matching';
import Selection from '@/components/svg/Selection';
import { Button } from '@/components/ui/button';
import {
  getCountMatchedXperts,
  getMissionSelectionXperts,
} from '../../mission-etat-open.action';
import { Skeleton } from '@/components/ui/skeleton';

export default function MissionEtatOpenRow({
  mission,
}: {
  mission: DBMission;
}) {
  const router = useRouter();
  const { jobTitles } = useSelect();

  const [matchingCount, setMatchingCount] = useState<number>(0);
  const [isLoadingMatching, setIsLoadingMatching] = useState<boolean>(false);
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

    const diffTime = Math.abs(currentDate.getTime() - submissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 10) {
      return 'bg-[#D64242] text-white';
    } else if (diffDays >= 30) {
      return 'bg-accent text-white';
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
        {mission.supplier?.generated_id}
      </Box>
      <Box
        className="col-span-1 cursor-pointer bg-primary text-white"
        primary
        onClick={() =>
          handleRedirectFicheMission(mission.mission_number ?? empty)
        }
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{mission.referent_name ?? empty}</Box>
      <Box className="col-span-1">{timeBeforeMission}</Box>
      <Box className={`col-span-1 ${getBackgroundClass}`}>
        {timeBeforeDeadlineApplication}
      </Box>
      <Box className="col-span-2">
        {getLabel({ value: mission.job_title ?? empty, select: jobTitles }) ??
          empty}
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
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      <Box className="col-span-1">{formatDate(mission.end_date ?? '')}</Box>
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
