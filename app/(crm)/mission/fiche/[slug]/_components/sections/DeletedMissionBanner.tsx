// components/mission/sections/DeletedMissionBanner.tsx
import { reasonDeleteMissionSelect } from '@/data/mocked_select';
import { getLabel } from '@/utils/getLabel';
import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';

type DeletedMissionBannerProps = {
  reason: string | null;
};

export function DeletedMissionBanner({ reason }: DeletedMissionBannerProps) {
  return (
    <>
      <p className="text-red-500">Cette mission a été supprimée</p>
      <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
        <h3 className="text-lg font-medium text-black">Motif de suppression</h3>
        <div className="gap flex w-full flex-row gap-4">
          <Input
            className="w-full max-w-[220px]"
            label="Motif de suppression"
            value={
              getLabel({
                value: reason ?? '',
                select: reasonDeleteMissionSelect,
              }) ?? empty
            }
          />
        </div>
      </div>
    </>
  );
}
