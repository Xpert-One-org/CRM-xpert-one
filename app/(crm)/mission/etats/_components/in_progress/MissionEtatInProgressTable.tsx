import { FilterButton } from '@/components/FilterButton';
import React, { useState, useEffect } from 'react';
import MissionEtatInProgressRow from './MissionEtatInProgressRow';
import { useMissionStore } from '@/store/mission';
import { documentsOptions, sortDateOptions } from '@/data/filter';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import { getFileTypeByStatus } from '../../../activation-des-missions/[slug]/_utils/getFileTypeByStatus';

// Ajout d'un tableau local avec une option de réinitialisation
const sortDateOptionsWithReset = [
  ...sortDateOptions,
  { label: 'Réinitialiser', value: '' },
];

const documentsOptionsWithReset = [
  { label: 'Signé et reçu', value: 'received' },
  { label: 'Non reçu', value: 'not_received' },
  { label: 'Réinitialiser', value: '' },
];

const commandeXpertOptionsWithReset = [
  { label: 'Signé et reçu', value: 'received' },
  { label: 'Non reçu', value: 'not_received' },
  { label: 'Réinitialiser', value: '' },
];

const commandeFournisseurOptionsWithReset = [
  { label: 'Signé et reçu', value: 'received' },
  { label: 'Non reçu', value: 'not_received' },
  { label: 'Réinitialiser', value: '' },
];

