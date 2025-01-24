'use client';
import TabContent from '../_components/TabContent';
import ChatContent from '../_components/ChatContent';
import PopupNewChat from '../_components/PopupNewChat';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import NotesSection from '../_components/NotesSection'; // Import the new component
import ChatUserInfo from '../_components/ChatUserInfo';
import ChatActions from '../_components/ChatActions';

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
          {/* Notes Section */}
          <div className="ml-6 flex h-[calc(100vh_-_255px)] w-full flex-col lg:max-w-[300px]">
            <div className="flex-1 space-y-4 overflow-y-auto">
              <ChatUserInfo />
              <NotesSection />
              <ChatActions />
              {/* Bouton action */}
            </div>
          </div>
        </section>
      </section>
    </ProtectedRoleRoutes>
  );
}
