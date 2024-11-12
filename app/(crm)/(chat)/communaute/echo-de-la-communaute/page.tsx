import React from 'react';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import TabContent from '../../_components/TabContent';
import ChatContent from '../../_components/ChatContent';
import PopupNewChat from '../../_components/PopupNewChat';

export default async function page() {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { redirect: '/login' };
  }

  return (
    <section className="flex h-full flex-col gap-spaceXSmall lg:max-h-[calc(100vh_-_170px)]">
      <div className="flex w-full justify-end px-spaceContainer lg:px-0">
        <div className="flex items-center gap-x-4">
          {/* <BtnRefresh /> */}
          <PopupNewChat type="echo_community" text="Nouvel echo" />
        </div>
      </div>
      {/* Container  */}
      <section className="mt-spaceSmall flex w-full grow">
        {/* Tabs */}
        <TabContent user_id={user.id} type={'echo_community'} />

        {/* Content */}

        <ChatContent user_id={user.id} type={'echo_community'} />
      </section>
    </section>
  );
}
