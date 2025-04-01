import React, { useState } from 'react';
import { FilterButton } from '@/components/FilterButton';
import { Button } from '@/components/ui/button';
import { useMissionStore } from '@/store/mission';
import { toast } from 'sonner';
import MissionEtatInProcessRow from './MissionEtatInProcessRow';
import type { DBMissionState, ReasonMissionDeletion } from '@/types/typesDb';
import { getLabel } from '@/utils/getLabel';
import { reasonDeleteMissionSelect } from '@/data/mocked_select';
import { sortDateOptions } from '@/data/filter';

// Ajout d'un tableau local avec une option de réinitialisation
const sortDateOptionsWithReset = [
  ...sortDateOptions,
  { label: 'Réinitialiser', value: '' },
];

export function MissionEtatInProcessTable() {
  const { missions, updateMission } = useMissionStore();
  const [sortedMissions, setSortedMissions] = useState(missions);

  const [validatedOpenAll, setValidatedOpenAll] = useState<
    Record<string, boolean>
  >({});

  const [validatedMissions, setValidatedMissions] = useState<
    Record<
      string,
      { state: string | null; reason?: ReasonMissionDeletion; details?: string }
    >
  >({});

  const handleValidationChange = (
    missionId: string,
    state: string | null,
    reason?: ReasonMissionDeletion,
    details?: string
  ) => {
    setValidatedMissions((prev) => ({
      ...prev,
      [missionId]: { state, reason, details },
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
      const currentMissions = useMissionStore.getState().missions;
      const mission = currentMissions.find(
        (m) => m.id.toString() === missionId
      );
      if (isValidated) {
        await updateMission(missionId, 'open_all_to_validate');
        toast.success(
          `Vous avez mise à jour le statut de la mission ${mission?.mission_number} à ouvrir à tous`
        );
      } else {
        await updateMission(missionId, 'in_process');
        toast.success(
          `Vous avez mise à jour le statut de la mission ${mission?.mission_number} à ne pas ouvrir à tous`
        );
      }
    }

    for (const [missionId, validation] of Object.entries(validatedMissions)) {
      const { state, reason, details } = validation;
      if (state) {
        const currentMissions = useMissionStore.getState().missions;
        const mission = currentMissions.find(
          (m) => m.id.toString() === missionId
        );

        let updateState: DBMissionState;
        switch (state) {
          case 'open':
            updateState =
              mission?.state === 'open_all_to_validate' ? 'open_all' : 'open';
            toast.success(
              `Vous avez validé la mission ${mission?.mission_number} ${
                updateState === 'open' ? 'à ouvrir' : 'à ouvrir à tous'
              }`
            );
            break;
          case 'refused':
            updateState = 'refused';
            toast.success(
              `Vous avez refusé la mission ${mission?.mission_number}${reason ? ` : ${getLabel({ value: reason, select: reasonDeleteMissionSelect })}` : ''}`
            );
            break;
          default:
            updateState = 'in_process';
            toast.success(
              `Vous avez mise à jour le statut de la mission ${mission?.mission_number} en cours de traitement`
            );
        }

        await updateMission(missionId, updateState, reason, details);
      }
    }

    // Reset validation states
    setValidatedOpenAll({});
    setValidatedMissions({});
  };

  const handleSortDateChange = (value: string) => {
    const filteredMissions = missions.filter(
      (mission) =>
        mission.state === 'in_process' ||
        mission.state === 'open_all_to_validate' ||
        mission.state === 'to_validate'
    );
    if (value === '') {
      setSortedMissions(filteredMissions);
      return;
    }

    const sorted = [...filteredMissions].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return value === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setSortedMissions(sorted);
  };

  // Filtrer les missions initiales
  const filteredMissions =
    sortedMissions.length > 0
      ? sortedMissions
      : missions.filter(
          (mission) =>
            mission.state === 'in_process' ||
            mission.state === 'open_all_to_validate' ||
            mission.state === 'to_validate'
        );

  return (
    <>
      <div className="grid grid-cols-8 gap-3">
        <FilterButton
          options={sortDateOptionsWithReset}
          onValueChange={handleSortDateChange}
          placeholder="Créer le"
          showSelectedOption={true}
          filter={true}
          data={missions}
          sortKey="created_at"
        />
        <FilterButton placeholder="N° de fournisseur" filter={false} />
        <FilterButton placeholder="N° de mission" filter={false} />
        <FilterButton
          options={[]}
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
        {filteredMissions.map((mission) => (
          <MissionEtatInProcessRow
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
