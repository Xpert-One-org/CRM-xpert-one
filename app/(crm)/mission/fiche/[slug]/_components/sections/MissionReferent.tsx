import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';
import { useEditMissionStore } from '../../../editMissionStore';

export function MissionReferent() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Référent de mission</h3>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-1/3"
          label="Nom du référent de mission"
          value={mission.referent_name ?? ''}
          onChange={(e) => handleUpdateField('referent_name', e.target.value)}
        />
        <Input
          className="w-1/3"
          label="Tél mobile référent de mission"
          value={mission.referent_mobile ?? ''}
          onChange={(e) => handleUpdateField('referent_mobile', e.target.value)}
        />
        <Input
          className="w-1/3"
          label="Tél fixe référent de mission"
          value={mission.referent_fix ?? ''}
          onChange={(e) => handleUpdateField('referent_fix', e.target.value)}
        />
      </div>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-1/3"
          label="Mail du référent de mission"
          value={mission.referent_mail ?? empty}
          onChange={(e) => handleUpdateField('referent_mail', e.target.value)}
        />
      </div>
    </div>
  );
}
