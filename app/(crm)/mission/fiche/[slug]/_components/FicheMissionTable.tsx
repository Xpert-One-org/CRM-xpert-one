import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { convertStateValue } from '@/utils/stateMissionConverter';
import React from 'react';
import RightSideFicheMission from './RightSideFicheMission';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import Link from 'next/link';
import { empty } from '@/data/constant';
import { useEditMissionStore } from '../../editMissionStore';
import { Input } from '@/components/ui/input';
import { useSelect } from '@/store/select';
import { getLabel } from '@/utils/getLabel';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type MissionState =
  | 'open_all_to_validate'
  | 'open'
  | 'open_all'
  | 'in_progress'
  | 'finished';

export default function FicheMissionTable() {
  const { openedMissionNotSaved: mission, handleUpdateField } =
    useEditMissionStore();
  const { jobTitles } = useSelect();

  if (!mission) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="w-fit self-center rounded-lg bg-primary px-spaceMediumContainer py-[10px] text-white shadow-container">
        <h2 className="text-md font-bold">
          {jobTitles.length
            ? getLabel({ value: mission.job_title ?? '', select: jobTitles })
            : 'Chargement...'}
        </h2>
      </div>

      <div className="flex w-full flex-row gap-3">
        <div className="flex w-1/4 flex-col gap-2">
          <div className="flex flex-row justify-between gap-2">
            <ComboboxMission />
          </div>
          <div className="flex flex-col gap-1 py-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">État de la mission</p>
              <Select
                value={mission.state}
                onValueChange={(value: MissionState) => {
                  if (mission.state !== value) {
                    handleUpdateField('state', value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{convertStateValue(mission.state)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      'open_all_to_validate',
                      'open',
                      'open_all',
                      'in_progress',
                      'finished',
                    ] as const
                  ).map((value) => (
                    <SelectItem key={value} value={value}>
                      {convertStateValue(value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg bg-lightgray px-spaceMediumContainer py-[10px] text-black shadow-container">
            <div>
              <h3 className="text-sm font-bold text-black">
                INFORMATIONS MISSION
              </h3>
              <p>Créée le : {formatDate(mission.created_at)}</p>
              {/* <p>État : {convertStateValue(mission.state)}</p> */}
              <p>
                Lieu : {mission.city} {mission.postal_code}-{mission.country}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">
                INFORMATIONS FOURNISSEUR
              </h3>
              <p>
                N° d'identification :{' '}
                <Link
                  href={`/fournisseur?id=${mission.supplier?.generated_id}`}
                  className="whitespace-nowrap font-bold text-primary"
                >
                  {mission.supplier?.generated_id}
                </Link>
              </p>
              <p>Société : {mission.supplier?.company_name ?? empty}</p>
              <p>Contact : {mission.referent_name ?? empty}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">
                RÉFÉRENTS FOURNISSEUR
              </h3>
              <p>Nom : {mission.referent_name ?? empty}</p>
              <p>Mail : {mission.supplier?.email ?? empty}</p>
              <p>Téléphone : {mission.referent_mobile}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">
                INFORMATIONS XPERT
              </h3>
              <p>
                N° d’identification : {''}
                <Link
                  href={`/xpert?id=${mission.xpert?.generated_id}`}
                  className="whitespace-nowrap font-bold text-primary"
                >
                  {mission.xpert?.generated_id}
                </Link>
              </p>
              <p>Contact : {mission.referent_name}</p>
              <p>Auto Évaluation : {empty}</p>
              <p>Évaluation moyenne : {empty}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">
                RÉFÉRENTS XPERT ONE
              </h3>
              <p>{mission.referent_name ?? empty}</p>
            </div>
          </div>
        </div>
        <RightSideFicheMission />
      </div>
    </div>
  );
}
