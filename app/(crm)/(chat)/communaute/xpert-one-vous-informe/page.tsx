'use client';

import React from 'react';
import TabContent from '../../_components/TabContent';
import ChatContent from '../../_components/ChatContent';
import PopupNewChat from '../../_components/PopupNewChat';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function EchoDeLaCommunautePage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern', 'hr']}>
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
          <TabContent type={'echo_community'} />

          {/* Content */}

          <ChatContent type={'echo_community'} />
        </section>
      </section>
    </ProtectedRoleRoutes>
  );
}
