'use client';

// Ce fichier est une modification du composant ChatContent qui suit la même structure que le fichier que vous avez montré,
// mais ajoute la prise en charge du mode lecture seule pour les conversations entre experts.

import React, { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DESKTOP } from '@/data/constant';
import { ChevronLeft, Lock } from 'lucide-react';
import type { RealtimePresenceState } from '@supabase/supabase-js';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import useChat from '@/store/chat/chat';
import type { ChatType, DBChat } from '@/types/typesDb';
import useUser from '@/store/useUser';
import { useChatContent } from '@/store/chat/content';
import { useMediaQuery } from '@/hooks/use-media-query';
import { handleReadNewMessage, getMessages } from '@functions/chat';
import SkeletonChat from './skeletons/SkeletonChat';
import Loader from '@/components/Loader';
import { MsgCard } from './MsgCard';
import { AuthContext } from '@/components/auth/AuthProvider';

type ChatContentProps = {
  type: ChatType;
  className?: string;
  readOnly?: boolean;
};

export default function ReadOnlyChatContent({
  className,
  type,
  readOnly = false,
}: Readonly<ChatContentProps>) {
  const {
    inputScrollHeight,
    getChatSelectedWithRightType,
    isLoading,
    getMessagesRightType,
    setCurrentChatSelected,
    getChatWithRightType,
    setCurrentMessages,
  } = useChat();

  const { user } = useContext(AuthContext);

  const chatSelected = getChatSelectedWithRightType(type);
  const chats = getChatWithRightType(type);
  const { mission_number } = chatSelected?.mission ?? {};
  const scrollRef = useRef<HTMLDivElement>(null);
  const { minimal_profile, fetchMinimalProfile } = useUser();

  const isDesktop = useMediaQuery(DESKTOP);
  const { isMoreDataLoading } = useChatContent({ type, scrollRef });
  const supabase = createSupabaseFrontendClient();

  const refreshMessages = async () => {
    if (!chatSelected?.id) return;
    const { data, error } = await getMessages({
      chat_id: chatSelected.id,
    });
    if (!error && data) {
      setCurrentMessages(type, data);
    }
  };

  useEffect(() => {
    fetchMinimalProfile();
  }, [fetchMinimalProfile]);

  useEffect(() => {
    if (!chats) return;
    if (!chatSelected) {
      setCurrentChatSelected(chats[0]);
    }
  }, [chats, chatSelected, setCurrentChatSelected]);

  useEffect(() => {
    const channel = supabase.channel(`conversation:${chatSelected?.id}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        const state: RealtimePresenceState<{ user_id: string }> =
          channel.presenceState();

        const currentUserPresence = Object.values(state)
          .flat()
          .find((presence) => presence.user_id === user?.id);
        if (currentUserPresence && chatSelected) {
          chatSelected.messages.forEach((m) => {
            if (!m.read_by.includes(user?.id ?? '')) {
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
            user_id: user?.id ?? '',
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [chatSelected, supabase, user?.id]);

  const messages = getMessagesRightType(type);

  return (
    <div
      className={cn(
        'relative w-[calc(100%_-_342px)] overflow-scroll rounded-r-lg shadow-container lg:block lg:bg-background',
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
          <div className="flex items-center gap-2">
            {readOnly && <Lock size={18} className="text-yellow-400" />}
            <p className="max-w-[75%] break-words text-lg font-[500] text-white">
              {chatSelected?.title}
              {mission_number && ` - ${mission_number}`}
            </p>
          </div>
          {readOnly && (
            <span className="text-xs text-gray-200">
              Vous consultez une conversation entre experts (lecture seule)
            </span>
          )}
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
            {messages.length === 0 ? (
              <div className="mt-8 text-center text-gray-500">
                <p>Aucun message dans cette conversation.</p>
              </div>
            ) : (
              messages.map((m) => (
                <MsgCard
                  user_id={user?.id ?? ''}
                  type={type}
                  key={m.id}
                  message={m}
                  onDelete={refreshMessages}
                  readOnly={readOnly}
                />
              ))
            )}
          </div>
        </div>
      )}

      {readOnly && (
        <div className="flex h-14 items-center justify-center border-t bg-gray-50 text-center text-sm text-gray-500">
          <Lock size={16} className="mr-2" />
          Cette conversation est en lecture seule
        </div>
      )}
    </div>
  );
}
