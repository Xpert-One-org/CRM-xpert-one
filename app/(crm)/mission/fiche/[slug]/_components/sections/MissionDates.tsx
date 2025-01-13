// components/mission/sections/MissionDates.tsx
import { BaseSectionProps } from '@/types/mission';
import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';

export function MissionDates() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Date de mission</h3>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          type="date"
          label="Début de mission prévisionnel"
          value={mission.start_date ? mission.start_date.split('T')[0] : ''}
          onChange={(e) => handleUpdateField('start_date', e.target.value)}
        />
        <Input
          type="date"
          label="Fin de mission prévisionnel"
          value={mission.end_date ? mission.end_date.split('T')[0] : ''}
          onChange={(e) => handleUpdateField('end_date', e.target.value)}
        />
        <Input
          type="date"
          label="Remise des candidatures"
          value={
            mission.deadline_application
              ? mission.deadline_application.split('T')[0]
              : ''
          }
          onChange={(e) =>
            handleUpdateField('deadline_application', e.target.value)
          }
        />
      </div>
      <div className="gap flex w-2/3 flex-row gap-4">
        <Input
          type="date"
          label="Début de mission définitif"
          value={mission.start_date ? mission.start_date.split('T')[0] : ''}
          onChange={(e) => handleUpdateField('start_date', e.target.value)}
        />
        <Input
          type="date"
          label="Fin de mission définitif"
          value={mission.end_date ? mission.end_date.split('T')[0] : ''}
          onChange={(e) => handleUpdateField('end_date', e.target.value)}
        />
      </div>
    </div>
  );
}
