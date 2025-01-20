import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';
import { useEditMissionStore } from '../../../editMissionStore';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';

export function MissionReferentSupplier() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Référent fournisseur</h3>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-1/3"
          label="Nom du référent fournisseur"
          value={`${mission.referent_name ?? ''}`}
          onChange={(e) => handleUpdateField('referent_name', e.target.value)}
        />
        <PhoneInputComponent
          label="Tél portable référent fournisseur"
          name="mobile"
          className="w-1/3"
          placeholder={empty}
          value={mission.referent_mobile ?? ''}
          defaultSelectedKeys={mission.referent_mobile ?? ''}
        />
        <PhoneInputComponent
          label="Tél fix référent fournisseur"
          name="mobile"
          className="w-1/3"
          placeholder={empty}
          value={mission.referent?.fix ?? ''}
          defaultSelectedKeys={mission.referent_fix ?? ''}
        />
      </div>
      <div className="gap flex w-full flex-row gap-4">
        <Input
          className="w-1/3"
          label="Mail du référent fournisseur"
          value={mission.referent_mail ?? empty}
          onChange={(e) => handleUpdateField('referent_mail', e.target.value)}
        />
      </div>
    </div>
  );
}
