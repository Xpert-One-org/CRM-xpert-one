import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';

export function MissionEvaluation() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Évaluation XPERT</h3>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-1/3"
          label="Évaluation"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
        <Input
          className="w-1/3"
          label="Auto Évaluation"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
      </div>
    </div>
  );
}
