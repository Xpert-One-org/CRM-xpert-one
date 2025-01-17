import Input from '@/components/inputs/Input';
import { empty } from '@/data/constant';
import { useEditMissionStore } from '../../../editMissionStore';
import PhoneInputComponent from '@/components/inputs/PhoneInputComponent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminCollaborators } from '@/store/adminCollaborators';
import { useEffect } from 'react';

export function MissionReferentXpertOne() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  const { collaborators, fetchCollaborators } = useAdminCollaborators();

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">Référent de mission</h3>
      <div className="gap flex max-w-[200px] flex-row gap-4">
        <Select
          value={mission.affected_referent_id ?? 'none'}
          onValueChange={(value) =>
            handleUpdateField('affected_referent_id', value)
          }
        >
          <SelectTrigger className="h-full justify-center gap-2 border-0 bg-[#F5F5F5]">
            <SelectValue placeholder="Référent de mission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun</SelectItem>
            {collaborators
              .filter((c) => c.role === 'admin' || c.role === 'project_manager')
              .map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.firstname} {c.lastname}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
