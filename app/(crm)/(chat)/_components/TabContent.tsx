'use client';
import { DESKTOP } from '@/data/constant';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import useChat from '@/store/chat/chat';
import { useRealtimeChat } from '@/store/chat/realtime';
import type { ChatType, DBChat } from '@/types/typesDb';
import { getTimeFromNow } from '@/utils/getTimeFromNow';
import { handleReadNewMessage } from '@functions/chat';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type TabContentProps = {
  type: ChatType;
} & React.HTMLAttributes<HTMLDivElement>;

export default function TabContent({
  className,
  type,
}: Readonly<TabContentProps>) {
  const {
    setCurrentChatSelected,
    getChatSelectedWithRightType,
    isLoading,
    getChatWithRightType,
  } = useChat();

  const { user } = useAuth();

  useRealtimeChat({ type, user_id: user?.id ?? '' });
  const isDektop = useMediaQuery(DESKTOP);
  const chats = getChatWithRightType(type);
  const chatSelected = getChatSelectedWithRightType(type);

  return (
    <div
      className={cn(
        'hidden w-full max-w-full flex-col overflow-auto border border-fond-gray lg:flex lg:max-h-[calc(100vh_-_330px)] lg:max-w-[342px] lg:rounded-l-lg lg:border-[1px]',
        className,
        { 'lg:max-h-[calc(100vh_-_330px)]': type === 'forum' },
        { 'flex rounded-none border-[0px]': !isDektop && !chatSelected }
      )}
    >
      {chats.length === 0 && (
        <p className="p-spaceMedium text-center text-light-gray-third">
          Aucun message
        </p>
      )}
      {chats.map((chat, index) => {
        const isReadByMe =
          chat.messages[chat.messages.length - 1]?.read_by.includes(
            user?.id ?? ''
          ) ||
          chat.messages[chat.messages.length - 1]?.send_by === user?.id ||
          !chat.messages.length;

        if (chat.messages.length === 0) {
          return;
        }
        return (
          <TabChat
            key={chat.id}
            index={index}
            isReadByMe={isReadByMe}
            chat={chat}
            chatSelected={chatSelected}
            setChatSelected={setCurrentChatSelected}
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
  setChatSelected,
  disabled = false,
}: {
  chat?: DBChat;
  index: number;
  chatSelected: DBChat | null;
  disabled: boolean;
  isReadByMe: boolean;
  setChatSelected: (chat: DBChat | null) => void;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteChat } = useChat();

  const { title, is_done } = chat ?? {};
  const { created_at: sent_at, read_by } = chat?.messages[0] ?? {};

  const handleChangeTab = () => {
    if (!chat) return;
    setChatSelected(chat);
    handleReadNewMessage({ chat_id: chat.id, read_by: read_by ?? [] });
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!chat) return;
    setIsDeleting(true);
    await deleteChat(chat.id);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <button
        disabled={disabled}
        className={cn(
          'group relative flex items-center gap-x-spaceMedium border-y-[1px] border-fond-gray px-spaceMedium py-spaceContainer text-left lg:border-t-0',
          {
            'lg:bg-chat-selected':
              chatSelected == null
                ? index === 0
                : chatSelected?.id === chat?.id,
          },
          { 'bg-chat-selected': chatSelected?.id === chat?.id }
        )}
        onClick={handleChangeTab}
      >
        <div>
          <div
            className={cn(
              'z-20 flex h-3 w-3 animate-pulse items-center justify-center rounded-full border-2 border-transparent bg-[#FFA800] font-bold text-white group-hover:scale-110',
              {
                'animate-none bg-primary': isReadByMe || isReadByMe == null,
              }
            )}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="text-xs font-[400] text-light-gray-third">
              Reçu{' '}
              {getTimeFromNow(
                sent_at ?? new Date().toISOString()
              ).toLowerCase()}
            </p>
            {is_done && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Traité
              </span>
            )}
          </div>
          <p className="max-w-[200px] truncate font-[700]">{title}</p>
        </div>

        <Button
          onClick={handleDeleteClick}
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 size-6 rounded-full p-0.5 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
        >
          <X className="size-4 text-gray-400" />
        </Button>
      </button>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer la conversation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement cette
              conversation : "{title}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex w-full items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="mr-2 size-4 animate-spin">◌</span>
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
