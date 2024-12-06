import { FilterButton } from '@/components/FilterButton';
import React, { useEffect } from 'react';
import MissionActivationRow from './MissionActivationRow';
import { useMissionStore } from '@/store/mission';

export default function MissionActivationTable({ slug }: { slug: string }) {
  const { missions, fetchMissions } = useMissionStore();

  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <div className="grid grid-cols-8 gap-3">
      <FilterButton
        placeholder="État de la mission"
        filter={true}
        options={[]}
        onValueChange={() => {}}
      />
      <FilterButton placeholder="N° de mission" filter={false} />
      <FilterButton placeholder="Référent Xpert One" filter={false} />
      <FilterButton placeholder="Statut de l'XPERT" filter={false} />
      <FilterButton placeholder="Date de début prévisionnelle" filter={false} />
      <FilterButton placeholder="Date de début définitive" filter={false} />
      <FilterButton placeholder="N° de fournisseur" filter={false} />
      <FilterButton placeholder="N° XPERT" filter={false} />

      {missions
        .filter((mission) => mission.mission_number === slug)
        .filter((mission) => mission?.xpert?.profile_status?.status === 'cdi')
        .map((mission) => (
          <MissionActivationRow key={mission.id} mission={mission} />
        ))}
    </div>
  );
}