export default function MissionEtatInProgressTable() {
  const { missions } = useMissionStore();
  const [currentSort, setCurrentSort] = useState<string>('');
  const [documentFilter, setDocumentFilter] = useState<string>('');
  const [commandeXpertFilter, setCommandeXpertFilter] = useState<string>('');
  const [commandeFournisseurFilter, setCommandeFournisseurFilter] =
    useState<string>('');
  const [fileStatuses, setFileStatuses] = useState<
    Record<string, Record<string, { exists: boolean; createdAt?: string }>>
  >({});

  useEffect(() => {
    const fetchAllFileStatuses = async () => {
      const supabase = createSupabaseFrontendClient();
      const statuses: Record<
        string,
        Record<string, { exists: boolean; createdAt?: string }>
      > = {};

      for (const mission of missions) {
        if (mission.state !== 'in_progress') continue;

        const missionStatuses: Record<
          string,
          { exists: boolean; createdAt?: string }
        > = {};
        const missionXpertStatus = mission.xpert_associated_status;

        const xpertTypes = [
          getFileTypeByStatus('recap_mission_signed', missionXpertStatus ?? ''),
          getFileTypeByStatus('contrat_signed', missionXpertStatus ?? ''),
          getFileTypeByStatus(
            'commande_societe_signed',
            missionXpertStatus ?? ''
          ),
          getFileTypeByStatus('commande', missionXpertStatus ?? ''),
        ];

        if (mission.xpert?.generated_id) {
          for (const type of xpertTypes) {
            const basePath = `${mission.mission_number}/${mission.xpert?.generated_id}/activation/${type}`;

            const { data: files, error } = await supabase.storage
              .from('mission_files')
              .list(basePath);

            if (!error && files && files.length > 0) {
              const sortedFiles = files.sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              );
              missionStatuses[type] = {
                exists: true,
                createdAt: sortedFiles[0].created_at,
              };
            } else {
              missionStatuses[type] = { exists: false };
            }
          }
        }

        if (mission.supplier?.generated_id) {
          const fournisseurType = getFileTypeByStatus(
            'contrat_commande',
            missionXpertStatus ?? ''
          );
          const basePath = `${mission.mission_number}/${mission.supplier?.generated_id}/activation/${fournisseurType}`;

          const { data: files, error } = await supabase.storage
            .from('mission_files')
            .list(basePath);

          if (!error && files && files.length > 0) {
            const sortedFiles = files.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
            missionStatuses[fournisseurType] = {
              exists: true,
              createdAt: sortedFiles[0].created_at,
            };
          } else {
            missionStatuses[fournisseurType] = { exists: false };
          }
        }

        statuses[mission.id] = missionStatuses;
      }

      setFileStatuses(statuses);
    };

    fetchAllFileStatuses();
  }, [missions]);

  // Fonction pour filtrer les missions par état des documents
  const filterMissionsByDocuments = (missions: any[]) => {
    if (!documentFilter) return missions;

    return missions.filter((mission) => {
      const missionStatus = fileStatuses[mission.id];
      if (!missionStatus) return false;

      const missionXpertStatus = mission.xpert_associated_status;
      const recapType = getFileTypeByStatus(
        'recap_mission_signed',
        missionXpertStatus ?? ''
      );
      const isReceived = missionStatus[recapType]?.exists ?? false;
      return documentFilter === 'received' ? isReceived : !isReceived;
    });
  };

  // Fonction pour filtrer les missions par commande Xpert
  const filterMissionsByCommandeXpert = (missions: any[]) => {
    if (!commandeXpertFilter) return missions;

    return missions.filter((mission) => {
      const missionStatus = fileStatuses[mission.id];
      if (!missionStatus) return false;

      const missionXpertStatus = mission.xpert_associated_status;
      const commandeType = getFileTypeByStatus(
        'commande',
        missionXpertStatus ?? ''
      );
      const isReceived = missionStatus[commandeType]?.exists ?? false;
      return commandeXpertFilter === 'received' ? isReceived : !isReceived;
    });
  };

  // Fonction pour filtrer les missions par commande Fournisseur
  const filterMissionsByCommandeFournisseur = (missions: any[]) => {
    if (!commandeFournisseurFilter) return missions;

    return missions.filter((mission) => {
      const missionStatus = fileStatuses[mission.id];
      if (!missionStatus) return false;

      const missionXpertStatus = mission.xpert_associated_status;
      const commandeType = getFileTypeByStatus(
        'contrat_commande',
        missionXpertStatus ?? ''
      );
      const isReceived = missionStatus[commandeType]?.exists ?? false;
      return commandeFournisseurFilter === 'received'
        ? isReceived
        : !isReceived;
    });
  };

  // Fonction pour trier les missions par date
  const sortMissionsByDate = (missions: any[]) => {
    if (!currentSort) return missions;

    return [...missions].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return currentSort === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const handleMissionDocsChange = (value: string) => {
    setDocumentFilter(value);
  };

  const handleSortDateChange = (value: string) => {
    setCurrentSort(value);
  };

  const handleCommandeXpertChange = (value: string) => {
    setCommandeXpertFilter(value);
  };

  const handleCommandeFournisseurChange = (value: string) => {
    setCommandeFournisseurFilter(value);
  };

  // Application du filtrage puis du tri
  const inProgressMissions = missions.filter(
    (mission) => mission.state === 'in_progress'
  );
  const filteredByDocs = filterMissionsByDocuments(inProgressMissions);
  const filteredByCommandeXpert = filterMissionsByCommandeXpert(filteredByDocs);
  const filteredByCommandeFournisseur = filterMissionsByCommandeFournisseur(
    filteredByCommandeXpert
  );
  const sortedAndFilteredMissions = sortMissionsByDate(
    filteredByCommandeFournisseur
  );

  return (
    <>
      <div className="grid grid-cols-12 gap-3">
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
        <FilterButton placeholder="Référent Xpert One" filter={false} />
        <FilterButton
          placeholder="Temps avant début de mission"
          filter={false}
        />
        <FilterButton placeholder="N° XPERT" filter={false} />
        <FilterButton
          className="col-span-2"
          placeholder="Récap. mission (Xpert)"
          options={documentsOptionsWithReset}
          onValueChange={handleMissionDocsChange}
          showSelectedOption={true}
          filter={true}
          data={missions}
          sortKey="mission_docs"
        />
        <FilterButton
          className="col-span-1"
          placeholder="Contrat Xpert"
          options={commandeXpertOptionsWithReset}
          onValueChange={handleCommandeXpertChange}
          showSelectedOption={true}
          filter={true}
          data={missions}
          sortKey="commande_xpert"
        />
        <FilterButton
          className="col-span-1"
          placeholder="Contrat Fournisseur"
          options={commandeFournisseurOptionsWithReset}
          onValueChange={handleCommandeFournisseurChange}
          showSelectedOption={true}
          filter={true}
          data={missions}
          sortKey="commande_fournisseur"
        />
        <FilterButton placeholder="Activation" filter={false} />
        <FilterButton placeholder="Facturation" filter={false} />
        {sortedAndFilteredMissions.map((mission) => (
          <MissionEtatInProgressRow key={mission.id} mission={mission} />
        ))}
      </div>
    </>
  );
}
