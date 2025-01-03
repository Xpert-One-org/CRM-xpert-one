'use client';
import TabContent from '../_components/TabContent';
import ChatContent from '../_components/ChatContent';
import PopupNewChat from '../_components/PopupNewChat';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function MessageriePage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['intern', 'hr']}>
      <section className="relative flex h-full flex-col gap-spaceXSmall lg:max-h-[calc(100vh_-_170px)]">
        {/* <InformativePopup /> */}

        <div className="w-full px-spaceContainer lg:px-0">
          <div>
            <PopupNewChat text="Chatter avec un X / F" />
          </div>
        </div>
        {/* Container  */}
        <section className="mt-spaceSmall flex w-full grow">
          {/* Tabs */}
          <TabContent type="chat" />
          {/* Content */}
          <ChatContent type="chat" />
        </section>
      </section>
    </ProtectedRoleRoutes>
  );
}
