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
import {
  getAfterStartColor,
  getBeforeStartColor,
  getEndMissionColor,
} from '../_functions/getBoxColor';
import {
  calculateDaysInfo,
  formatDaysDisplay,
  formatEndMissionDisplay,
} from '../_functions/day.actions';
import type { CheckpointField } from '@/types/types';

export default function SuiviMissionsRow({ mission }: { mission: DBMission }) {
  const router = useRouter();
  const { updateMissionCheckpoints } = useMissionStore();

  const handleRedirectFicheMission = (number: string) => {
    const formattedNumber = number.replaceAll(' ', '-');
    router.push(`/mission/fiche/${formattedNumber}`);
  };

  // Main format function that delegates to specific formatters

  const daysInfo = calculateDaysInfo(mission.start_date, mission.end_date);

  const dateBefore = new Date(mission.start_date ?? '');
  dateBefore.setDate(dateBefore.getDate() - 10);
  const daysInfoBefore = calculateDaysInfo(
    dateBefore.toString(),
    mission.end_date
  );

  const handleCheckpointToggle = (
    field: CheckpointField,
    newValue: boolean
  ) => {
    console.log('field', field);
    updateMissionCheckpoints(mission.id, {
      [field]: newValue,
    });
  };

  return (
    <div className="grid grid-cols-12 gap-3">
      <Box className="col-span-1">{convertStateValue(mission.state)}</Box>
      <Box
        className="col-span-1 cursor-pointer text-white"
        primary
        onClick={() => handleRedirectFicheMission(mission.mission_number ?? '')}
      >
        {mission.mission_number}
      </Box>
      <Box className="col-span-1">{formatDate(mission.start_date ?? '')}</Box>
      {/* Point J-10 F (before the first point) */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_moins_10_f ?? false}
        daysDisplay={formatDaysDisplay(daysInfoBefore, false)}
        colorClass={getBeforeStartColor(daysInfoBefore)}
        missionId={mission.id}
        checkpointField="point_j_moins_10_f"
        onToggle={handleCheckpointToggle}
      />

      {/* Point J-10 X (before the first point) */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_moins_10_x ?? false}
        daysDisplay={formatDaysDisplay(daysInfoBefore, false)}
        colorClass={getBeforeStartColor(daysInfoBefore)}
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
      {/* Point Trimestre Xpert */}
      {/* <CheckpointBox
        value={mission.checkpoints?.[0]?.point_trimestre_x ?? false}
        daysDisplay={formatDaysDisplay(daysInfo, true)}
        colorClass={getAfterStartColor(daysInfo)}
        missionId={mission.id}
        checkpointField="point_trimestre_x"
        onToggle={handleCheckpointToggle}
      /> */}
      <Box className="">
        <p></p>
      </Box>
      {/* Point fin de mission J-30 */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_fin_j_moins_30 ?? false}
        daysDisplay={formatEndMissionDisplay(daysInfo, 'endMinus30')}
        colorClass={getEndMissionColor(daysInfo, 'endMinus30')}
        missionId={mission.id}
        checkpointField="point_fin_j_moins_30"
        onToggle={handleCheckpointToggle}
      />
      {/* Point J+10 Référent */}
      <CheckpointBox
        value={mission.checkpoints?.[0]?.point_j_plus_10_referent ?? false}
        daysDisplay={formatEndMissionDisplay(daysInfo, 'endPlus10')}
        colorClass={getEndMissionColor(daysInfo, 'endPlus10')}
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

      <Box className="col-span-1">
        {`${mission.referent?.firstname ?? ''} ${mission.referent?.lastname ?? ''}`}
      </Box>
    </div>
  );
}
