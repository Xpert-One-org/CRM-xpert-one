import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import useChat from './chat';
import type { DBChat, DBMessage } from '@/types/typesDb';
import { getUniqueMsgChat, selectBaseMsg } from '@functions/chat';
import { getUserChatProfile } from '@functions/profile';
import { useReaction } from '@/hooks/useReaction';

export const useRealtimeChat = ({
  type,
  user_id,
}: {
  type: string;
  user_id: string;
}) => {
  const supabase = createSupabaseFrontendClient();
  const {
    chatSelected,
    setMessages,
    updateMessageRead,
    fetchChats,
    setChatSelected,
    chats,
    setChats,
  } = useChat();

  const chatFilter = (() => {
    switch (type) {
      case 'echo_community':
        return `type=eq.${type}`;
      case 'chat':
        // created_by or receiver_id =
        return `type=eq.${type}`;
      case 'xpert_to_xpert':
        return `created_by=eq.${user_id}`;
      default:
        return `created_by=eq.${user_id}`;
    }
  })();
  const msgFilter = `chat_id=in.(${chats.map((chat) => chat.id).join(',')})`;

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat',
          filter: chatFilter,
        },
        async (payload: RealtimePostgresChangesPayload<DBChat>) => {
          if (payload.eventType === 'INSERT') {
            const { data, error } = await getUniqueMsgChat(payload.new.id);
            if (error) {
              console.error('Error fetching unique message:', error);
              return;
            }
            if (!data) {
              console.error('No data found for unique message');
              return;
            }
            const newChats = [{ ...payload.new, messages: data }, ...chats];

            setChats(newChats);
            if (!chatSelected) setChatSelected(newChats[0]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message',
          filter: msgFilter,
        },
        async (payload: RealtimePostgresChangesPayload<DBMessage>) => {
          const userId = (payload.new as DBMessage).send_by;

          // GET PROFILE ASSOCIATED WITH MESSAGE
          const { data: userProfile } = await getUserChatProfile(userId);

          if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((message) => message.id !== payload.old.id)
            );
          }
          if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((message) => {
                return message.id === payload.new.id
                  ? { ...message, reactions: payload.new.reactions }
                  : message;
              })
            );
          }
          if (payload.eventType === 'INSERT') {
            const getBaseMsg = async (msg: DBMessage) => {
              // IF MESSAGE IS A REPLY, SELECT BASE MESSAGE
              if (msg.answer_to) {
                const { data, error } = await selectBaseMsg(msg.answer_to);
                if (error) {
                  console.error('Error fetching base message:', error);
                  return;
                }
                if (!data) {
                  console.error('No data found for base message');
                  return;
                }
                return data;
              }
              return null;
            };

            const base_msg = await getBaseMsg(payload.new);

            // CREATE OBJECT WITH MESSAGE, USER PROFILE AND BASE MESSAGE
            const newMessageWithUser = {
              ...payload.new,
              base_msg: base_msg,
              user: userProfile,
            };

            // SET CHATS WITH NEW MESSAGE
            const getChatWithNewMsg = () => {
              if (chats.length === 0) return [];
              const updatedChats = chats.map((chat) => {
                if (chat.id === newMessageWithUser.chat_id) {
                  return {
                    ...chat,
                    messages: [newMessageWithUser],
                  };
                }
                return chat;
              });
              return updatedChats.sort((a, b) => {
                const aLastMessage =
                  a.messages[a.messages.length - 1]?.created_at || a.created_at;
                const bLastMessage =
                  b.messages[b.messages.length - 1]?.created_at || b.created_at;
                return (
                  new Date(bLastMessage).getTime() -
                  new Date(aLastMessage).getTime()
                );
              });
            };
            const updatedChats = getChatWithNewMsg();
            setChats(updatedChats);

            // IF NEW MESSAGE IS NOT SENT BY ME AND THE CHAT IS SELECTED
            if (
              payload.new.send_by !== user_id &&
              chatSelected?.id === payload.new.chat_id
            ) {
              // READ NEW MESSAGE
              updateMessageRead({
                chat_id: payload.new.chat_id,
                read_by: payload.new.read_by,
              });

              const msgToSet = {
                ...newMessageWithUser,
                read: true,
              };
              setMessages((prev) => [...prev, msgToSet]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, chatSelected?.id]);

  return { chats, setChats };
};
