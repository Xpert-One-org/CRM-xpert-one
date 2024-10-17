import useChat from '@/store/chat/chat';
import type { Json } from '@/types/supabase';
import type { Reaction } from '@/types/types';
import { insertReaction } from '@functions/chat';
import { useState } from 'react';
import { toast } from 'sonner';

export const useReaction = ({
  reaction_db,
  user_id,
  message_id,
}: {
  reaction_db: Json[] | null;
  user_id: string;
  message_id: number;
}) => {
  const [isRateLimited, setIsRateLimited] = useState(false);

  const [reaction, setReaction] = useState<Reaction[]>(
    reaction_db as Reaction[]
  );
  const { setAnsweringMsg } = useChat();
  const [open, setOpen] = useState(false);

  const addReaction = (emoji: any) => {
    if (isRateLimited) {
      toast.warning('Attendez un peu avant de réagir à nouveau');
      return;
    } else {
      setIsRateLimited(true);
      setTimeout(() => setIsRateLimited(false), 1000);
    }

    // IF NO REACTION
    if (!reaction) {
      setReaction([{ emoji: emoji.native, count: 1, user_id: [user_id] }]);
      setOpen(false);
      return;
    }

    // IF REACTION EXISTS AND USER REACTED
    if (
      reaction.find(
        (r) => r.emoji === emoji.native && r.user_id.includes(user_id)
      )
    ) {
      const newReactionsArray = reaction.map((r) =>
        r.emoji === emoji.native
          ? {
              ...r,
              count: r.count - 1,
              user_id: r.user_id.filter((u) => u !== user_id),
            }
          : r
      );
      setReaction(newReactionsArray.filter((r) => r.count > 0));
      setOpen(false);
      return;
    }

    // IF REACTION EXISTS AND USER DIDN'T REACTED
    if (reaction.find((r) => r.emoji === emoji.native)) {
      setReaction(
        reaction.map((r) =>
          r.emoji === emoji.native
            ? { ...r, count: r.count + 1, user_id: [...r.user_id, user_id] }
            : r
        )
      );
      setOpen(false);

      return;
    }

    setReaction((prev) => [
      ...prev,
      { emoji: emoji.native, count: 1, user_id: [user_id] },
    ]);
    setOpen(false);
  };

  const postReaction = async (reaction: Reaction[]) => {
    if (!reaction) return;
    const { error } = await insertReaction({
      reaction,
      message_id: message_id,
    });
    if (error) {
      toast.error("Erreur lors de l'envoi de la réaction");
    }
  };

  return {
    addReaction,
    postReaction,
    isRateLimited,
    reaction,
    setReaction,
    setAnsweringMsg,
    setOpen,
    open,
  };
};
