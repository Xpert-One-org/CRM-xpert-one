// components/mission/sections/MissionLocation.tsx
import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';

export function MissionLocation() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Lieu de la mission</h3>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-full max-w-[120px]"
          label="N° de rue"
          value={mission.address?.split(' ')[0] ?? ''}
          onChange={(e) => {
            const newAddress = mission.address?.replace(/^\S+\s*/, '') ?? '';
            handleUpdateField('address', `${e.target.value} ${newAddress}`);
          }}
        />
        <Input
          className="w-full max-w-[280px]"
          label="Adresse postale"
          value={mission.address?.split(' ').slice(1).join(' ') ?? ''}
          onChange={(e) => {
            const streetNumber = mission.address?.split(' ')[0] ?? '';
            handleUpdateField('address', `${streetNumber} ${e.target.value}`);
          }}
        />
        <Input
          className="w-[170px]"
          label="Ville"
          value={mission.city ?? ''}
          onChange={(e) => handleUpdateField('city', e.target.value)}
        />
        <Input
          className="w-full max-w-[120px]"
          label="Code postal"
          value={mission.postal_code ?? ''}
          onChange={(e) => handleUpdateField('postal_code', e.target.value)}
        />
        <Input
          className="w-full max-w-[200px]"
          label="Pays"
          value={mission.country ?? ''}
          onChange={(e) => handleUpdateField('country', e.target.value)}
        />
      </div>
    </div>
  );
}
