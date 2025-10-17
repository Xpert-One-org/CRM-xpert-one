import Input from '@/components/inputs/Input';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import React from 'react';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import MenuBurger from '@components/MenuBurger';
import NotificationBell from '@components/NotificationBell';
import ActualPageTitle from './actual-page-title';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { getLoggedUser } from '@functions/auth/getLoggedUser';

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

  const userData = await getLoggedUser();

  return (
    <section className="flex w-full">
      {/* SIDEBAR DESKTOP*/}
      <AuthProvider initialUser={userData}>
        <Sidebar />

        <section className="flex h-screen w-full flex-col overflow-auto bg-lightgray-secondary p-spaceContainer sm:rounded-xl lg:pt-[11px]">
          <div className="relative grid grid-cols-3 items-center justify-end gap-x-spaceContainer px-spaceContainer lg:flex lg:items-end lg:px-0">
            {/* BURGER MOBILE SHEET */}
            <MenuBurger />

            <ActualPageTitle className="flex items-center justify-center" />
            <div className="flex items-center justify-end gap-x-spaceSmall sm:gap-x-spaceContainer lg:items-end">
              <div>
                <NotificationBell user={user} />
              </div>
              <Image
                src={
                  userData.avatar_url
                    ? userData.avatar_url
                    : '/static/avatar.png'
                }
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
      </AuthProvider>
    </section>
  );
}
