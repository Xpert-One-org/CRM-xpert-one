'use client';
import React, { useState } from 'react';
import Logo from './svg/Logo';
import LogoXpertCRM from './svg/LogoXpertCRM';

import Arrow from './svg/Arrow';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '@/utils/functions/auth/signOut';
import { menuCrm } from '@/data/menu';
import Power from './svg/Power';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useSidebarOpenStore } from '@store/useSideBarOpen';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useSidebarOpenStore();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

  const pathname = usePathname();

  const toggleSubMenu = (id: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [id]
    );
  };

  const handleMenuClick = (el: (typeof menuCrm)[0]) => {
    if (el.sub) {
      toggleSubMenu(el.id.toString());
    } else {
      setOpenSubMenus([]);
    }
  };

  return (
    <div className="relative hidden lg:block">
      <button
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
              if (isSidebarOpen) {
                return (
                  <div key={el.id}>
                    <Link
                      href={el.url}
                      className={
                        'group flex w-full cursor-pointer flex-col items-center justify-start py-4'
                      }
                      onClick={() => handleMenuClick(el)}
                    >
                      <div className={'flex w-full items-center justify-start'}>
                        <div
                          className={cn(
                            `border-accent ${isActive ? 'border-l-2' : ''} pl-4`
                          )}
                        >
                          {el.icon}
                        </div>
                        <span className="ml-4 whitespace-nowrap text-lg text-white group-hover:text-accent">
                          {el.title}
                        </span>
                        {isActive && (
                          <div className="ml-3 size-2 rounded-full bg-accent" />
                        )}
                        {el.sub && (
                          <ChevronDown
                            className={cn(
                              'ml-auto h-4 w-4 stroke-white transition-transform group-hover:stroke-accent',
                              { 'rotate-180': isSubMenuOpen }
                            )}
                          />
                        )}
                      </div>
                    </Link>
                    {isSubMenuOpen && (
                      <div className="mb-3 ml-4 flex flex-col gap-2 border-l pl-3 text-light-gray-third">
                        {el.sub?.map((sub) => {
                          const isSubActive = sub.url === pathname;
                          return (
                            <Link
                              key={sub.url}
                              href={sub.url}
                              className={cn('w-fit px-[10px] py-1 font-light', {
                                'bg-dark_hard text-white': isSubActive,
                              })}
                            >
                              {sub.title}
                            </Link>
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
