import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';
import { toggleMissionCheckpoint } from '../mission-checkpoints.action';

type MissionCheckpoint =
  Database['public']['Tables']['mission_checkpoints']['Row'];
type CheckpointField = keyof Pick<
  MissionCheckpoint,
  | 'point_j_moins_10_f'
  | 'point_j_moins_10_x'
  | 'point_j_plus_10_f'
  | 'point_j_plus_10_x'
  | 'point_j_plus_10_referent'
  | 'point_rh_fin_j_plus_10_f'
  | 'point_fin_j_moins_30'
>;

type CheckpointBoxProps = {
  value: boolean;
  daysDisplay: string;
  colorClass: string;
  missionId: number;
  checkpointField: CheckpointField;
  onToggle: (field: CheckpointField, newValue: boolean) => void;
};

export function CheckpointBox({
  value,
  daysDisplay,
  colorClass,
  missionId,
  checkpointField,
  onToggle,
}: CheckpointBoxProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const { data, error } = await toggleMissionCheckpoint(
      missionId,
      checkpointField
    );

    if (error) {
      toast.error('Erreur lors de la mise à jour du point');
    } else if (data) {
      onToggle(checkpointField, data[checkpointField]);
    }

    setIsLoading(false);
  };

  return (
    <Box
      className={cn(
        'col-span-1 cursor-pointer transition-all',
        value ? 'bg-[#248D6180] text-white' : colorClass,
        isLoading && 'opacity-50'
      )}
      onClick={handleToggle}
    >
      {value ? 'Traité' : daysDisplay}
    </Box>
  );
}
