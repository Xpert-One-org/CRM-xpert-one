'use client';

import React from 'react';
import TabContent from '../../_components/TabContent';
import ChatContent from '../../_components/ChatContent';
import PopupNewChat from '../../_components/PopupNewChat';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function ForumPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern', 'hr']}>
      <section className="flex h-full flex-col gap-spaceXSmall lg:max-h-[calc(100vh_-_170px)]">
        <div className="flex w-full justify-end px-spaceContainer lg:px-0">
          <div className="flex items-center gap-x-4">
            {/* <BtnRefresh /> */}
            <PopupNewChat type="forum" text="Créer une discussion" />
          </div>
        </div>
        {/* Container  */}
        <section className="mt-spaceSmall flex w-full grow">
          {/* Tabs */}
          <TabContent type={'forum'} />

          {/* Content */}

          <ChatContent type={'forum'} />
        </section>
      </section>
    </ProtectedRoleRoutes>
  );
}
