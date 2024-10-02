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

  const NOT_FILL_ICON = ['Messagerie', 'Newsletter', 'Blog'];

  const pathname = usePathname();

  const toggleSubMenu = (id: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative hidden lg:block">
      <button
        onClick={toggleSidebar}
        className="group absolute -right-spaceMediumContainer top-[15%] z-40 hidden cursor-pointer rounded-[5px] border border-white bg-colors-dark p-spaceXXSmall lg:flex"
      >
        <Arrow
          style={{
            transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s',
          }}
          className={cn(
            'h-[30px] w-[30px] fill-white text-white transition group-hover:fill-colors-accent'
          )}
        />
      </button>
      <section
        id="sidebar"
        className={cn(
          'relative z-30 flex h-screen w-fit flex-col justify-between gap-y-8 overflow-auto bg-colors-dark py-4 pl-4 pr-4',
          { 'xl:pl-[50px] xl:pr-[72px]': isSidebarOpen }
        )}
      >
        <Link
          href={menuCrm[0].url}
          className={cn('flex items-center justify-center p-4')}
        >
          {isSidebarOpen ? (
            <LogoXpertCRM className="fill-white transition hover:fill-colors-accent" />
          ) : (
            <Logo className="fill-white transition hover:fill-colors-accent" />
          )}
        </Link>
        <div>
          <div>
            {menuCrm.map((el, index) => {
              if (index === menuCrm.length - 1) return;
              const isActive = el.url.split('/')[1] === pathname.split('/')[1];
              const isSubMenuOpen = openSubMenus.includes(el.id.toString());
              if (isSidebarOpen) {
                return (
                  <div key={el.id}>
                    <div
                      className={
                        'group flex w-full cursor-pointer flex-col items-center justify-start py-4'
                      }
                      onClick={() => toggleSubMenu(el.id.toString())}
                    >
                      <div className={'flex w-full items-center justify-start'}>
                        <div
                          className={cn(
                            `border-colors-accent ${isActive ? 'border-l-2' : ''} pl-4`
                          )}
                        >
                          {el.icon}
                        </div>

                        <span className="ml-4 whitespace-nowrap text-lg text-white group-hover:text-colors-accent">
                          {el.title}
                        </span>
                        {isActive && (
                          <div className="ml-3 size-2 rounded-full bg-colors-accent" />
                        )}
                        {el.sub && (
                          <ChevronDown
                            className={cn(
                              'ml-auto h-4 w-4 transition-transform',
                              { 'rotate-180': isSubMenuOpen }
                            )}
                          />
                        )}
                      </div>
                    </div>
                    {isSubMenuOpen && (
                      <div className="mb-3 ml-4 flex flex-col gap-2 border-l pl-3 text-colors-light-gray-third">
                        {el.sub?.map((sub) => {
                          const isSubActive = sub.url === pathname;
                          return (
                            <Link
                              key={sub.url}
                              href={sub.url}
                              className={cn('w-fit px-[10px] py-1 font-light', {
                                'bg-colors-dark_hard text-white': isSubActive,
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
              }
            })}
          </div>
          <div>
            {menuCrm.slice(-1).map((el) => {
              const isActive = el.url.split('/')[1] === pathname.split('/')[1];
              return (
                <Link
                  href={el.url}
                  key={el.id}
                  className={cn('group flex items-center justify-center py-4', {
                    'justify-start': isSidebarOpen,
                  })}
                >
                  {!isSidebarOpen && (
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={cn('', {
                            'border-l-2 border-colors-accent':
                              isSidebarOpen && isActive,
                            'pl-4': isSidebarOpen,
                            '[&>*]:fill-colors-accent':
                              isActive &&
                              !isSidebarOpen &&
                              !NOT_FILL_ICON.includes(el.title),
                            strokeAccent:
                              isActive &&
                              !isSidebarOpen &&
                              NOT_FILL_ICON.includes(el.title),
                          })}
                        >
                          {el.icon}{' '}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="rounded-xs border-none bg-colors-dark p-0 px-2 text-xs">
                        <p>{el.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {isSidebarOpen && (
                    <>
                      <div
                        className={cn('', {
                          'border-l-2 border-colors-accent':
                            isSidebarOpen && isActive,
                          'pl-4': isSidebarOpen,
                          '[&>*]:fill-colors-accent':
                            isActive &&
                            !isSidebarOpen &&
                            !NOT_FILL_ICON.includes(el.title),
                          strokeAccent:
                            isActive &&
                            !isSidebarOpen &&
                            NOT_FILL_ICON.includes(el.title),
                        })}
                      >
                        {el.icon}{' '}
                      </div>
                      <span className="ml-4 whitespace-nowrap text-lg text-white group-hover:text-colors-accent">
                        {el.title}
                      </span>
                    </>
                  )}
                  {isSidebarOpen && isActive && (
                    <div className="ml-3 size-2 rounded-full bg-colors-accent" />
                  )}
                </Link>
              );
            })}
            {/*  LOGOUT  */}
            <form action={signOut}>
              <button
                type="submit"
                className={cn('group flex items-center justify-center p-4', {
                  'justify-start': isSidebarOpen,
                })}
              >
                <Power
                  width={32}
                  height={32}
                  className="fill-white transition group-hover:fill-colors-accent"
                />
                {isSidebarOpen && (
                  <span className="ml-4 text-lg text-white group-hover:text-colors-accent">
                    Déconnexion
                  </span>
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
