import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import useChat from './chat';
import type { DBChat, DBMessage } from '@/types/typesDb';

export const useRealtimeChat = ({
  type,
  user_id,
}: {
  type: string;
  user_id: string;
}) => {
  const supabase = createSupabaseFrontendClient();
  const {
    setChatSelected,
    chatSelected,
    setMessages,
    updateMessageRead,
    fetchChats,
    chats,
    setChats,
  } = useChat();

  const chatFilter = (() => {
    switch (type) {
      case 'echo_community':
        return `type=eq.${type}`;
      case 'chat':
        return `created_by=eq.${user_id}`;
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
    const xpert_channel = supabase
      .channel('chat_xpert_to_xpert')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat',
          filter: `xpert_recipient_id=eq.${user_id}`,
        },
        (payload: RealtimePostgresChangesPayload<DBChat>) => {
          if (payload.eventType === 'DELETE') {
            const chatWithoutOld = chats.filter(
              (chat) => chat.id != payload.old.id
            );
            setChats(chatWithoutOld);
          }
          if (payload.eventType === 'INSERT') {
            const getNewChat = () => {
              if (chats.length === 0) return [payload.new];
              const sortedChats = [...chats, payload.new].sort((a, b) => {
                const aLastMessage =
                  a.messages[a.messages.length - 1]?.created_at || a.created_at;
                const bLastMessage =
                  b.messages[b.messages.length - 1]?.created_at || b.created_at;
                return (
                  new Date(bLastMessage).getTime() -
                  new Date(aLastMessage).getTime()
                );
              });
              return sortedChats;
            };
            const newChats = getNewChat();
            setChats(newChats);
            setChatSelected(payload.new);
          }
          if (payload.eventType === 'UPDATE') {
            const updatedChats = chats.map((chat) =>
              chat.id === payload.new.id ? payload.new : chat
            );
            setChats(updatedChats);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(xpert_channel);
    };
  }, [supabase, chatSelected?.id]);

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
        (payload: RealtimePostgresChangesPayload<DBChat>) => {
          if (payload.eventType === 'DELETE') {
            const chatWithoutOld = chats.filter(
              (chat) => chat.id != payload.old.id
            );
            setChats(chatWithoutOld);
          }
          if (payload.eventType === 'INSERT') {
            // setChats((prev) => [...(prev || []), payload.new] as DBChat[])
            const getNewChat = () => {
              if (chats.length === 0) return [payload.new];
              const sortedChats = [...chats, payload.new].sort((a, b) => {
                const aLastMessage =
                  a.messages[a.messages.length - 1]?.created_at || a.created_at;
                const bLastMessage =
                  b.messages[b.messages.length - 1]?.created_at || b.created_at;
                return (
                  new Date(bLastMessage).getTime() -
                  new Date(aLastMessage).getTime()
                );
              });
              return sortedChats;
            };
            const newChats = getNewChat();
            setChats(newChats);
            setChatSelected(payload.new);
          }
          if (payload.eventType === 'UPDATE') {
            const updatedChats = chats.map((chat) =>
              chat.id === payload.new.id ? payload.new : chat
            );
            setChats(updatedChats);
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
          let userProfile;

          if (userId) {
            const { data, error } = await supabase
              .from('profile')
              .select(
                'firstname, lastname, avatar_url, role, company_name, generated_id, username'
              )
              .eq('id', userId)
              .single();

            if (error) {
              console.error('Error fetching user profile:', error);
            } else {
              userProfile = data;
            }
          }

          if (payload.eventType === 'DELETE') {
            setMessages((prev) =>
              prev.filter((message) => message.id !== payload.old.id)
            );
          }
          if (payload.eventType === 'INSERT') {
            const newMessageWithUser = {
              ...payload.new,
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

              setMessages((prev) => [
                ...prev,
                { ...newMessageWithUser, read: true },
              ]);
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
