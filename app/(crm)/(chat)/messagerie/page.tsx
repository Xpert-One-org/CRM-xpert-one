import { DBChat } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import TabContent from '../_components/TabContent';
import ChatContent from '../_components/ChatContent';
import PopupNewChat from '../_components/PopupNewChat';

export default async function page() {
  const supabase = await createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { redirect: '/login' };
  }

  return (
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
        <TabContent type="chat" user_id={user.id} />
        {/* Content */}
        <ChatContent user_id={user.id} type="chat" />
      </section>
    </section>
  );
}
