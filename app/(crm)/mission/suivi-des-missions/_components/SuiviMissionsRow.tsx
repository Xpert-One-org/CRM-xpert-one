import React from 'react';
import { Box } from '@/components/ui/box';
import type { DBMission, DBMissionCheckpoint } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { useRouter } from 'next/navigation';
import { convertStateValue } from '@/utils/stateMissionConverter';
import { cn } from '@/lib/utils';
import { CheckpointBox } from './CheckpointBox';
import { Database } from '@/types/supabase';
import { useMissionStore } from '@/store/mission';

type CheckpointField = keyof Pick<
  DBMissionCheckpoint,
  | 'point_j_moins_10_f'
  | 'point_j_moins_10_x'
  | 'point_j_plus_10_f'
  | 'point_j_plus_10_x'
  | 'point_j_plus_10_referent'
  | 'point_rh_fin_j_plus_10_f'
  | 'point_fin_j_moins_30'
>;

export default function SuiviMissionsRow({ mission }: { mission: DBMission }) {
  const router = useRouter();
  const { updateMissionCheckpoints } = useMissionStore();

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  // Fonction pour calculer les jours restants
  const calculateDaysInfo = (
    startDate: string | null,
    endDate: string | null
  ): {
    daysUntilStart: number | null;
    isPastStart: boolean;
    daysUntilJPlus10: number | null;
    isPastJPlus10: boolean;
    daysUntilEndPlus10: number | null;
    isPastEndPlus10: boolean;
    daysUntilEndMinus30: number | null;
    isPastEndMinus30: boolean;
  } => {
    if (!startDate)
      return {
        daysUntilStart: null,
        isPastStart: false,
        daysUntilJPlus10: null,
        isPastJPlus10: false,
        daysUntilEndPlus10: null,
        isPastEndPlus10: false,
        daysUntilEndMinus30: null,
        isPastEndMinus30: false,
      };

    const start = new Date(startDate);
    const jPlus10 = new Date(start);
    jPlus10.setDate(jPlus10.getDate() + 10);
    const today = new Date();

    const diffTimeStart = start.getTime() - today.getTime();
    const diffTimeJPlus10 = jPlus10.getTime() - today.getTime();

    let endPlus10Info = {
      daysUntilEndPlus10: null as number | null,
      isPastEndPlus10: false,
    };
    let endMinus30Info = {
      daysUntilEndMinus30: null as number | null,
      isPastEndMinus30: false,
    };

    if (endDate) {
      const end = new Date(endDate);
      const endPlus10 = new Date(end);
      endPlus10.setDate(endPlus10.getDate() + 10);
      const endMinus30 = new Date(end);
      endMinus30.setDate(endMinus30.getDate() - 30);

      const diffTimeEndPlus10 = endPlus10.getTime() - today.getTime();
      const diffTimeEndMinus30 = endMinus30.getTime() - today.getTime();

      endPlus10Info = {
        daysUntilEndPlus10: Math.abs(
          Math.ceil(diffTimeEndPlus10 / (1000 * 60 * 60 * 24))
        ),
        isPastEndPlus10: diffTimeEndPlus10 < 0,
      };

      endMinus30Info = {
        daysUntilEndMinus30: Math.abs(
          Math.ceil(diffTimeEndMinus30 / (1000 * 60 * 60 * 24))
        ),
        isPastEndMinus30: diffTimeEndMinus30 < 0,
      };
    }

    return {
      daysUntilStart: Math.abs(
        Math.ceil(diffTimeStart / (1000 * 60 * 60 * 24))
      ),
      isPastStart: diffTimeStart < 0,
      daysUntilJPlus10: Math.abs(
        Math.ceil(diffTimeJPlus10 / (1000 * 60 * 60 * 24))
      ),
      isPastJPlus10: diffTimeJPlus10 < 0,
      ...endPlus10Info,
      ...endMinus30Info,
    };
  };

  // Fonction pour déterminer la couleur de la case pour les J-
  const getBeforeStartColor = (
    daysInfo: ReturnType<typeof calculateDaysInfo>
  ): string => {
    if (daysInfo.daysUntilStart === null) return '';
    if (daysInfo.isPastStart) return 'bg-[#D64242] text-white'; // Rouge si la date est passée
    if (daysInfo.daysUntilStart <= 5) return 'bg-[#D64242] text-white'; // Rouge à partir de J-5
    if (daysInfo.daysUntilStart <= 10) return 'bg-[#F9A800BF] text-white'; // Orange à partir de J-10
    return '';
  };

  // Fonction pour déterminer la couleur de la case pour les J+10
  const getAfterStartColor = (
    daysInfo: ReturnType<typeof calculateDaysInfo>
  ): string => {
    if (daysInfo.daysUntilJPlus10 === null) return '';
    if (daysInfo.isPastJPlus10) return 'bg-[#D64242] text-white'; // Rouge si J+10 est passé
    if (!daysInfo.isPastStart) return ''; // Pas de couleur si la mission n'a pas commencé
    if (daysInfo.daysUntilJPlus10 <= 5) return 'bg-[#F9A800BF] text-white'; // Orange si proche de J+10
    return '';
  };

  // Fonction pour déterminer la couleur de la case pour les points de fin de mission
  const getEndMissionColor = (
    daysInfo: ReturnType<typeof calculateDaysInfo>,
    stage: 'endPlus10' | 'endMinus30'
  ): string => {
    switch (stage) {
      case 'endPlus10':
        if (daysInfo.daysUntilEndPlus10 === null) return '';
        if (daysInfo.isPastEndPlus10) return 'bg-[#D64242] text-white'; // Rouge si J+10 est passé
        if (daysInfo.daysUntilEndPlus10 <= 5)
          return 'bg-[#F9A800BF] text-white'; // Orange si proche de J+10
        return '';
      case 'endMinus30':
        if (daysInfo.daysUntilEndMinus30 === null) return '';
        if (daysInfo.isPastEndMinus30) return 'bg-[#D64242] text-white'; // Rouge si J-30 est passé
        if (daysInfo.daysUntilEndMinus30 <= 10)
          return 'bg-[#F9A800BF] text-white'; // Orange si proche de J-30
        return '';
      default:
        return '';
    }
  };

  const formatDaysDisplay = (
    daysInfo: ReturnType<typeof calculateDaysInfo>,
    isJPlus: boolean
  ): string => {
    if (daysInfo.daysUntilStart === null) return '';

    // Pour les points J-
    if (!isJPlus) {
      if (daysInfo.daysUntilStart === 0) {
        return "C'est aujourd'hui !";
      }
      if (daysInfo.isPastStart) {
        return `Date passée (${daysInfo.daysUntilStart}j)`;
      }
      return `J-${daysInfo.daysUntilStart}`;
    }

    // Pour les points J+10
    if (daysInfo.daysUntilJPlus10 === 0) {
      return "C'est aujourd'hui !";
    }
    if (daysInfo.isPastJPlus10) {
      return `Date passée (${daysInfo.daysUntilJPlus10}j)`;
    }
    return `J-${daysInfo.daysUntilJPlus10}`;
  };

  // Format display for End+10 stage
  const formatEndPlus10Display = (
    daysInfo: ReturnType<typeof calculateDaysInfo>
  ): string => {
    if (daysInfo.daysUntilEndPlus10 === null) return '';
    if (daysInfo.daysUntilEndPlus10 === 0) return "C'est aujourd'hui !";
    if (daysInfo.isPastEndPlus10) {
      return `Point passé (${daysInfo.daysUntilEndPlus10}j)`;
    }
    return `J-${daysInfo.daysUntilEndPlus10}`;
  };

  // Format display for End-30 stage
  const formatEndMinus30Display = (
    daysInfo: ReturnType<typeof calculateDaysInfo>
  ): string => {
    if (daysInfo.daysUntilEndMinus30 === null) return '';
    if (daysInfo.daysUntilEndMinus30 === 0) return "C'est aujourd'hui !";
    if (daysInfo.isPastEndMinus30) {
      return `Point passé (${daysInfo.daysUntilEndMinus30}j)`;
    }
    return `J-${daysInfo.daysUntilEndMinus30}`;
  };

  // Main format function that delegates to specific formatters
  const formatEndMissionDisplay = (
    daysInfo: ReturnType<typeof calculateDaysInfo>,
    stage: 'endPlus10' | 'endMinus30'
  ): string => {
    switch (stage) {
      case 'endPlus10':
        return formatEndPlus10Display(daysInfo);
      case 'endMinus30':
        return formatEndMinus30Display(daysInfo);
      default:
        return '';
    }
  };

  const daysInfo = calculateDaysInfo(mission.start_date, mission.end_date);

  const handleCheckpointToggle = (
    field: CheckpointField,
    newValue: boolean
  ) => {
    updateMissionCheckpoints(mission.id, {
      [field]: newValue,
    });
  };

  return (
    <div className="grid grid-cols-11 gap-3">
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      {/* Point J-10 F */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_moins_10_f ?? false}
        daysDisplay={formatDaysDisplay(daysInfo, false)}
        colorClass={getBeforeStartColor(daysInfo)}
        missionId={mission.id}
        checkpointField="point_j_moins_10_f"
        onToggle={handleCheckpointToggle}
      />
      {/* Point J-10 X */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_moins_10_x ?? false}
        daysDisplay={formatDaysDisplay(daysInfo, false)}
        colorClass={getBeforeStartColor(daysInfo)}
        missionId={mission.id}
        checkpointField="point_j_moins_10_x"
        onToggle={handleCheckpointToggle}
      />
      {/* Point J+10 F */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_plus_10_f ?? false}
        daysDisplay={formatDaysDisplay(daysInfo, true)}
        colorClass={getAfterStartColor(daysInfo)}
        missionId={mission.id}
        checkpointField="point_j_plus_10_f"
        onToggle={handleCheckpointToggle}
      />
      {/* Point J+10 X */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_plus_10_x ?? false}
        daysDisplay={formatDaysDisplay(daysInfo, true)}
        colorClass={getAfterStartColor(daysInfo)}
        missionId={mission.id}
        checkpointField="point_j_plus_10_x"
        onToggle={handleCheckpointToggle}
      />
      {/* Point J+10 Référent */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_plus_10_referent ?? false}
        daysDisplay={formatDaysDisplay(daysInfo, true)}
        colorClass={getAfterStartColor(daysInfo)}
        missionId={mission.id}
        checkpointField="point_j_plus_10_referent"
        onToggle={handleCheckpointToggle}
      />
      {/* Point RH fin de mission J+10 F */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_rh_fin_j_plus_10_f ?? false}
        daysDisplay={formatEndMissionDisplay(daysInfo, 'endPlus10')}
        colorClass={getEndMissionColor(daysInfo, 'endPlus10')}
        missionId={mission.id}
        checkpointField="point_rh_fin_j_plus_10_f"
        onToggle={handleCheckpointToggle}
      />
      {/* Point fin de mission J-30 */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_fin_j_moins_30 ?? false}
        daysDisplay={formatEndMissionDisplay(daysInfo, 'endMinus30')}
        colorClass={getEndMissionColor(daysInfo, 'endMinus30')}
        missionId={mission.id}
        checkpointField="point_fin_j_moins_30"
        onToggle={handleCheckpointToggle}
      />
      <Box className="col-span-1">{mission.referent_name}</Box>
    </div>
  );
}
