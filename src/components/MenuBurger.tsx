'use client';
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown } from 'lucide-react';
import LogoWithText from './svg/LogoWithText';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { menuCrm } from '@/data/menu';
import { usePathname } from 'next/navigation';
import { ScrollArea } from './ui/scroll-area';
import { signOut } from '../../functions/auth/signOut';
import Power from './svg/Power';

export default function MenuBurger() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleSubMenu = (id: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMenuClick = (crm: (typeof menuCrm)[0]) => {
    if (crm.sub) {
      toggleSubMenu(crm.id.toString());
    } else {
      setOpenSubMenus([]);
    }
  };

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Menu size={30} />
        </SheetTrigger>
        <SheetContent
          side={'left'}
          className="flex w-full flex-col items-center border-r-0 bg-dark text-white"
        >
          <ScrollArea className="flex h-screen w-full flex-col items-center justify-center px-[10%] pt-spaceLarge">
            <Link
              href={'#'}
              className={'flex items-center justify-center p-4 pb-spaceLarge'}
            >
              <LogoWithText className="fill-white transition" />
            </Link>
            <div className="h-full">
              {menuCrm.map((crm) => {
                const isActive =
                  crm.url.split('/')[1] === pathname.split('/')[1];
                const isSubMenuOpen = openSubMenus.includes(crm.id.toString());
                return (
                  <div key={crm.id}>
                    <Link
                      href={crm.url}
                      className={
                        'group flex w-full cursor-pointer flex-col items-center justify-start py-4'
                      }
                      onClick={() => handleMenuClick(crm)}
                    >
                      <div className={'flex w-full items-center justify-start'}>
                        <div
                          className={cn(
                            `border-accent ${isActive ? 'border-l-2' : ''} pl-4`
                          )}
                        >
                          {crm.icon}{' '}
                        </div>

                        <span className="ml-4 whitespace-nowrap text-lg text-white group-hover:text-accent">
                          {crm.title}
                        </span>
                        {isActive && (
                          <div className="ml-3 size-2 rounded-full bg-accent" />
                        )}
                        {crm.sub && (
                          <ChevronDown
                            className={cn(
                              'ml-auto h-4 w-4 stroke-white transition-transform',
                              { 'rotate-180': isSubMenuOpen }
                            )}
                          />
                        )}
                      </div>
                    </Link>
                    {isSubMenuOpen && crm.sub && (
                      <div className="mb-3 ml-4 flex flex-col gap-2 border-l pl-3 text-light-gray-third">
                        {crm.sub.map((sub) => {
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
              })}
              <form action={signOut}>
                <button
                  className={cn('group flex items-center justify-start p-4')}
                >
                  <Power
                    width={32}
                    height={32}
                    className="fill-white transition group-hover:fill-accent"
                  />
                  <span className="ml-4 text-lg text-white group-hover:text-accent">
                    Déconnexion
                  </span>
                </button>
              </form>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
