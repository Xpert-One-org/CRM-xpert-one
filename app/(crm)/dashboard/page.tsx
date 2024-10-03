'use server';

import React from 'react';
import { getInProgressMissionsCount } from './dashboard.action';
import DashBoardCards from './_components/DashBoardCards';
import type { DBMission } from '@/types/typesDb';
import BriefCase from '@/components/svg/BriefCase';
import FacturationLogo from '@/components/svg/Facturation';
import ChatBubbles from '@/components/svg/ChatBubbles';
import { Phone, SquarePen } from 'lucide-react';
import BriefCaseAdd from '@/components/svg/BriefCaseAdd';
import PeopleUsersAdd from '@/components/svg/PeopleUsersAdd';

export default async function DashboardPage() {
  const { data } = await getInProgressMissionsCount();

  const openMissions = data.filter(
    (mission: DBMission) => mission.state === 'open'
  );

  const urgentMissions = openMissions.filter(
    (mission: DBMission) => mission.state === 'urgent'
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashBoardCards
          count={openMissions.length}
          title="Missions ouvertes"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle="Missions ouvertes"
          iconButton={
            <BriefCase className="fill-white" width={24} height={24} />
          }
          link="/mission/etats"
        />
        <DashBoardCards
          count={openMissions.length}
          title="Missions placées"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle="Missions placées"
          iconButton={
            <BriefCase className="fill-white" width={24} height={24} />
          }
          link="/mission/etats"
        />
        <DashBoardCards
          count={openMissions.length}
          title="Gestion de facturations"
          urgentTitle="Retards"
          urgentCount={0}
          buttonTitle="Gestion de facturations"
          iconButton={
            <FacturationLogo className="fill-white" width={24} height={24} />
          }
          link="/facturation/etats"
        />
        <DashBoardCards
          count={openMissions.length}
          title="TO DO à traiter"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle={`TODO : ${openMissions.length}`}
          iconButton={<SquarePen width={24} height={24} />}
          link="/dashboard/todo"
        />
        <DashBoardCards
          count={openMissions.length}
          title="Messagerie externe"
          urgentTitle="Non lus"
          urgentCount={0}
          buttonTitle="Messagerie"
          iconButton={<ChatBubbles width={24} height={24} />}
          link="/messagerie"
        />
        <DashBoardCards
          count={openMissions.length}
          title="Missions à valider"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle="Missions à valider"
          iconButton={
            <BriefCaseAdd className="fill-white" width={24} height={24} />
          }
          link="/mission/etats"
        />
        <DashBoardCards
          count={openMissions.length}
          title="Total inscrits"
          urgentTitle="Semaine"
          urgentCount={0}
          buttonTitle="Nouveaux inscrits"
          iconButton={
            <PeopleUsersAdd className="fill-white" width={24} height={24} />
          }
          link="/xpert/nouveau"
        />
        <DashBoardCards
          count={openMissions.length}
          title="Suivi des missions"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle="Suivi des missions"
          iconButton={<Phone className="fill-white" width={24} height={24} />}
          link="/mission/etats"
        />
        <DashBoardCards
          count={openMissions.length}
          title="Missions arrêtées"
          urgentTitle="Non cloturées"
          urgentCount={0}
          buttonTitle="Missions arrêtées"
          iconButton={
            <BriefCase className="fill-white" width={24} height={24} />
          }
          link="/mission/etats"
        />
      </div>
    </>
  );
}
