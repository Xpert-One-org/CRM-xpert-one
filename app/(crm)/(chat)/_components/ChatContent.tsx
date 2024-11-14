'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DESKTOP } from '@/data/constant';
import { ChevronLeft } from 'lucide-react';
import type { RealtimePresenceState } from '@supabase/supabase-js';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import useChat from '@/store/chat/chat';
import type { ChatType, DBChat } from '@/types/typesDb';
import useUser from '@/store/useUser';
import { useChatContent } from '@/store/chat/content';
import { useMediaQuery } from '@/hooks/use-media-query';
import { handleReadNewMessage } from '@functions/chat';
import SkeletonChat from './skeletons/SkeletonChat';
import Loader from '@/components/Loader';
import { MsgCard } from './MsgCard';
import InputSend from './InputSend';

export default function ChatContent({
  user_id,
  className,
  type,
}: Readonly<{
  user_id: string;
  type: ChatType;
  chat?: DBChat;
  className?: string;
}>) {
  const {
    inputScrollHeight,
    getChatSelectedWithRightType,
    isLoading,
    getMessagesRightType,
    setCurrentChatSelected,
    getChatWithRightType,
  } = useChat();

  const chatSelected = getChatSelectedWithRightType(type);
  const chats = getChatWithRightType(type);
  const { mission_number } = chatSelected?.mission ?? {};
  const scrollRef = useRef<HTMLDivElement>(null);
  const { minimal_profile, fetchMinimalProfile } = useUser();

  const isDesktop = useMediaQuery(DESKTOP);
  const { isMoreDataLoading } = useChatContent({ type, scrollRef });
  const supabase = createSupabaseFrontendClient();

  useEffect(() => {
    fetchMinimalProfile();
  }, []);

  useEffect(() => {
    if (!chats) return;
    if (!chatSelected) {
      setCurrentChatSelected(chats[0]);
    }
  }, [chats]);

  useEffect(() => {
    const channel = supabase.channel(`conversation:${chatSelected}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state: RealtimePresenceState<{ user_id: string }> =
          channel.presenceState();

        const currentUserPresence = Object.values(state)
          .flat()
          .find((presence) => presence.user_id === user_id);
        if (currentUserPresence && chatSelected) {
          chatSelected.messages.map((m) => {
            if (!m.read_by.includes(user_id)) {
              handleReadNewMessage({
                chat_id: chatSelected.id,
                read_by: m.read_by,
              });
            }
          });
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user_id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [chatSelected]);

  const messages = getMessagesRightType(type);

  return (
    <div
      className={cn(
        'relative w-[calc(100%_-_342px)] rounded-r-lg shadow-container lg:block lg:bg-background',
        className,
        { hidden: !isDesktop && !chatSelected },
        { 'w-full': !isDesktop && chatSelected }
      )}
    >
      <div className="relative h-[112px] w-full rounded-tr-lg">
        <Image
          src="/static/background.jpg"
          fill
          objectFit="cover"
          alt="confirm-popup"
          className="rounded-tr-lg"
        />
        <div className="absolute left-0 top-0 size-full rounded-tr-lg bg-black opacity-50" />
        <button
          className="absolute left-spaceContainer top-1/2 z-10 -translate-y-1/2 cursor-pointer lg:hidden"
          onClick={() => setCurrentChatSelected(null)}
        >
          <ChevronLeft color="white" />
        </button>
        <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-spaceXSmall">
          <p className="max-w-[75%] break-words text-lg font-[500] text-white">
            {chatSelected?.title}
            {mission_number && ` - ${mission_number}`}
          </p>
        </div>
      </div>
      {isLoading ? (
        <SkeletonChat />
      ) : (
        <div className="flex flex-col items-center px-[30px]">
          <div
            ref={scrollRef}
            style={{
              maxHeight: `calc(100vh - 400px - ${inputScrollHeight})`,
            }}
            className="flex w-full flex-col items-center gap-y-[22px] overflow-auto pb-10 pt-spaceContainer"
          >
            {isMoreDataLoading && <Loader />}
            {messages.map((m, i) => {
              return (
                <MsgCard user_id={user_id} type={type} key={m.id} message={m} />
              );
            })}
          </div>
        </div>
      )}
      {/* Input */}
      <InputSend user_id={user_id} profile={minimal_profile} type={type} />
    </div>
  );
}
