'use client';
import { DESKTOP } from '@/data/constant';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import useChat from '@/store/chat/chat';
import { useRealtimeChat } from '@/store/chat/realtime';
import useUser from '@/store/useUser';
import type { ChatType, DBChat } from '@/types/typesDb';
import { getTimeFromNow } from '@/utils/getTimeFromNow';
import React, { useEffect } from 'react';

type TabContentProps = {
  type: ChatType;
  user_id: string;
} & React.HTMLAttributes<HTMLDivElement>

export default function TabContent({
  className,
  type,
  user_id,
}: Readonly<TabContentProps>) {
  const {
    setChatSelected,
    chatSelected,
    setChats: setStoreChats,
    isLoading,
  } = useChat();

  const { chats } = useRealtimeChat({ type, user_id: user_id });

  const isDektop = useMediaQuery(DESKTOP);

  useEffect(() => {
    setStoreChats(chats);
    !chatSelected && isDektop && setChatSelected(chats[0]);
  }, [chats, isDektop]);

  return (
    <div
      className={cn(
        'border-colors-fond-gray hidden w-full max-w-full flex-col overflow-auto border lg:flex lg:max-h-[calc(100vh_-_232px)] lg:max-w-[342px] lg:rounded-l-lg lg:border-[1px]',
        className,
        { 'lg:max-h-[calc(100vh_-_295px)]': type === 'forum' },
        { 'flex rounded-none border-[0px]': !isDektop && !chatSelected }
      )}
    >
      {chats.length === 0 && (
        <p className="text-colors-light-gray-third p-spaceMedium text-center">
          Aucun message
        </p>
      )}
      {chats.map((chat, index) => {
        const isReadByMe =
          chat.messages[chat.messages.length - 1]?.read_by.includes(user_id) ||
          chat.messages[chat.messages.length - 1]?.send_by === user_id ||
          !chat.messages.length;
        return (
          <TabChat
            key={chat.id}
            index={index}
            isReadByMe={isReadByMe}
            chat={chat}
            chatSelected={chatSelected}
            disabled={isDektop ? isLoading : false}
          />
        );
      })}
    </div>
  );
}

const TabChat = ({
  chat,
  index,
  chatSelected,
  isReadByMe,

  disabled = false,
}: {
  chat?: DBChat;
  index: number;
  chatSelected: DBChat | null;
  disabled: boolean;
  isReadByMe: boolean;
}) => {
  const { title } = chat ?? {};
  const { created_at: sent_at, read_by } = chat?.messages[0] ?? {};

  const { updateMessageRead, setChatSelected, setChats } = useChat();

  const handleChangeTab = () => {
    if (!chat) return;
    setChatSelected(chat);

    updateMessageRead({ chat_id: chat.id, read_by: read_by ?? [] });
  };

  return (
    <button
      disabled={disabled}
      className={cn(
        'border-colors-fond-gray flex items-center gap-x-spaceMedium border-y-[1px] px-spaceMedium py-spaceContainer text-left lg:border-t-0',
        {
          'lg:bg-colors-chat-selected':
            chatSelected == null ? index === 0 : chatSelected.id === chat?.id,
        },
        { 'bg-colors-chat-selected': chatSelected?.id === chat?.id }
      )}
      onClick={handleChangeTab}
    >
      <div>
        <div
          className={cn(
            'z-20 flex h-3 w-3 animate-pulse items-center justify-center rounded-full border-2 border-transparent bg-[#FFA800] font-bold text-white group-hover:scale-110',
            {
              'bg-colors-primary animate-none':
                isReadByMe || isReadByMe == null,
            }
          )}
        />
      </div>
      <div className="flex flex-col">
        <p className="text-colors-light-gray-third text-xs font-[400]">
          Reçu{' '}
          {getTimeFromNow(sent_at ?? new Date().toISOString()).toLowerCase()}
        </p>
        <p className="max-w-[200px] truncate font-[700]">
          {title}
        </p>
      </div>
    </button>
  );
};
