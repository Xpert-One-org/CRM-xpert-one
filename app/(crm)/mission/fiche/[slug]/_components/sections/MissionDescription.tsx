import TextArea from '@/components/inputs/TextArea';
import Input from '@/components/inputs/Input';
import { useEditMissionStore } from '../../../editMissionStore';

export function MissionDescription() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();

  if (!mission) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#D0DDE1] px-spaceMediumContainer py-[10px] text-black shadow-container">
      <h3 className="text-lg font-medium text-black">
        Descriptif de la mission
      </h3>
      <div className="w-full">
        <TextArea
          label="Descriptif du besoin (Détaillez votre besoin quelques lignes)"
          value={mission.description ?? ''}
          onChange={(e) => handleUpdateField('description', e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full">
        <Input
          label="Descriptif du poste (Brief complet de votre recherche)"
          value={mission.needed ?? ''}
          onChange={(e) => handleUpdateField('needed', e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full">
        <Input
          label="Les + de votre entreprise"
          value={mission.advantages_company ?? ''}
          onChange={(e) =>
            handleUpdateField('advantages_company', e.target.value)
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
