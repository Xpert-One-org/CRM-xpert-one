import type { DBChat, DBMessage } from '@/types/typesDb';
import {
  addFileToMessage,
  getUserChats,
  handleReadNewMessage,
  postChat,
  uploadFileChat,
} from '@functions/chat';
import { SetStateAction } from 'react';
import { toast } from 'sonner';
import { create } from 'zustand';
import useUser from '../useUser';

type ChatState = {
  inputScrollHeight: string;
  setInputScrollHeight: (height: string) => void;
  chats: DBChat[];
  popupOpen: boolean;
  setPopupOpen: (popupOpen: boolean) => void;
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
  insertChat: ({
    chat,
    message,
    receiver_id,
    file,
  }: {
    chat: DBChat;
    message: DBMessage;
    receiver_id: string;
    file?: File | null;
  }) => void;
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
  popupOpen: false,
  setPopupOpen: (popupOpen) => set({ popupOpen: popupOpen }),
  setAnsweringMsg: (answeringMsg) => set({ answeringMsg: answeringMsg }),
  messages: [],
  insertChat: async ({ chat, message, receiver_id, file }) => {
    set({ isLoading: true });
    if (!chat || !message || !receiver_id) {
      set({ errorMsg: 'Missing chat, message or receiver_id' });
      return;
    }
    const { data, error, messageData } = await postChat({
      chat,
      message,
      receiver_id,
    });
    if (error) {
      set({ errorMsg: error, isLoading: false });
      return;
    }
    if (data && data.id) {
      // if (file) {
      //     const filePath = `${chat.type}/${data.id}/${file.type}_${new Date().getTime()}`;
      //     const reader = new FileReader();
      //     reader.readAsDataURL(file);
      //     reader.onload = async () => {
      //       const base64 = reader.result as string;
      //       const {data: fileUploaded, error} = await uploadFileChat({file: base64, filePath});
      //       if (error) {
      //         console.error(`Failed to upload file: ${file.name}`, error);
      //         return;
      //       }
      //       if (fileUploaded) {
      //         const dataFileMsg = {
      //           name: file.name,
      //           type: file.type,
      //           url: filePath,
      //         }
      //         await addFileToMessage({
      //           message_id: messageData.id,
      //           files: [dataFileMsg],
      //         });
      //       }
      //     }
      // }
      toast.success('Message envoyé avec succès');

      useUser.getState().clearSearchUserSelected();
      set({ isLoading: false, popupOpen: false });
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
