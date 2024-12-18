import { FilterButton } from '@/components/FilterButton';
import type { DBMission } from '@/types/typesDb';
import React from 'react';
import EtatFacturationsRow from './EtatFacturationsRow';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { getUniqueBillingMonths } from '../_utils/getUniqueBillingMonths';
import EtatFacturationUploadRow from './EtatFacturationUploadRow';

export default function EtatFacturationsTable({
  missions,
}: {
  missions: DBMission[];
}) {
  const { fileStatusesByMission } = useFileStatusFacturationStore();

  const rows = missions
    .flatMap((mission) => {
      const fileStatuses = fileStatusesByMission[mission.mission_number || ''];
      if (!fileStatuses) return [];

      const monthsForMission = getUniqueBillingMonths(fileStatuses);

      return monthsForMission.map((monthYear) => ({
        mission,
        monthYear,
      }));
    })
    .sort((a, b) => {
      if (a.monthYear.year !== b.monthYear.year) {
        return a.monthYear.year - b.monthYear.year;
      }
      if (a.monthYear.month !== b.monthYear.month) {
        return a.monthYear.month - b.monthYear.month;
      }
      return (a.mission.mission_number || '').localeCompare(
        b.mission.mission_number || ''
      );
    });

  return (
    <div className="flex h-[calc(100vh-260px)] flex-col gap-3">
      <div className="grid grid-cols-10 gap-3">
        <FilterButton
          className="col-span-1"
          placeholder="Gestion de facturation"
        />
        <FilterButton className="col-span-1" placeholder="Mois / Année" />
        <FilterButton className="col-span-1" placeholder="Référent Xpert One" />
        <FilterButton
          className="col-span-1"
          placeholder="Feuille de présence validée"
        />
        <FilterButton
          className="col-span-1"
          placeholder="Paiement de salaire"
        />
        <FilterButton
          className="col-span-1"
          placeholder="Bulletin de salaire"
        />
        <FilterButton className="col-span-1" placeholder="Facture validée" />
        <FilterButton className="col-span-1" placeholder="Facture payée" />
        <FilterButton className="col-span-1" placeholder="Facture" />
        <FilterButton className="col-span-1" placeholder="Paiement" />
      </div>

      <div className="overflow-y-auto">
        <div className="grid grid-cols-10 gap-3">
          {rows.map(({ mission, monthYear }, index) => (
            <EtatFacturationsRow
              key={`${mission.id}-${monthYear.year}-${monthYear.month}`}
              missionData={mission}
              selectedMonthYear={monthYear}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-10 gap-3">
        <EtatFacturationUploadRow />
      </div>
    </div>
  );
}
