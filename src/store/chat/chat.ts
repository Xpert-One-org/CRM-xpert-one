import type { ChatType, DBChat, DBMessage } from '@/types/typesDb';
import {
  deleteChat,
  getNotReadChatsCount,
  getUserChats,
  handleReadNewMessage,
  postChat,
} from '@functions/chat';
import { toast } from 'sonner';
import { create } from 'zustand';
import useUser from '../useUser';

type ChatState = {
  inputScrollHeight: string;
  setInputScrollHeight: (height: string) => void;
  chats: DBChat[];
  echoChats: DBChat[];
  forumChats: DBChat[];
  xpertChats: DBChat[];
  popupOpen: boolean;
  setPopupOpen: (popupOpen: boolean) => void;
  setEchoChats: (chats: DBChat[]) => void;
  setForumChats: (chats: DBChat[]) => void;
  setXpertChats: (chats: DBChat[]) => void;
  getChatWithRightType: (type: ChatType) => DBChat[];
  getChatSelectedWithRightType: (type: ChatType) => DBChat | null;
  getMessagesRightType: (type: ChatType) => DBMessage[];
  setChats: (chats: DBChat[]) => void;
  chatSelected: DBChat | null;
  chatXpertSelected: DBChat | null;
  chatForumSelected: DBChat | null;
  chatEchoSelected: DBChat | null;
  fetchChats: (type: ChatType) => void;
  deleteChat: (chatId: number) => Promise<void>;
  setChatSelected: (chat: DBChat | null) => void;
  setCurrentChatSelected: (chat: DBChat | null) => void;
  fetchNotReadChats: () => void;
  notReadChatsCount: number;
  fetchNotReadChatsForum: () => void;
  notReadChatsCountForum: number;
  setNotReadChatsCountForum: (count: number) => void;
  fetchNotReadChatsEcho: () => void;
  notReadChatsCountEcho: number;
  setNotReadChatsCountEcho: (count: number) => void;
  setNotReadChatsCount: (count: number) => void;
  setCurrentMessages: (
    type: string,
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ) => void;
  setCurrentChat: (chats: DBChat[]) => void;
  setChatXpertSelected: (chat: DBChat | null) => void;
  setChatForumSelected: (chat: DBChat | null) => void;
  setChatEchoSelected: (chat: DBChat | null) => void;
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
    receiver_id?: string;
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
  forumMessages: DBMessage[];
  echoMessages: DBMessage[];
  xpertMessages: DBMessage[];
  setMessages: (
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ) => void;
  setEchoMessages: (
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ) => void;

  setForumMessages: (
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ) => void;

  setXpertMessages: (
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ) => void;
  reset: () => void;
};

