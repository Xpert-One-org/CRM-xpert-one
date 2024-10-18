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

  const [reactions, setReactions] = useState<Reaction[]>(
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
    if (!reactions) {
      const newReaction = [
        { emoji: emoji.native, count: 1, user_id: [user_id] },
      ];
      setReactions(newReaction);
      postReaction(newReaction);
      setOpen(false);
      return;
    }

    // IF REACTION EXISTS AND USER REACTED
    if (
      reactions.find(
        (r) => r.emoji === emoji.native && r.user_id.includes(user_id)
      )
    ) {
      const newReactionsArray = reactions.map((r) =>
        r.emoji === emoji.native
          ? {
              ...r,
              count: r.count - 1,
              user_id: r.user_id.filter((u) => u !== user_id),
            }
          : r
      );
      const newReations = newReactionsArray.filter((r) => r.count > 0);
      setReactions(newReactionsArray.filter((r) => r.count > 0));
      postReaction(newReations);
      setOpen(false);
      return;
    }

    // IF REACTION EXISTS AND USER DIDN'T REACTED
    if (reactions.find((r) => r.emoji === emoji.native)) {
      const newReactions = reactions.map((r) =>
        r.emoji === emoji.native
          ? { ...r, count: r.count + 1, user_id: [...r.user_id, user_id] }
          : r
      );
      setReactions(newReactions);
      postReaction(newReactions);
      setOpen(false);

      return;
    }

    setReactions((prev) => [
      ...prev,
      { emoji: emoji.native, count: 1, user_id: [user_id] },
    ]);
    postReaction([
      ...reactions,
      { emoji: emoji.native, count: 1, user_id: [user_id] },
    ]);
    setOpen(false);
  };

  const postReaction = async (reaction: Reaction[]) => {
    console.log('Post reaction', reaction);

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
    reactions,
    setReactions,
    setAnsweringMsg,
    setOpen,
    open,
  };
};
