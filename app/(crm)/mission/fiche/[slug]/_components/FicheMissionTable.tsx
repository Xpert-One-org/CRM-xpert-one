import { Button } from '@/components/ui/button';
import type { DBMission } from '@/types/typesDb';
import { formatDate } from '@/utils/date';
import { convertStateValue } from '@/utils/stateMissionConverter';
import { Search } from 'lucide-react';
import React from 'react';
import RightSideFicheMission from './RightSideFicheMission';
import ComboboxMission from '../../_components/ComboboxMission';
import Link from 'next/link';
import { empty } from '@/data/constant';

export default function FicheMissionTable({
  missionDetails,
}: {
  missionDetails: DBMission;
}) {
  const {
    mission_number,
    created_at,
    state,
    address,
    created_by,
    referent_name,
    referent_mail,
    referent_mobile,
    company_name,
    supplier,
    postal_code,
    xpert,
    city,
    xpert_associated_id,
  } = missionDetails;

  const createdAt = formatDate(created_at);
  const stateValue = convertStateValue(state);

  return (
    <div className="flex w-full flex-row gap-3">
      <div className="flex w-1/4 flex-col gap-2">
        <div className="flex flex-row justify-between gap-2">
          {/* <Button className="gap-2 px-spaceMediumContainer py-spaceMedium text-white">
              {mission_number} <Search size={18} strokeWidth={3} />
            </Button> */}
          <ComboboxMission />
          {/* <Button className="px-spaceMediumContainer py-spaceMedium text-white">
              Créer une mission
            </Button> */}
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-lightgray px-spaceMediumContainer py-[10px] text-black shadow-container">
          <div>
            <h3 className="text-sm font-bold text-black">
              INFORMATIONS MISSION
            </h3>
            <p>Créée le : {createdAt}</p>
            <p>État : {stateValue}</p>
            <p>Lieu : {address}</p>
            <p>
              {city} ({postal_code})
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black">
              INFORMATIONS FOURNISSEUR
            </h3>
            <p>
              N° d'identification :{' '}
              <Link
                href={`/fournisseur?id=${supplier?.generated_id}`}
                className="whitespace-nowrap font-bold text-primary"
              >
                {supplier?.generated_id}
              </Link>
            </p>
            <p>Société : {supplier?.company_name ?? empty}</p>
            <p>Contact : {referent_name ?? empty}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black">
              RÉFÉRENTS FOURNISSEUR
            </h3>
            <p>Nom : {referent_name ?? empty}</p>
            <p>Mail : {supplier?.email ?? empty}</p>
            <p>Téléphone : {referent_mobile}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black">INFORMATIONS XPERT</h3>
            <p>
              N° d’identification : {''}
              <Link
                href={`/xpert?id=${xpert?.generated_id}`}
                className="whitespace-nowrap font-bold text-primary"
              >
                {xpert?.generated_id}
              </Link>
            </p>
            <p>Contact : {referent_name}</p>
            <p>Auto Évaluation : {empty}</p>
            <p>Évaluation moyenne : {empty}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-black">
              RÉFÉRENTS XPERT ONE
            </h3>
            <p>{referent_name ?? empty}</p>
          </div>
        </div>
      </div>
      <RightSideFicheMission missionDetails={missionDetails} />
    </div>
  );
}
