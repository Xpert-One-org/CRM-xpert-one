'use server';

import React from 'react';
import DashBoardCards from './_components/DashBoardCards';
import BriefCase from '@/components/svg/BriefCase';
import { Phone, SquarePen } from 'lucide-react';
import BriefCaseAdd from '@/components/svg/BriefCaseAdd';
import PeopleUsersAdd from '@/components/svg/PeopleUsersAdd';
import {
  getCountMissions,
  getCountMissionsState,
  getLastSignupNewUsers,
  getLastSignUpNewUsersWeek,
  getCountMissionApplications,
  getCountMissionApplicationsWeek,
} from '@functions/dashboard';
import { getCountTasksToTreatAndUrgent } from '@functions/tasks';
import { getLoggedUser } from '@functions/auth/getLoggedUser';

export default async function DashboardPage() {
  const user = await getLoggedUser();

  const { data: newUsers } = await getLastSignupNewUsers('xpert');
  const { data: newSuppliers } = await getLastSignupNewUsers('company');
  const { newUsersLastWeek } = await getLastSignUpNewUsersWeek('xpert');
  const { newUsersLastWeek: newSuppliersLastWeek } =
    await getLastSignUpNewUsersWeek('company');

  const { data: missionsOpen } = await getCountMissionsState('open');
  const { data: missionInProgress } =
    await getCountMissionsState('in_progress');

  const { data: missions } = await getCountMissions();

  const { pending: pendingTaskCount, urgent: urgentTaskCount } = (
    await getCountTasksToTreatAndUrgent()
  ).count;

  const { data: missionsToValidate } =
    await getCountMissionsState('to_validate');

  const { data: missionsClosed } = await getCountMissionsState('finished');

  const { data: missionApplications } = await getCountMissionApplications();
  const { data: missionApplicationsWeek } =
    await getCountMissionApplicationsWeek();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user?.role !== 'hr' && user?.role !== 'adv' && (
          <>
            <DashBoardCards
              count={missionsOpen.length}
              title="Missions ouvertes"
              urgentTitle="Urgentes"
              urgentCount={0}
              buttonTitle="Missions ouvertes"
              iconButton={
                <BriefCase className="fill-white" width={24} height={24} />
              }
              link="/mission/etats?etat=open"
            />
            <DashBoardCards
              count={missionInProgress.length}
              title="Missions placées"
              urgentTitle="Urgentes"
              urgentCount={0}
              buttonTitle="Missions placées"
              iconButton={
                <BriefCase className="fill-white" width={24} height={24} />
              }
              link="/mission/etats?etat=in_progress"
            />
          </>
        )}
        <DashBoardCards
          count={(pendingTaskCount ?? 0) + (urgentTaskCount ?? 0)}
          title="TO DO à traiter"
          urgentTitle="Urgentes"
          urgentCount={urgentTaskCount ?? 0}
          buttonTitle={`TODO : ${(pendingTaskCount ?? 0) + (urgentTaskCount ?? 0)}`}
          iconButton={<SquarePen width={24} height={24} />}
          link="/dashboard/todo"
        />
        {user?.role !== 'hr' && user?.role !== 'adv' && (
          <>
            <DashBoardCards
              count={missionsToValidate.length}
              title="Missions à valider"
              urgentTitle="Urgentes"
              urgentCount={0}
              buttonTitle="Missions à valider"
              iconButton={
                <BriefCaseAdd className="fill-white" width={24} height={24} />
              }
              link="/mission/etats?etat=in_process"
            />
          </>
        )}
        {user?.role !== 'hr' && user?.role !== 'adv' && (
          <>
            <DashBoardCards
              count={newUsers.length}
              title="Total xperts inscrits"
              urgentTitle="Semaine"
              urgentCount={newUsersLastWeek.length || 0}
              buttonTitle="Nouveaux inscrits"
              iconButton={
                <PeopleUsersAdd className="fill-white" width={24} height={24} />
              }
              link="/nouveaux-inscrits?role=xpert"
            />
            <DashBoardCards
              count={missionApplications.length}
              title="Nouvelles candidatures"
              urgentTitle="Cette semaine"
              urgentCount={missionApplicationsWeek.length || 0}
              buttonTitle="Candidatures"
              iconButton={
                <PeopleUsersAdd className="fill-white" width={24} height={24} />
              }
              link="/mission/etats?etat=open"
            />
            <DashBoardCards
              count={newSuppliers.length}
              title="Total fournisseurs inscrits"
              urgentTitle="Semaine"
              urgentCount={newSuppliersLastWeek.length || 0}
              buttonTitle="Nouveaux inscrits"
              iconButton={
                <PeopleUsersAdd className="fill-white" width={24} height={24} />
              }
              link="/nouveaux-inscrits?role=xpert"
            />
          </>
        )}
        <DashBoardCards
          count={missions.length}
          title="Suivi des missions"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle="Suivi des missions"
          iconButton={<Phone className="fill-white" width={24} height={24} />}
          link="/mission/suivi-des-missions"
        />
        <DashBoardCards
          count={missionsClosed.length}
          title="Missions arrêtées"
          urgentTitle="Non cloturées"
          urgentCount={0}
          buttonTitle="Missions arrêtées"
          iconButton={
            <BriefCase className="fill-white" width={24} height={24} />
          }
          link="/mission/etats?etat=finished"
        />
      </div>
    </>
  );
}
