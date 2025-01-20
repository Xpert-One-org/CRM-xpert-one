// components/mission/sections/MissionFinancials.tsx
import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';
import {
  calculateFinalRevenue,
  calculateProjectedRevenue,
} from '../../../utils/tjm';

export function MissionFinancials() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  const projectedRevenue = calculateProjectedRevenue(
    22,
    parseInt(mission.tjm ?? '0'),
    30
  );
  const finalRevenue = calculateFinalRevenue(
    22,
    parseInt(mission.tjm ?? '0'),
    30
  );
  const selledTjmGd = parseInt(mission.tjm ?? '0') + 30 * 1.55;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Information monétaire</h3>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-full max-w-[220px]"
          type="number"
          label="CA prévisionnel de la mission"
          value={projectedRevenue}
          disabled
        />
        <Input
          className="max-max-w-[320px] w-full"
          type="number"
          label="CA définitif de la mission"
          value={finalRevenue}
          disabled
        />
        <Input
          className="w-full max-w-[220px]"
          type="number"
          label="Prix Grand Déplacement / jour"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
      </div>
      <div className="gap flex w-full flex-row flex-wrap gap-4">
        <Input
          className="max-w-[220px]"
          type="number"
          label="TJM Validé Xpert (GD inclus)"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
        <Input
          className="max-w-[220px]"
          type="number"
          label="TJM Base Fournisseur (GD inclus)"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
        <Input
          className="max-w-[160px]"
          type="number"
          label="Statut définitif"
          value={projectedRevenue}
          disabled
        />
        <Input
          className="max-w-[160px]"
          type="number"
          label="Charge patronale"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
        <Input
          className="max-w-[160px]"
          type="number"
          label="TJM Cible max"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
      </div>
      <div className="gap flex-wr flex w-1/4 flex-row gap-4">
        <Input
          className="max-w-[220px]"
          type="number"
          label="TJM vendu GD + charge incluse"
          value={selledTjmGd}
          disabled
        />
        <Input
          className="max-w-[320px]"
          type="number"
          label="Marge totale"
          value={mission.tjm ?? ''}
          onChange={(e) => handleUpdateField('tjm', e.target.value)}
        />
      </div>
    </div>
  );
}
