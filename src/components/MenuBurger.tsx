'use client';
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import LogoWithText from './svg/LogoWithText';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { menuCrm } from '@/data/menu';
import { usePathname, useRouter } from 'next/navigation';
import { ScrollArea } from './ui/scroll-area';
import { signOut } from '@/utils/functions/auth/signOut';
import Power from './svg/Power';

export default function MenuBurger() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Menu size={30} />
        </SheetTrigger>
        <SheetContent
          side={'left'}
          className="flex w-full flex-col items-center border-r-0 bg-colors-dark"
        >
          <ScrollArea className="flex h-screen w-full flex-col items-center justify-center px-[10%] pt-spaceLarge">
            <Link
              href={'#'}
              className={'flex items-center justify-center p-4 pb-spaceLarge'}
            >
              <LogoWithText className="fill-white transition" />
            </Link>
            <div className="h-full">
              {menuCrm.map((crm, index) => {
                if (index === menuCrm.length - 1) return;
                const isActive =
                  crm.url.split('/')[1] === pathname.split('/')[1];
                if (isActive && crm.sub) {
                  return (
                    <div key={crm.id} className="">
                      <div
                        className={
                          'group flex w-full cursor-pointer flex-col items-center justify-start py-4'
                        }
                      >
                        <div
                          className={'flex w-full items-center justify-start'}
                        >
                          <div
                            className={cn(
                              'border-l-2 border-colors-accent pl-4'
                            )}
                          >
                            {crm.icon}{' '}
                          </div>

                          <span className="ml-4 whitespace-nowrap text-lg text-white">
                            {crm.title}
                          </span>
                          <div className="ml-3 size-2 rounded-full bg-colors-accent" />
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    href={crm.url}
                    key={crm.id}
                    className={cn('group flex items-center justify-start py-4')}
                  >
                    <div
                      className={cn('pl-4', {
                        'border-l-2 border-colors-accent': isActive,
                      })}
                    >
                      {crm.icon}{' '}
                    </div>
                    <span className="ml-4 whitespace-nowrap text-lg text-white group-hover:text-colors-accent">
                      {crm.title}
                    </span>

                    {isActive && (
                      <div className="ml-3 size-2 rounded-full bg-colors-accent" />
                    )}
                  </Link>
                );
              })}
            </div>
            <div>
              {menuCrm.slice(-1).map((crm) => {
                const isActive =
                  crm.url.split('/')[1] === pathname.split('/')[1];
                return (
                  <Link
                    href={crm.url}
                    key={crm.id}
                    className={cn('group flex items-center justify-start py-4')}
                  >
                    <div
                      className={cn('pl-4', {
                        'border-l-2 border-colors-accent pl-4': isActive,
                      })}
                    >
                      {crm.icon}{' '}
                    </div>
                    <span className="ml-4 whitespace-nowrap text-lg text-white group-hover:text-colors-accent">
                      {crm.title}
                    </span>
                    {isActive && (
                      <div className="ml-3 size-2 rounded-full bg-colors-accent" />
                    )}
                  </Link>
                );
              })}
              <form action={signOut}>
                <button
                  className={cn('group flex items-center justify-start p-4')}
                >
                  <Power
                    width={32}
                    height={32}
                    className="fill-white transition group-hover:fill-colors-accent"
                  />
                  <span className="ml-4 text-lg text-white group-hover:text-colors-accent">
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
