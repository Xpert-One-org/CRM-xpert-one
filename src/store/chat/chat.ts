import type { DBChat, DBMessage } from '@/types/typesDb';
import { getUserChats, handleReadNewMessage, postChat } from '@functions/chat';
import { SetStateAction } from 'react';
import { create } from 'zustand';

type ChatState = {
  inputScrollHeight: string;
  setInputScrollHeight: (height: string) => void;
  chats: DBChat[];
  setChats: (chats: DBChat[]) => void;
  chatSelected: DBChat | null;
  fetchChats: () => void;
  setChatSelected: (chat: DBChat | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isFileLoading: boolean;
  sortDataByLatestMessage: (chats: DBChat[]) => DBChat[];
  setIsFileLoading: (isFileLoading: boolean) => void;
  answeringMsg: DBMessage | null;
  setAnsweringMsg: (isAnsweringMsg: DBMessage | null) => void;
  insertChat: (chat: DBChat, message: DBMessage, receiver_id: string) => void;
  updateMessageRead: ({
    chat_id,
    read_by,
  }: {
    chat_id: number;
    read_by: string[];
  }) => void;
  errorMsg: string | null;
  messages: DBMessage[];

  setMessages: (
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ) => void;
  reset: () => void;
};

const useChat = create<ChatState>((set) => ({
  inputScrollHeight: '58px',
  setInputScrollHeight: (height) => set({ inputScrollHeight: height }),
  chats: [],
  setChats: (chats) => set({ chats }),
  chatSelected: null,
  setChatSelected: (chat) => set({ chatSelected: chat }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  isFileLoading: true,
  setIsFileLoading: (isFileLoading) => set({ isFileLoading: isFileLoading }),
  answeringMsg: null,
  setAnsweringMsg: (answeringMsg) => set({ answeringMsg: answeringMsg }),
  messages: [],
  insertChat: async (chat, message, receiver_id) => {
    const { data, error } = await postChat({ chat, message, receiver_id });
    if (error) {
      set({ errorMsg: error });
    }
  },

  fetchChats: async () => {
    set({ isLoading: true });
    const { data, error } = await getUserChats();
    if (error) {
      set({ errorMsg: error });
    }
    if (data) {
      set({ chats: data });
    }
    set({ isLoading: false });
  },
  updateMessageRead: async ({ chat_id, read_by }) => {
    const { error } = await handleReadNewMessage({ chat_id, read_by });
    if (error) {
      set({ errorMsg: error });
    }
  },

  sortDataByLatestMessage: (chats: DBChat[]) => {
    return chats.sort((a, b) => {
      const aLastMessage =
        a.messages[a.messages.length - 1]?.created_at || a.created_at;
      const bLastMessage =
        b.messages[b.messages.length - 1]?.created_at || b.created_at;
      return (
        new Date(bLastMessage).getTime() - new Date(aLastMessage).getTime()
      );
    });
  },

  errorMsg: null,
  setMessages: (messagesOrUpdater) =>
    set((state) => ({
      messages:
        typeof messagesOrUpdater === 'function'
          ? messagesOrUpdater(state.messages)
          : messagesOrUpdater,
    })),
  reset: () =>
    set({
      inputScrollHeight: '58px',
      chats: [],
      chatSelected: null,
      isLoading: true,
      messages: [],
    }),
}));

export default useChat;
