import Input from '@/components/inputs/Input';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import React from 'react';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import MenuBurger from '@components/MenuBurger';
import NotificationBell from '@components/NotificationBell';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ActualPageTitle from './actual-page-title';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { data: null, error: 'User not found' };
  }
  const { avatar_url } =
    (await supabase.from('profile').select('*').eq('id', user.id).single())
      .data ?? {};

  return (
    <section className="flex w-full">
      {/* SIDEBAR DESKTOP*/}
      <Sidebar />

      <section className="flex h-screen w-full flex-col overflow-auto bg-lightgray-secondary p-spaceContainer sm:rounded-xl lg:pt-[11px]">
        <div className="relative grid grid-cols-3 items-center justify-between gap-x-spaceContainer px-spaceContainer lg:flex lg:items-end lg:px-0">
          {/* BURGER MOBILE SHEET */}
          <MenuBurger />
          <Tooltip>
            <TooltipTrigger className="w-full max-w-[280px]" asChild>
              <Input
                type="search"
                disabled
                className="hidden w-full max-w-[280px] lg:block"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>La recherche est actuellement en cours de re-développement</p>
            </TooltipContent>
          </Tooltip>

          <ActualPageTitle className="flex items-center justify-center" />
          <div className="flex items-center justify-end gap-x-spaceSmall sm:gap-x-spaceContainer lg:items-end">
            <div>
              <NotificationBell />
            </div>
            <Image
              src={avatar_url ? avatar_url : '/static/avatar.png'}
              alt=""
              width={64}
              height={64}
              className="size-[51px] rounded-full object-cover sm:size-[64px]"
            />
          </div>
          <div className="sm:hidden" />
        </div>

        {/* <ActualPageTitle className="flex justify-center pt-6 text-center lg:hidden" role={role} /> */}

        <section className="mt-spaceContainer grow rounded-s pb-[100px] sm:pb-[auto] md:bg-white md:p-spaceContainer md:shadow-container">
          {children}
        </section>
      </section>
    </section>
  );
}
