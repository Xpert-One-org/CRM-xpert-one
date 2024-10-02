import Admin from '@/components/svg/Admin';
import BriefCase from '@/components/svg/BriefCase';
import ChatBubbles from '@/components/svg/ChatBubbles';
import Cog from '@/components/svg/Cog';
import PeopleCircle from '@/components/svg/PeopleCircle';
import Supplier from '@/components/svg/Supplier';
import Xpert from '@/components/svg/Xpert';
import { cn } from '@/lib/utils';
import { CalendarDays, ChartColumn, LayoutDashboard } from 'lucide-react';

export const menuCrm = [
  {
    id: 1,
    title: 'Mon dashboard',
    icon: (
      <LayoutDashboard
        width={32}
        height={32}
        className={cn(
          'transition group-hover:fill-colors-accent group-hover:stroke-colors-accent'
        )}
      />
    ),
    url: '/dashboard',
  },
  {
    id: 2,
    title: 'Xpert',
    icon: (
      <Xpert
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-colors-accent"
      />
    ),
    url: '/xpert',
    sub: [
      {
        title: 'Profil',
        url: '/xpert/profile',
      },
      {
        title: 'Nouvel XPERT',
        url: '/xpert/new',
      },
      {
        title: 'Parcours',
        url: '/xpert/parcours',
      },
      {
        title: 'Missions XPERT',
        url: '/xpert/missions',
      },
    ],
  },

  {
    id: 3,
    title: 'Fournisseurs',
    icon: (
      <Supplier
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-colors-accent"
      />
    ),
    url: '/supplier',
  },
  {
    id: 4,
    title: 'Mission',
    icon: (
      <BriefCase
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-colors-accent"
      />
    ),
    url: '/mission',
    sub: [
      {
        title: 'Etat des mission',
        url: '/mission/state',
      },
      {
        title: 'Matching',
        url: '/mission/matching',
      },
      {
        title: 'Sélection',
        url: '/mission/selection',
      },
      {
        title: 'Etapes à réaliser',
        url: '/mission/steps',
      },
      {
        title: 'Gestion des missions',
        url: '/mission/management',
      },
      {
        title: 'Gestion des facturations',
        url: '/mission/billing',
      },
      {
        title: 'Etat des facturations',
        url: '/mission/billing-state',
      },
    ],
  },
  {
    id: 5,
    title: 'Messagerie',
    icon: (
      <ChatBubbles
        width={32}
        height={32}
        className="transition group-hover:stroke-colors-accent"
      />
    ),
    url: '/messaging',
  },

  {
    id: 6,
    title: 'Calendrier',
    icon: (
      <CalendarDays
        width={32}
        height={32}
        className="transition group-hover:stroke-colors-accent"
      />
    ),
    url: '/calendar',
  },
  {
    id: 7,
    title: 'Admin',
    icon: (
      <Admin
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-colors-accent"
      />
    ),
    url: '/admin',
  },
  {
    id: 8,
    title: 'Statistiques',
    icon: (
      <ChartColumn
        width={32}
        height={32}
        fill="dark"
        className="transition group-hover:stroke-colors-accent"
      />
    ),
    url: '/parametres',
  },
  {
    id: 9,
    title: 'Communauté',
    icon: (
      <PeopleCircle
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-colors-accent"
      />
    ),
    url: '/communaute/echo-de-la-communaute',
  },
  {
    id: 10,
    title: 'Paramètres',
    icon: (
      <Cog
        width={32}
        height={32}
        fill="dark"
        className="fill-white transition group-hover:fill-colors-accent"
      />
    ),
    url: '/parametres',
  },
];
