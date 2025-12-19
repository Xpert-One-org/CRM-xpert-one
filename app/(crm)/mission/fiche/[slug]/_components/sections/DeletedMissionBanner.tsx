// components/mission/sections/DeletedMissionBanner.tsx
import { reasonDeleteMissionSelect } from '@/data/mocked_select';
import { useEditMissionStore } from '../../../editMissionStore';
import SelectComponent from '@/components/SelectComponent';
import type { ReasonMissionDeletion } from '@/types/typesDb';
import TextArea from '@/components/inputs/TextArea';

export function DeletedMissionBanner() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  return (
    <>
      <p className="text-red-500">Cette mission a été supprimée</p>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">Motif de suppression</h3>
        <div className="flex w-full flex-col gap-4">
          <SelectComponent
            className="w-full max-w-[300px]"
            label="Motif de suppression"
            name={mission.reason_deletion ?? ''}
            options={reasonDeleteMissionSelect}
            defaultSelectedKeys={mission.reason_deletion}
            onValueChange={(value) =>
              handleUpdateField(
                'reason_deletion',
                value as ReasonMissionDeletion
              )
            }
          />
          <TextArea
            label="Commentaire sur la suppression"
            placeholder="Détaillez la raison de suppression de cette mission"
            value={mission.detail_deletion ?? ''}
            onChange={(e) =>
              handleUpdateField('detail_deletion', e.target.value)
            }
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}
