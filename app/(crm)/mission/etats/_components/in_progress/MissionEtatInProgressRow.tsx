import type { DBMission } from '@/types/typesDb';
import { getTimeBeforeMission } from '@/utils/string';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Box } from '@/components/ui/box';
import { empty } from '@/data/constant';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import BriefCase from '@/components/svg/BriefCase';
import FacturationLogo from '@/components/svg/Facturation';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { getFileTypeByStatus } from '../../../activation-des-missions/[slug]/_utils/getFileTypeByStatus';
import { getLabel } from '@/utils/getLabel';
import { jobTitleSelect } from '@/data/mocked_select';

export default function MissionEtatInProgressRow({
  mission,
}: {
  mission: DBMission;
}) {
  const [fileStatuses, setFileStatuses] = useState<
    Record<string, { exists: boolean; createdAt?: string }>
  >({});
  const router = useRouter();
  const missionXpertStatus = mission.xpert_associated_status;
  useEffect(() => {
    const fetchFileStatuses = async () => {
      const supabase = createSupabaseFrontendClient();

      const xpertTypes = [
        getFileTypeByStatus('recap_mission_signed', missionXpertStatus ?? ''),
        getFileTypeByStatus('contrat_signed', missionXpertStatus ?? ''),
        getFileTypeByStatus(
          'commande_societe_signed',
          missionXpertStatus ?? ''
        ),
        getFileTypeByStatus('commande', missionXpertStatus ?? ''),
      ];

      const statuses: Record<string, { exists: boolean; createdAt?: string }> =
        {};

      if (mission.xpert?.generated_id) {
        for (const type of xpertTypes) {
          const basePath = `${mission.mission_number}/${mission.xpert?.generated_id}/activation/${type}`;

          const { data: files, error } = await supabase.storage
            .from('mission_files')
            .list(basePath);

          if (!error && files && files.length > 0) {
            const sortedFiles = files.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
            statuses[type] = {
              exists: true,
              createdAt: sortedFiles[0].created_at,
            };
          } else {
            statuses[type] = { exists: false };
          }
        }
      }

      if (mission.supplier?.generated_id) {
        const fournisseurType = getFileTypeByStatus(
          'contrat_commande',
          missionXpertStatus ?? ''
        );
        const basePath = `${mission.mission_number}/${mission.supplier?.generated_id}/activation/${fournisseurType}`;

        const { data: files, error } = await supabase.storage
          .from('mission_files')
          .list(basePath);

        if (!error && files && files.length > 0) {
          const sortedFiles = files.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          statuses[fournisseurType] = {
            exists: true,
            createdAt: sortedFiles[0].created_at,
          };
        } else {
          statuses[fournisseurType] = { exists: false };
        }
      }

      setFileStatuses(statuses);
    };

    fetchFileStatuses();
  }, [
    mission.mission_number,
    mission.xpert?.generated_id,
    mission.supplier?.generated_id,
    missionXpertStatus,
  ]);

  const createdAt = formatDate(mission.created_at);
  const timeBeforeMission = getTimeBeforeMission(mission.start_date ?? '');

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

  const getBackgroundClass = (fileExists: boolean) => {
    if (fileExists) {
      return 'bg-[#e1e1e1] text-black';
    }

    const endDate = new Date(mission.end_date ?? '');
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - endDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 15) {
      return 'bg-accent text-white';
    }
    if (diffDays >= 10) {
      return 'bg-[#D64242] text-white';
    }

    return '';
  };

  const handleRedirectionActivation = () => {
    router.push(
      `/mission/activation-des-missions/${mission.mission_number?.replaceAll(' ', '-')}`
    );
  };

  const handleRedirectionFacturation = () => {
    router.push(
      `/facturation/gestion-des-facturations/${mission.mission_number?.replaceAll(' ', '-')}`
    );
  };

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
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number} -{' '}
        {getLabel({
          value: mission.job_title ?? empty,
          select: jobTitleSelect,
        }) ?? empty}
      </Box>
      <Box className="col-span-1">{`${mission.referent?.firstname ?? ''} ${mission.referent?.lastname ?? ''}`}</Box>
      <Box className="col-span-1">{timeBeforeMission}</Box>
      <Box
        className={cn('col-span-1 text-white', {
          'cursor-pointer': mission.xpert?.id,
        })}
        primary
        onClick={() => handleRedirectXpert(mission.xpert?.generated_id ?? '')}
      >
        {mission.xpert?.generated_id} - {mission.xpert?.firstname}{' '}
        {mission.xpert?.lastname}{' '}
      </Box>
      <Box
        className={`col-span-2 ${getBackgroundClass(
          fileStatuses[
            getFileTypeByStatus(
              'recap_mission_signed',
              missionXpertStatus ?? ''
            )
          ]?.exists || false
        )}`}
      >
        {fileStatuses[
          getFileTypeByStatus('recap_mission_signed', missionXpertStatus ?? '')
        ]?.exists
          ? `Reçu le ${formatDate(
              fileStatuses[
                getFileTypeByStatus(
                  'recap_mission_signed',
                  missionXpertStatus ?? ''
                )
              ].createdAt ?? ''
            )}`
          : 'Non reçu'}
      </Box>
      <Box
        className={`col-span-1 ${getBackgroundClass(
          fileStatuses[
            getFileTypeByStatus(
              missionXpertStatus === 'cdi'
                ? 'contrat_signed'
                : missionXpertStatus === 'freelance'
                  ? 'commande_societe_signed'
                  : 'commande',
              missionXpertStatus ?? ''
            )
          ]?.exists || false
        )}`}
      >
        {fileStatuses[
          getFileTypeByStatus(
            missionXpertStatus === 'cdi'
              ? 'contrat_signed'
              : missionXpertStatus === 'freelance'
                ? 'commande_societe_signed'
                : 'commande',
            missionXpertStatus ?? ''
          )
        ]?.exists
          ? `Reçu le ${formatDate(
              fileStatuses[
                getFileTypeByStatus(
                  missionXpertStatus === 'cdi'
                    ? 'contrat_signed'
                    : missionXpertStatus === 'freelance'
                      ? 'commande_societe_signed'
                      : 'commande',
                  missionXpertStatus ?? ''
                )
              ].createdAt ?? ''
            )}`
          : 'Non reçu'}
      </Box>
      <Box
        className={`col-span-1 ${getBackgroundClass(
          fileStatuses[
            getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
          ]?.exists || false
        )}`}
      >
        {fileStatuses[
          getFileTypeByStatus('contrat_commande', missionXpertStatus ?? '')
        ]?.exists
          ? `Reçu le ${formatDate(
              fileStatuses[
                getFileTypeByStatus(
                  'contrat_commande',
                  missionXpertStatus ?? ''
                )
              ].createdAt ?? ''
            )}`
          : 'Non reçu'}
      </Box>
      <Button
        className="col-span-1 h-full"
        onClick={handleRedirectionActivation}
      >
        <BriefCase width={28} height={28} className="fill-white" />
      </Button>
      <Button
        className="col-span-1 h-full"
        onClick={handleRedirectionFacturation}
      >
        <FacturationLogo width={28} height={28} className="fill-white" />
      </Button>
    </>
  );
}
