import Admin from '@/components/svg/Admin';
import BriefCase from '@/components/svg/BriefCase';
import ChatBubbles from '@/components/svg/ChatBubbles';
import Cog from '@/components/svg/Cog';
import FacturationLogo from '@/components/svg/Facturation';
import PeopleCircle from '@/components/svg/PeopleCircle';
import Supplier from '@/components/svg/Supplier';
import Xpert from '@/components/svg/Xpert';
import { cn } from '@/lib/utils';
import { ChartColumn, LayoutDashboard, Mail } from 'lucide-react';

export const menuCrm = [
  {
    id: 1,
    title: 'Mon dashboard',
    icon: (
      <LayoutDashboard
        width={32}
        height={32}
        className={cn(
          'fill-white stroke-white transition group-hover:fill-accent group-hover:stroke-accent'
        )}
      />
    ),
    url: '/dashboard',
    sub: [
      {
        title: 'Accueil',
        url: '/dashboard',
      },
      {
        title: 'Mail',
        url: '/dashboard/mail',
      },
      {
        title: 'Calendrier',
        url: '/dashboard/calendrier',
      },
      {
        title: 'To Do',
        url: '/dashboard/todo',
      },
    ],
  },
  {
    id: 2,
    title: 'Xpert',
    icon: (
      <Xpert
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-accent"
      />
    ),
    url: '/xpert',
    sub: [
      {
        title: 'XPERT',
        url: '/xpert',
      },
      {
        title: 'Nouveau inscrits',
        url: '/nouveau-inscrits?role=xpert',
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
        className="fill-white transition group-hover:fill-accent"
      />
    ),
    url: '/fournisseur',
    sub: [
      {
        title: 'Fournisseurs',
        url: '/fournisseur',
      },
      {
        title: 'Nouveau inscrits',
        url: '/nouveau-inscrits?role=company',
      },
    ],
  },
  {
    id: 4,
    title: 'Mission',
    icon: (
      <BriefCase
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-accent"
      />
    ),
    url: '/mission/etats?etat=to_validate',
    sub: [
      {
        title: 'État des mission',
        url: '/mission/etats?etat=to_validate',
      },
      {
        title: 'Fiche mission',
        url: '/mission/fiche',
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
        title: 'Calls à réaliser',
        url: '/mission/calls',
      },
      {
        title: 'Activation des missions',
        url: '/mission/activation',
      },
    ],
  },
  {
    id: 5,
    title: 'Facturation',
    icon: (
      <FacturationLogo
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-accent"
      />
    ),
    url: '/facturation/gestion-facturations',
    sub: [
      {
        title: 'Gestion des facturations',
        url: '/facturation/gestion-facturations',
      },
      {
        title: 'Etat des facturations',
        url: '/facturation/etats',
      },
    ],
  },
  {
    id: 6,
    title: 'Messagerie',
    icon: (
      <ChatBubbles
        width={32}
        height={32}
        className="transition group-hover:stroke-accent"
      />
    ),
    url: '/messagerie',
  },
  {
    id: 7,
    title: 'Messagerie externe',
    icon: (
      <Mail
        width={32}
        height={32}
        className="stroke-white stroke-1 transition group-hover:stroke-accent"
      />
    ),
    url: '/messagerie-externe',
  },
  {
    id: 8,
    title: 'Communauté',
    icon: (
      <PeopleCircle
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-accent"
      />
    ),
    url: '/communaute/echo-de-la-communaute',
    sub: [
      {
        title: 'Écho',
        url: '/communaute/echo-de-la-communaute',
      },
      {
        title: 'Forum',
        url: '/communaute/forum',
      },
      {
        title: 'Xpert / Xpert',
        url: '/communaute/xpert-to-xpert',
      },
    ],
  },
  {
    id: 9,
    title: 'Admin',
    icon: (
      <Admin
        width={32}
        height={32}
        className="fill-white transition group-hover:fill-accent"
      />
    ),
    url: '/admin/collaborateurs',
    sub: [
      {
        title: 'Collaborateurs',
        url: '/admin/collaborateurs',
      },
      {
        title: 'Gestion des collaborateurs',
        url: '/admin/gestion-collaborateurs',
      },
    ],
  },
  {
    id: 10,
    title: 'Statistiques',
    icon: (
      <ChartColumn
        width={32}
        height={32}
        fill="dark"
        className="fill-transparent stroke-white transition group-hover:stroke-accent"
      />
    ),
    url: '/stats',
  },
  {
    id: 11,
    title: 'Paramètres',
    icon: (
      <Cog
        width={32}
        height={32}
        fill="dark"
        className="fill-white transition group-hover:fill-accent"
      />
    ),
    url: '/parametres',
  },
];
