import { useState } from 'react';
import { Box } from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';
import { toggleMissionCheckpoint } from '../mission-checkpoints.action';
import type { CheckpointField } from '@/types/types';

type MissionCheckpoint =
  Database['public']['Tables']['mission_checkpoints']['Row'];

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
      console.error(error);
      toast.error('Erreur lors de la mise à jour du point');
    } else if (data) {
      onToggle(checkpointField, data[checkpointField] ?? false);
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
