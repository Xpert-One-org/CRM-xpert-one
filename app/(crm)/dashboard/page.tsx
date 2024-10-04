'use client';

import React, { useEffect } from 'react';
import DashBoardCards from './_components/DashBoardCards';
import BriefCase from '@/components/svg/BriefCase';
import FacturationLogo from '@/components/svg/Facturation';
import ChatBubbles from '@/components/svg/ChatBubbles';
import { Phone, SquarePen } from 'lucide-react';
import BriefCaseAdd from '@/components/svg/BriefCaseAdd';
import PeopleUsersAdd from '@/components/svg/PeopleUsersAdd';
import { useDashboardStore } from '@/store/dashboard';

export default function DashboardPage() {
  const { newUsers, fetchLastSignUpNewUsersWeek } = useDashboardStore();

  useEffect(() => {
    if (newUsers.length === 0) {
      fetchLastSignUpNewUsersWeek();
    }
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashBoardCards
          count={newUsers.length}
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
          count={newUsers.length}
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
          count={newUsers.length}
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
          count={newUsers.length}
          title="TO DO à traiter"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle={`TODO : ${newUsers.length}`}
          iconButton={<SquarePen width={24} height={24} />}
          link="/dashboard/todo"
        />
        <DashBoardCards
          count={newUsers.length}
          title="Messagerie externe"
          urgentTitle="Non lus"
          urgentCount={0}
          buttonTitle="Messagerie"
          iconButton={<ChatBubbles width={24} height={24} />}
          link="/messagerie"
        />
        <DashBoardCards
          count={newUsers.length}
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
          count={newUsers.length}
          title="Total inscrits"
          urgentTitle="Semaine"
          urgentCount={newUsers.length}
          buttonTitle="Nouveaux inscrits"
          iconButton={
            <PeopleUsersAdd className="fill-white" width={24} height={24} />
          }
          link="/xpert/nouveau"
        />
        <DashBoardCards
          count={newUsers.length}
          title="Suivi des missions"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle="Suivi des missions"
          iconButton={<Phone className="fill-white" width={24} height={24} />}
          link="/mission/etats"
        />
        <DashBoardCards
          count={newUsers.length}
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
