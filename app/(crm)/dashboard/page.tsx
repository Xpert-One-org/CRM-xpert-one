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
  getCountNewUsers,
  getCountNewUsersWeek,
  getCountMissionApplications,
  getCountMissionApplicationsWeek,
} from '@functions/dashboard';
import { getCountTasksToTreatAndUrgent } from '@functions/tasks';
import { getLoggedUser } from '@functions/auth/getLoggedUser';

export default async function DashboardPage() {
  const user = await getLoggedUser();

  // Compteurs indépendants : une seule vague de requêtes en parallèle
  const [
    { count: newUsersCount },
    { count: newSuppliersCount },
    { count: newUsersLastWeekCount },
    { count: newSuppliersLastWeekCount },
    { count: missionsOpenCount },
    { count: missionInProgressCount },
    { count: missionsCount },
    tasksResult,
    { count: missionsToValidateCount },
    { count: missionsClosedCount },
    { count: missionApplicationsCount },
    { count: missionApplicationsWeekCount },
  ] = await Promise.all([
    getCountNewUsers('xpert'),
    getCountNewUsers('company'),
    getCountNewUsersWeek('xpert'),
    getCountNewUsersWeek('company'),
    getCountMissionsState('open'),
    getCountMissionsState('in_progress'),
    getCountMissions(),
    getCountTasksToTreatAndUrgent(),
    getCountMissionsState('to_validate'),
    getCountMissionsState('finished'),
    getCountMissionApplications(),
    getCountMissionApplicationsWeek(),
  ]);

  const { pending: pendingTaskCount, urgent: urgentTaskCount } =
    tasksResult.count;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {user?.role !== 'hr' && user?.role !== 'adv' && (
          <>
            <DashBoardCards
              count={missionsOpenCount}
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
              count={missionInProgressCount}
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
              count={missionsToValidateCount}
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
              count={newUsersCount}
              title="Total xperts inscrits"
              urgentTitle="Semaine"
              urgentCount={newUsersLastWeekCount}
              buttonTitle="Nouveaux inscrits"
              iconButton={
                <PeopleUsersAdd className="fill-white" width={24} height={24} />
              }
              link="/nouveaux-inscrits?role=xpert"
            />
            <DashBoardCards
              count={missionApplicationsCount}
              title="Nouvelles candidatures"
              urgentTitle="Cette semaine"
              urgentCount={missionApplicationsWeekCount}
              buttonTitle="Candidatures"
              iconButton={
                <PeopleUsersAdd className="fill-white" width={24} height={24} />
              }
              link="/mission/etats?etat=open"
            />
            <DashBoardCards
              count={newSuppliersCount}
              title="Total fournisseurs inscrits"
              urgentTitle="Semaine"
              urgentCount={newSuppliersLastWeekCount}
              buttonTitle="Nouveaux inscrits"
              iconButton={
                <PeopleUsersAdd className="fill-white" width={24} height={24} />
              }
              link="/nouveaux-inscrits?role=xpert"
            />
          </>
        )}
        <DashBoardCards
          count={missionsCount}
          title="Suivi des missions"
          urgentTitle="Urgentes"
          urgentCount={0}
          buttonTitle="Suivi des missions"
          iconButton={<Phone className="fill-white" width={24} height={24} />}
          link="/mission/suivi-des-missions"
        />
        <DashBoardCards
          count={missionsClosedCount}
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
