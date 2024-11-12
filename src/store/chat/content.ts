import type { RefObject} from 'react';
import { useEffect, useRef, useState } from 'react';
import { DESKTOP, msgPerPage } from '@/data/constant';
import { toast } from 'sonner';
import type { ChatType, DBMessage } from '@/types/typesDb';
import { useMediaQuery } from '@/hooks/use-media-query';
import { getMessages } from '@functions/chat';
import useChat from './chat';

export const useChatContent = ({
  type,
  scrollRef,
}: {
  type: ChatType;
  scrollRef: RefObject<HTMLDivElement | null>;
}) => {
  const isDesktop = useMediaQuery(DESKTOP);
  const {
    getChatSelectedWithRightType,
    setIsLoading,
    setMessages,
    setEchoMessages,
    setXpertMessages,
    setForumMessages,
    setIsFileLoading,
    getMessagesRightType,
  } = useChat();
  const [totalMessages, setTotalMessages] = useState<number | null>(null);
  const isInitialLoad = useRef(true);
  const [isMoreDataLoading, setIsMoreDataLoading] = useState(false);

  const messages = getMessagesRightType(type);
  const chatSelected = getChatSelectedWithRightType(type);

  const setCurrentMessages = (
    type: string,
    messagesOrUpdater:
      | DBMessage[]
      | ((prevMessages: DBMessage[]) => DBMessage[])
  ): void => {
    switch (type) {
      case 'echo_community':
        setEchoMessages(messagesOrUpdater);
        break;
      case 'chat':
        setMessages(messagesOrUpdater);
        break;
      case 'xpert_to_xpert':
        setXpertMessages(messagesOrUpdater);
        break;
      case 'forum':
        setForumMessages(messagesOrUpdater);
        break;
      default:
        setMessages(messagesOrUpdater);
        break;
    }
  };

  const fetchMessages = async () => {
    !isDesktop && !chatSelected && setIsLoading(false);
    if (!chatSelected) return;
    if (chatSelected.type != type) {
      setIsLoading(false);
      setIsFileLoading(false);
      return;
    }
    setIsLoading(true);
    const { data, error, count } = await getMessages({
      chat_id: chatSelected.id,
    });
    setTotalMessages(count);
    if (error) {
      console.error(error);
      toast.error('Erreur lors de la récupération des messages');
      setIsLoading(false);
      setIsFileLoading(false);
      return;
    }
    isInitialLoad.current = true;
    setIsLoading(false);
    setIsFileLoading(false);
    data && setCurrentMessages(type, data);
  };

  const fetchMoreMessages = async () => {
    if (!chatSelected) return;
    setIsMoreDataLoading(true);
    const currentScrollHeight = scrollRef.current?.scrollHeight ?? 0;
    const { data, error } = await getMessages({
      chat_id: chatSelected.id,
      from: messages.length,
      to: messages.length + msgPerPage - 1,
    });

    if (error) {
      console.error(error);
      toast.error('Erreur lors de la récupération des messages');
      setIsMoreDataLoading(false);
      return;
    }
    if (data) {
      setIsMoreDataLoading(false);

      setCurrentMessages(type, (prev) => [...data, ...prev]);
      setTimeout(() => {
        const newScrollHeight = scrollRef.current?.scrollHeight ?? 0;
        scrollRef.current?.scrollTo(0, newScrollHeight - currentScrollHeight);
      }, 1);
    }
    isInitialLoad.current = true;
  };

  useEffect(() => {
    setTotalMessages(null);
    fetchMessages();
  }, [chatSelected?.id]);

  // SCROLL TO BOTTOM WHEN NEW
  useEffect(() => {
    if (isInitialLoad.current) {
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  // LOAD MORE DATA SCROLL POSITION
  useEffect(() => {
    if (totalMessages && messages.length >= totalMessages) return;
    const handleScroll = () => {
      if (!scrollRef.current) return;

      // Check if the user is at the top of the scroll container
      if (scrollRef.current.scrollTop === 0) {
        fetchMoreMessages();
      }
    };

    const currentRef = scrollRef.current;
    currentRef?.addEventListener('scroll', handleScroll);

    return () => {
      currentRef?.removeEventListener('scroll', handleScroll);
    };
  }, [messages, chatSelected]);

  return { isMoreDataLoading, fetchMessages };
};
