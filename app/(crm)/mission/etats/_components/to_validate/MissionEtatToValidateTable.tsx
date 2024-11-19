import React, { useState } from 'react';
import { FilterButton } from '@/components/FilterButton';
import MissionEtatToValidateRow from './MissionEtatToValidateRow';
import { Button } from '@/components/ui/button';
import { useMissionStore } from '@/store/mission';
import { toast } from 'sonner';

export function MissionEtatToValidateTable() {
  const { missions, updateMission } = useMissionStore();

  const [validatedOpenAll, setValidatedOpenAll] = useState<
    Record<string, boolean>
  >({});

  const [validatedMissions, setValidatedMissions] = useState<
    Record<string, boolean>
  >({});

  const signUpDateOptions = [
    { label: 'Toutes', value: '' },
    { label: '1 semaine', value: '1_week' },
    { label: '2 semaines', value: '2_weeks' },
    { label: '3 semaines', value: '3_weeks' },
    { label: '4 semaines', value: '4_weeks' },
  ];

  const handleValidationChange = (missionId: string, isValidated: boolean) => {
    setValidatedMissions((prev) => ({
      ...prev,
      [missionId]: isValidated,
    }));
  };

  const handleValidationChangeAll = (
    missionId: string,
    isOpenAllValidated: boolean
  ) => {
    setValidatedOpenAll((prev) => ({
      ...prev,
      [missionId]: isOpenAllValidated,
    }));
  };

  const handleSaveAll = async () => {
    for (const [missionId, isValidated] of Object.entries(validatedOpenAll)) {
      if (isValidated) {
        await updateMission(missionId, 'open_all_to_validate');
      }
    }

    for (const [missionId, isValidated] of Object.entries(validatedMissions)) {
      if (isValidated) {
        const currentMissions = useMissionStore.getState().missions;
        const mission = currentMissions.find(
          (m) => m.id.toString() === missionId
        );
        if (mission?.state === 'open_all_to_validate') {
          await updateMission(missionId, 'open_all');
        } else {
          await updateMission(missionId, 'open');
        }
      }
    }

    if (Object.keys(validatedOpenAll).length > 0) {
      toast.success(
        `Vous avez mis ${Object.keys(validatedOpenAll).length} missions à ouvrir à tous`
      );
    }
    if (Object.keys(validatedMissions).length > 0) {
      toast.success(
        `Vous avez validé ${Object.keys(validatedMissions).length} missions`
      );
    }

    setValidatedOpenAll({});
    setValidatedMissions({});
  };

  return (
    <>
      <div className="grid grid-cols-8 gap-3">
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Créer le"
        />
        <FilterButton placeholder="N° de fournisseur" filter={false} />
        <FilterButton placeholder="N° de mission" filter={false} />
        <FilterButton
          options={signUpDateOptions}
          defaultSelectedKeys=""
          onValueChange={() => {}}
          placeholder="Référent Xpert One"
          filter={false}
        />
        <FilterButton
          placeholder="Temps avant début de mission"
          filter={false}
        />
        <FilterButton placeholder="Poste" filter={false} />
        <FilterButton placeholder="Ouverte à tous" filter={false} />
        <FilterButton placeholder="Valider la mission ?" filter={false} />
        {missions
          .filter(
            (mission) =>
              mission.state === 'to_validate' ||
              mission.state === 'open_all_to_validate'
          )
          .map((mission) => (
            <MissionEtatToValidateRow
              key={mission.id}
              mission={mission}
              onValidationChange={handleValidationChange}
              onValidationChangeAll={handleValidationChangeAll}
            />
          ))}
      </div>
      {(Object.keys(validatedMissions).length > 0 ||
        Object.keys(validatedOpenAll).length > 0) && (
        <div className="fixed bottom-10 right-10">
          <Button
            className="bg-primary px-spaceLarge py-spaceContainer text-white"
            onClick={handleSaveAll}
          >
            Enregistrer
          </Button>
        </div>
      )}
    </>
  );
}
