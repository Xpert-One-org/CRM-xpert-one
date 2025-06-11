'use client';
import React, { useEffect, useState } from 'react';
import Logo from './svg/Logo';
import LogoXpertCRM from './svg/LogoXpertCRM';

import Arrow from './svg/Arrow';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '../../functions/auth/signOut';
import { menuCrm } from '@/data/menu';
import Power from './svg/Power';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useSidebarOpenStore } from '@store/useSideBarOpen';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useXpertStore } from '@/store/xpert';
import { useMissionStore } from '@/store/mission';
import useChat from '@/store/chat/chat';
import { useTasksStore } from '@/store/task';
import { getTaskToTreatCount } from '@functions/tasks';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebarOpenStore();
  const menuCrmIds = menuCrm.map((el) => el.id.toString());
  const [openSubMenus, setOpenSubMenus] = useState<string[]>(menuCrmIds);
  const sidebarOpenWidth = 'min-w-[260px]';
  const pathname = usePathname();
  const {
    lastMissionNumber,
    fetchLastMissionNumber,
    lastMissionNumberFacturation,
  } = useMissionStore();

  const {
    fetchNotReadChats,
    setNotReadChatsCount,
    setNotReadChatsCountForum,
    setNotReadChatsCountEcho,
    notReadChatsCount,
    fetchNotReadChatsForum,
    fetchNotReadChatsEcho,
    notReadChatsCountForum,
    notReadChatsCountEcho,
  } = useChat();

  const { taskToTreatCount, setTaskToTreatCount, loadTaskToTreatCount } =
    useTasksStore();

  const toggleSubMenu = (id: string, open?: boolean) => {
    open
      ? setOpenSubMenus((prev) => [...prev, id])
      : setOpenSubMenus((prev) =>
          prev.includes(id)
            ? prev.filter((subId) => subId !== id)
            : [...prev, id]
        );
  };

  const { resetXperts } = useXpertStore();

  const handleMenuClick = (el: (typeof menuCrm)[0], open?: boolean) => {
    if (el.sub) {
      toggleSubMenu(el.id.toString(), open);
    }
  };

  useEffect(() => {
    if (!lastMissionNumber) {
      fetchLastMissionNumber();
    }
  }, []);

  useEffect(() => {
    fetchNotReadChats();
    fetchNotReadChatsForum();
    fetchNotReadChatsEcho();
  }, []);

  useEffect(() => {
    loadTaskToTreatCount();
  }, [taskToTreatCount]);

  return (
    <div className="relative hidden lg:block">
      <button
        title="Ouvrir ou fermer la barre de navigation"
        onClick={toggleSidebar}
        className="group absolute -right-spaceMediumContainer top-[15%] z-40 hidden cursor-pointer rounded-[5px] border border-white bg-dark p-spaceXXSmall lg:flex"
      >
        <Arrow
          style={{
            transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s',
          }}
          className={cn(
            'h-[30px] w-[30px] fill-white text-white transition group-hover:fill-accent'
          )}
        />
      </button>
      <section
        id="sidebar"
        className={cn(
          'relative z-30 flex h-screen w-fit flex-col justify-between gap-y-8 overflow-auto bg-dark py-4 pl-4 pr-4',
          { 'xl:pl-[50px] xl:pr-[72px]': isSidebarOpen }
        )}
      >
        <Link
          href={menuCrm[0].url}
          className={cn('flex items-center justify-center p-4')}
        >
          {isSidebarOpen ? (
            <LogoXpertCRM className="fill-white transition hover:fill-accent" />
          ) : (
            <Logo className="fill-white transition hover:fill-accent" />
          )}
        </Link>
        <div>
          <div>
            {menuCrm.map((el) => {
              const isActive = el.url.split('/')[1] === pathname.split('/')[1];
              const isSubMenuOpen = openSubMenus.includes(el.id.toString());
              const isChat = el.title === 'Messagerie' ? true : false;
              const isCommunity = el.title === 'Communauté' ? true : false;
              const isDashboard = el.title === 'Mon dashboard' ? true : false;

              if (
                pathname.split('/')[1] === 'messagerie' &&
                notReadChatsCount > 0
              ) {
                setNotReadChatsCount(0);
              }

              if (
                pathname.split('/')[2] === 'forum' &&
                notReadChatsCountForum > 0
              ) {
                setNotReadChatsCountForum(0);
              }

              if (
                pathname.split('/')[2] === 'xpert-one-vous-informe' &&
                notReadChatsCountEcho > 0
              ) {
                setNotReadChatsCountEcho(0);
              }

              if (isSidebarOpen) {
                return (
                  <div key={el.id} className={sidebarOpenWidth}>
                    <div
                      className={
                        'group flex w-full cursor-pointer flex-col items-center justify-start'
                      }
                    >
                      <div className={'flex w-full items-center justify-start'}>
                        <Link
                          className="flex w-full py-4"
                          href={el.url}
                          onClick={() => handleMenuClick(el, true)}
                        >
                          <div
                            className={cn(
                              `border-accent ${isActive ? 'border-l-2' : ''} pl-4`
                            )}
                          >
                            {el.icon}
                          </div>
                          <span className="ml-4 flex items-center whitespace-nowrap text-lg text-white group-hover:text-accent">
                            {el.title}
                            {isChat && notReadChatsCount > 0 && (
                              <span className="ml-2 size-[14px] rounded-full bg-important text-xs text-white" />
                            )}
                            {isCommunity &&
                              (notReadChatsCountForum > 0 ||
                                notReadChatsCountEcho > 0) && (
                                <span className="ml-2 size-[14px] rounded-full bg-important text-xs text-white" />
                              )}
                            {isDashboard &&
                              taskToTreatCount !== null &&
                              taskToTreatCount > 0 && (
                                <span className="ml-2 size-[14px] rounded-full bg-important text-xs text-white" />
                              )}
                          </span>
                        </Link>
                        {isActive && (
                          <div className="mx-3 size-2 rounded-full bg-accent" />
                        )}
                        {el.sub && (
                          <ChevronDown
                            onClick={() => handleMenuClick(el)}
                            className={cn(
                              'ml-auto h-4 w-4 stroke-white transition-transform group-hover:stroke-accent',
                              { 'rotate-180': isSubMenuOpen }
                            )}
                          />
                        )}
                      </div>
                    </div>
                    {isSubMenuOpen && (
                      <div className="mb-3 ml-4 flex flex-col gap-2 border-l pl-3 text-light-gray-third">
                        {el.sub?.map((sub) => {
                          const pathanmeWithoutParams = pathname.split('?')[0];
                          const subWithoutParams = sub.url.split('?')[0];
                          const isForum = sub.title === 'Forum' ? true : false;
                          const isTodo = sub.title === 'To Do' ? true : false;
                          const isEcho =
                            sub.title === 'Xpert One vous informe'
                              ? true
                              : false;
                          const isSubActive =
                            sub.url === '/mission/fiche'
                              ? pathanmeWithoutParams.includes(subWithoutParams)
                              : sub.url === '/mission/matching'
                                ? pathanmeWithoutParams.includes(
                                    subWithoutParams
                                  )
                                : sub.url === '/mission/selection'
                                  ? pathanmeWithoutParams.includes(
                                      subWithoutParams
                                    )
                                  : sub.url ===
                                      '/mission/activation-des-missions'
                                    ? pathanmeWithoutParams.includes(
                                        subWithoutParams
                                      )
                                    : sub.url ===
                                        '/facturation/gestion-des-facturations'
                                      ? pathanmeWithoutParams.includes(
                                          subWithoutParams
                                        )
                                      : subWithoutParams ===
                                        pathanmeWithoutParams;

                          return (
                            <div key={sub.url} className="flex items-center">
                              <Link
                                href={
                                  sub.url === '/mission/fiche'
                                    ? `/mission/fiche/${lastMissionNumber.split(' ').join('-').toUpperCase()}`
                                    : sub.url === '/mission/matching'
                                      ? `/mission/matching/${lastMissionNumber.split(' ').join('-').toUpperCase()}`
                                      : sub.url === '/mission/selection'
                                        ? `/mission/selection/${lastMissionNumber.split(' ').join('-').toUpperCase()}`
                                        : sub.url ===
                                            '/mission/activation-des-missions'
                                          ? `/mission/activation-des-missions/${lastMissionNumber.split(' ').join('-').toUpperCase()}`
                                          : sub.url ===
                                              '/facturation/gestion-des-facturations'
                                            ? `/facturation/gestion-des-facturations/${lastMissionNumberFacturation.split(' ').join('-').toUpperCase()}`
                                            : sub.url
                                }
                                className={cn(
                                  'w-fit px-[10px] py-1 font-light hover:text-accent',
                                  {
                                    'bg-dark_hard text-white': isSubActive,
                                  }
                                )}
                              >
                                {sub.title}
                              </Link>

                              {isDashboard &&
                              isTodo &&
                              taskToTreatCount &&
                              taskToTreatCount > 0 ? (
                                <span className="ml-2 flex size-[10px] rounded-full bg-important text-xs text-white" />
                              ) : null}

                              {isCommunity &&
                                ((isForum && notReadChatsCountForum > 0) ||
                                  (isEcho && notReadChatsCountEcho > 0)) && (
                                  <span className="ml-2 flex size-[10px] rounded-full bg-important text-xs text-white" />
                                )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              } else {
                const isMessagerie =
                  el.title === 'Messagerie externe' ? true : false;
                const isStats = el.title === 'Statistiques' ? true : false;
                return (
                  <Link
                    onClick={resetXperts}
                    href={el.url}
                    key={el.id}
                    className={cn(
                      'group flex items-center justify-center py-4',
                      {
                        'justify-start': isSidebarOpen,
                      }
                    )}
                  >
                    {!isSidebarOpen && (
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={cn(' ', {
                              'border-l-2 border-accent':
                                isSidebarOpen && isActive,
                              'pl-4': isSidebarOpen,
                              '[&>*]:stroke-accent': isActive && !isSidebarOpen,
                              '[&>*]:fill-accent':
                                isActive &&
                                !isSidebarOpen &&
                                !isMessagerie &&
                                !isStats,
                              strokeAccent: isActive && !isSidebarOpen,
                            })}
                          >
                            {el.icon}{' '}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-xs border-none bg-dark p-0 px-2 text-xs text-white">
                          <p>{el.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </Link>
                );
              }
            })}
          </div>
          <div>
            {/*  LOGOUT  */}
            <form action={signOut}>
              <button
                type="submit"
                className={cn('group flex items-center justify-center p-4', {
                  'justify-start': isSidebarOpen,
                })}
              >
                {isSidebarOpen ? (
                  <>
                    <Power
                      width={32}
                      height={32}
                      className="fill-white transition group-hover:fill-accent"
                    />
                    <span className="ml-4 text-lg text-white group-hover:text-accent">
                      Déconnexion
                    </span>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={cn(' ', {
                          'border-l-2 border-accent': isSidebarOpen,
                          'pl-4': isSidebarOpen,
                        })}
                      >
                        <Power
                          width={32}
                          height={32}
                          className="fill-white transition group-hover:fill-accent"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-xs border-none bg-dark p-0 px-2 text-xs text-white">
                      <p>Déconnexion</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </button>
            </form>
          </div>
        </div>
        <div></div>
      </section>
    </div>
  );
}
