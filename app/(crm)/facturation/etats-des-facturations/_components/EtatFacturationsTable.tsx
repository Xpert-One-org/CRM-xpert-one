import { FilterButton } from '@/components/FilterButton';
import type { DBMission } from '@/types/typesDb';
import React, { useState } from 'react';
import EtatFacturationsRow from './EtatFacturationsRow';
import { useFileStatusFacturationStore } from '@/store/fileStatusFacturation';
import { getUniqueBillingMonths } from '../_utils/getUniqueBillingMonths';
import EtatFacturationUploadRow from './EtatFacturationUploadRow';

const yesNoOptions = [
  { label: 'OUI', value: 'yes', color: '#92C6B0' },
  { label: 'NON', value: 'no', color: '#D64242' },
];

export default function EtatFacturationsTable({
  missions,
}: {
  missions: DBMission[];
}) {
  const { fileStatusesByMission, checkAllMissionsFiles } =
    useFileStatusFacturationStore();

  const [sortedRows, setSortedRows] = useState<
    { mission: DBMission; monthYear: { month: number; year: number } }[]
  >([]);

  const baseRows = missions
    .flatMap((mission) => {
      const fileStatuses =
        fileStatusesByMission[mission.mission_number || ''] || {};

      const monthsForMission = getUniqueBillingMonths(fileStatuses, mission);

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
      const missionNumberA = parseInt(
        a.mission.mission_number?.split(' ')[1] || '0'
      );
      const missionNumberB = parseInt(
        b.mission.mission_number?.split(' ')[1] || '0'
      );
      return missionNumberA - missionNumberB;
    });

  const handleDateSort = (value: string) => {
    const newSortedRows = [...baseRows].sort((a, b) => {
      const dateA = new Date(a.monthYear.year, a.monthYear.month);
      const dateB = new Date(b.monthYear.year, b.monthYear.month);

      if (value === 'asc') {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

    setSortedRows(newSortedRows);
  };

  const displayRows = sortedRows.length > 0 ? sortedRows : baseRows;

  return (
    <div className="flex h-[calc(100vh-260px)] flex-col gap-3">
      <div className="grid grid-cols-10 gap-3">
        <FilterButton
          className="col-span-1"
          placeholder="Gestion de facturation"
        />
        <FilterButton
          className="col-span-1"
          placeholder="Mois / Année"
          filter={true}
          options={[
            { label: 'Plus ancien', value: 'asc' },
            { label: 'Plus récent', value: 'desc' },
          ]}
          onValueChange={handleDateSort}
        />
        <FilterButton className="col-span-1" placeholder="Référent Xpert One" />
        <FilterButton
          className="col-span-1"
          placeholder="Feuille de présence validée"
          filter={true}
          options={yesNoOptions}
          coloredOptions
        />
        <FilterButton
          className="col-span-1"
          placeholder="Paiement de salaire"
          filter={true}
          options={yesNoOptions}
          coloredOptions
        />
        <FilterButton
          className="col-span-1"
          placeholder="Bulletin de salaire"
          filter={true}
          options={yesNoOptions}
          coloredOptions
        />
        <FilterButton
          className="col-span-1"
          placeholder="Facture validée"
          filter={true}
          options={yesNoOptions}
          coloredOptions
        />
        <FilterButton
          className="col-span-1"
          placeholder="Facture payée"
          filter={true}
          options={yesNoOptions}
          coloredOptions
        />
        <FilterButton
          className="col-span-1"
          placeholder="Facture"
          filter={true}
          options={yesNoOptions}
          coloredOptions
        />
        <FilterButton
          className="col-span-1"
          placeholder="Paiement"
          filter={true}
          options={yesNoOptions}
          coloredOptions
        />
      </div>

      <div className="overflow-y-auto">
        <div className="grid grid-cols-10 gap-3">
          {displayRows.map(({ mission, monthYear }) => (
            <EtatFacturationsRow
              key={`${mission.id}-${monthYear.year}-${monthYear.month}`}
              missionData={mission}
              selectedMonthYear={monthYear}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-10 gap-3">
        <EtatFacturationUploadRow
          missions={missions}
          onUploadSuccess={() => {
            checkAllMissionsFiles(missions);
          }}
        />
      </div>
    </div>
  );
}