const useChat = create<ChatState>((set, get) => ({
  inputScrollHeight: '58px',
  setInputScrollHeight: (height) => set({ inputScrollHeight: height }),
  chats: [],
  echoChats: [],
  forumChats: [],

  xpertChats: [],
  setCurrentChat: (chats: DBChat[]) => {
    switch (chats[0].type) {
      case 'echo_community':
        get().setEchoChats(chats);
        break;
      case 'chat':
        get().setChats(chats);
        break;
      case 'xpert_to_xpert':
        get().setXpertChats(chats);
        break;
      case 'forum':
        get().setForumChats(chats);
        break;
      default:
        get().setChats(chats);
        break;
    }
  },
  deleteChat: async (chatId: number) => {
    const { error } = await deleteChat(chatId);

    if (error) {
      toast.error('Erreur lors de la suppression du chat');
      return;
    }

    // Mise à jour du state selon le type de chat
    const chatToDelete = [
      ...get().chats,
      ...get().echoChats,
      ...get().forumChats,
      ...get().xpertChats,
    ].find((chat) => chat.id === chatId);

    if (!chatToDelete) return;

    switch (chatToDelete.type) {
      case 'chat':
        set({ chats: get().chats.filter((chat) => chat.id !== chatId) });
        if (get().chatSelected?.id === chatId) {
          set({ chatSelected: null });
        }
        break;
      case 'echo_community':
        set({
          echoChats: get().echoChats.filter((chat) => chat.id !== chatId),
        });
        if (get().chatEchoSelected?.id === chatId) {
          set({ chatEchoSelected: null });
        }
        break;
      case 'forum':
        set({
          forumChats: get().forumChats.filter((chat) => chat.id !== chatId),
        });
        if (get().chatForumSelected?.id === chatId) {
          set({ chatForumSelected: null });
        }
        break;
      case 'xpert_to_xpert':
        set({
          xpertChats: get().xpertChats.filter((chat) => chat.id !== chatId),
        });
        if (get().chatXpertSelected?.id === chatId) {
          set({ chatXpertSelected: null });
        }
        break;
    }

    toast.success('Chat supprimé avec succès');
  },
  setCurrentMessages: (
    type: string,
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ): void => {
    switch (type) {
      case 'echo_community':
        get().setEchoMessages(messagesOrUpdater);
        break;
      case 'chat':
        get().setMessages(messagesOrUpdater);
        break;
      case 'xpert_to_xpert':
        get().setXpertMessages(messagesOrUpdater);
        break;
      case 'forum':
        get().setForumMessages(messagesOrUpdater);
        break;
      default:
        get().setMessages(messagesOrUpdater);
        break;
    }
  },
  setCurrentChatSelected: (chat: DBChat | null) => {
    switch (chat?.type) {
      case 'echo_community':
        get().setChatEchoSelected(chat);
        break;
      case 'xpert_to_xpert':
        get().setChatXpertSelected(chat);
        break;
      case 'forum':
        get().setChatForumSelected(chat);
        break;
      default:
        get().setChatSelected(chat);
        break;
    }
  },
  setChats: (chats) => set({ chats }),
  setEchoChats: (chats) => set({ echoChats: chats }),
  setForumChats: (chats) => set({ forumChats: chats }),
  setXpertChats: (chats) => set({ xpertChats: chats }),
  chatSelected: null,
  chatXpertSelected: null,
  chatForumSelected: null,
  chatEchoSelected: null,
  setChatXpertSelected: (chat) => set({ chatXpertSelected: chat }),
  setChatForumSelected: (chat) => set({ chatForumSelected: chat }),
  setChatEchoSelected: (chat) => set({ chatEchoSelected: chat }),
  setChatSelected: (chat) => set({ chatSelected: chat }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  isFileLoading: true,
  setIsFileLoading: (isFileLoading) => set({ isFileLoading: isFileLoading }),
  answeringMsg: null,
  popupOpen: false,
  notReadChatsCount: 0,
  notReadChatsCountForum: 0,
  notReadChatsCountEcho: 0,
  setNotReadChatsCount: (count) => set({ notReadChatsCount: count }),
  setNotReadChatsCountForum: (count) => set({ notReadChatsCountForum: count }),
  setNotReadChatsCountEcho: (count) => set({ notReadChatsCountEcho: count }),
  setPopupOpen: (popupOpen) => set({ popupOpen: popupOpen }),
  setAnsweringMsg: (answeringMsg) => set({ answeringMsg: answeringMsg }),
  messages: [],
  forumMessages: [],
  echoMessages: [],
  xpertMessages: [],
  insertChat: async ({ chat, message, receiver_id, file }) => {
    set({ isLoading: true });
    if (!chat || !message) {
      set({ errorMsg: 'Missing chat, message or receiver_id' });
      return;
    }
    const { data, error, messageData } = await postChat({
      chat,
      message,
      receiver_id,
    });
    if (error) {
      console.error(error);
      set({ errorMsg: error, isLoading: false });
      return;
    }
    if (data && data.id) {
      const type = chat.type;
      const { data, error } = await getUserChats(type);
      if (error) {
        set({ errorMsg: error });
        return;
      }
      if (!data) {
        set({ errorMsg: 'No data found' });
        return;
      }
      switch (type) {
        case 'chat':
          set({ chats: data });
          break;
        case 'echo_community':
          set({ echoChats: data });
          break;
        case 'forum':
          set({ forumChats: data });
          break;
        case 'xpert_to_xpert':
          set({ xpertChats: data });
          break;
        default:
      }
      toast.success('Message envoyé avec succès');

      set({ isLoading: false, popupOpen: false });
    }
  },

  fetchNotReadChats: async () => {
    const { error, count } = await getNotReadChatsCount({ type: 'chat' });
    if (error) {
      console.log('error', error);
      set({ errorMsg: error });
    }
    console.log('count', count);

    set({ notReadChatsCount: count ?? 0 });
  },

  fetchNotReadChatsForum: async () => {
    const { error, count } = await getNotReadChatsCount({ type: 'forum' });
    if (error) {
      console.log('error', error);
      set({ errorMsg: error });
    }
    set({ notReadChatsCountForum: count ?? 0 });
  },

  fetchNotReadChatsEcho: async () => {
    const { error, count } = await getNotReadChatsCount({
      type: 'echo_community',
    });
    if (error) {
      console.log('error', error);
      set({ errorMsg: error });
    }
    set({ notReadChatsCountEcho: count ?? 0 });
  },

  fetchChats: async (type) => {
    set({ isLoading: true });
    const { data, error } = await getUserChats(type);
    if (error) {
      set({ errorMsg: error });
    }
    if (data) {
      switch (type) {
        case 'chat':
          set({ chats: data });
          break;
        case 'echo_community':
          set({ echoChats: data });
          break;
        case 'forum':
          set({ forumChats: data });
          break;
        case 'xpert_to_xpert':
          set({ xpertChats: data });
          break;
        default:
      }
    }
    set({ isLoading: false });
  },
  getMessagesRightType: (type: ChatType) => {
    switch (type) {
      case 'echo_community':
        return get().echoMessages;
      case 'chat':
        return get().messages;
      case 'xpert_to_xpert':
        return get().xpertMessages;
      case 'forum':
        return get().forumMessages;
      default:
        return get().messages;
    }
  },
  getChatSelectedWithRightType: (type: ChatType) => {
    switch (type) {
      case 'echo_community':
        return get().chatEchoSelected;
      case 'chat':
        return get().chatSelected;
      case 'xpert_to_xpert':
        return get().chatXpertSelected;
      case 'forum':
        return get().chatForumSelected;
      default:
        return get().chatSelected;
    }
  },
  getChatWithRightType: (type: ChatType) => {
    switch (type) {
      case 'echo_community':
        return get().echoChats;
      case 'chat':
        return get().chats;
      case 'xpert_to_xpert':
        return get().xpertChats;
      case 'forum':
        return get().forumChats;
      default:
        return get().chats;
    }
  },

  updateMessageRead: async ({ chat_id, read_by }) => {
    const { error } = await handleReadNewMessage({ chat_id, read_by });

    if (error) {
      set({ errorMsg: error });
    }
    get().fetchNotReadChats();
    get().fetchNotReadChatsForum();
    get().fetchNotReadChatsEcho();
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
  setEchoMessages: (messagesOrUpdater) =>
    set((state) => ({
      echoMessages:
        typeof messagesOrUpdater === 'function'
          ? messagesOrUpdater(state.echoMessages)
          : messagesOrUpdater,
    })),
  setForumMessages: (messagesOrUpdater) =>
    set((state) => ({
      forumMessages:
        typeof messagesOrUpdater === 'function'
          ? messagesOrUpdater(state.forumMessages)
          : messagesOrUpdater,
    })),
  setXpertMessages: (messagesOrUpdater) =>
    set((state) => ({
      xpertMessages:
        typeof messagesOrUpdater === 'function'
          ? messagesOrUpdater(state.xpertMessages)
          : messagesOrUpdater,
    })),
  reset: () =>
    set({
      inputScrollHeight: '58px',
      chats: [],
      echoChats: [],
      forumChats: [],
      xpertChats: [],
      popupOpen: false,
      errorMsg: null,
      chatEchoSelected: null,
      chatForumSelected: null,
      chatXpertSelected: null,
      chatSelected: null,
      isLoading: true,
      messages: [],
    }),
}));

export default useChat;
