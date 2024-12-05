'use client';
import Logo from '@/components/svg/Logo';
import ReactionSvg from '@/components/svg/ReactionSvg';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { roleSelect } from '@/data/mocked_select';
import { cn } from '@/lib/utils';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { MessageSquareMore, Pin } from 'lucide-react';
import Image from 'next/image';
import { defaultAvatar } from '@/data/constant';
import type { Reaction } from '@/types/types';
import type { ChatType, DBMessage, DBProfile } from '@/types/typesDb';
import { useReaction } from '@/hooks/useReaction';
import useChat from '@/store/chat/chat';
import File from './File';
import { formatDate } from '@/utils/date';
import { formatHour } from '@/utils/formatDates';
import { getLabel } from '@/utils/getLabel';

type MsgCardProps = {
  message: DBMessage;
  user_id: string;
  type: ChatType;
} & React.HTMLAttributes<HTMLDivElement>;

export const MsgCard = ({ style, message, user_id, type }: MsgCardProps) => {
  const {
    content,
    user,
    reactions: reaction_db,
    created_at,
    base_msg,
    files,
  } = message;
  const { setAnsweringMsg, getChatSelectedWithRightType } = useChat();

  const { addReaction, open, setOpen } = useReaction({
    reaction_db,
    user_id,
    message_id: message.id,
  });

  const chatSelected = getChatSelectedWithRightType(type);

  const isCreatorMsgNotUser =
    chatSelected?.created_by === message.send_by &&
    (chatSelected.type == 'echo_community' || chatSelected.type == 'forum') &&
    message.send_by != user_id;
  const isUserMsg = user_id === message.send_by;
  const isPinMsg = message.is_pinned;

  const isCreatorBaseMsg =
    chatSelected?.created_by === base_msg?.send_by &&
    (chatSelected?.type == 'echo_community' || chatSelected?.type == 'forum') &&
    base_msg?.send_by != user_id;
  const isUserBaseMsg = user_id === base_msg?.send_by;

  return (
    <div
      style={style}
      className={cn(
        'relative flex w-full flex-col gap-y-spaceSmall rounded-[10px] bg-white p-spaceMediumContainer shadow-msg',
        { 'bg-chat-selected': isCreatorMsgNotUser },
        { 'bg-primary text-white': isUserMsg }
      )}
    >
      {isPinMsg && (
        <div className="absolute right-3 top-3 rotate-45">
          <Pin size={18} />
        </div>
      )}
      <Card
        created_at={created_at}
        user_id={user_id}
        send_by={message.send_by}
        user={user}
        type={type}
      />
      {base_msg && (
        <div
          className={cn(
            'relative flex w-full flex-col gap-y-spaceSmall rounded-[10px] border bg-white p-spaceMediumContainer text-dark shadow-msg',
            { 'bg-chat-selected': isCreatorBaseMsg },
            { 'bg-secondary text-white': isUserBaseMsg }
          )}
        >
          <Card
            type={type}
            created_at={base_msg.created_at}
            user_id={user_id}
            send_by={base_msg.send_by}
            user={base_msg.profile}
          />
          <p className="max-w-full overflow-hidden text-ellipsis whitespace-pre-wrap break-words text-xs">
            {base_msg.content}
          </p>
        </div>
      )}

      <p className="max-w-full overflow-hidden text-ellipsis whitespace-pre-wrap break-words text-xs">
        {content}
      </p>
      <div className="flex gap-x-spaceContainer">
        {files?.map((f, i) => <File key={f.name} file={f} />)}
      </div>

      <div className="flex flex-wrap items-center gap-x-spaceSmall gap-y-spaceXSmall">
        <button
          className="flex items-center gap-x-spaceXSmall"
          onClick={() => setAnsweringMsg(message)}
        >
          <MessageSquareMore size={23} className="-mb-px mt-px" />
          <p className="text-sm">Répondre</p>
        </button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="flex items-center gap-x-spaceXSmall text-sm">
            <ReactionSvg
              stroke={user_id === message.send_by ? 'white' : 'black'}
            />{' '}
            Ajouter une réaction
          </PopoverTrigger>
          <PopoverContent className="w-full border-none bg-transparent p-0">
            <Picker
              locale="fr"
              autoFocus
              noCountryFlags
              data={data}
              onEmojiSelect={addReaction}
            />
          </PopoverContent>
        </Popover>

        {(reaction_db as Reaction[] | undefined)?.map((r: any, i: number) => (
          <div key={r?.emoji} className="relative">
            <div className="z-10 flex items-center gap-x-spaceXXSmall">
              <button
                className={cn(
                  'flex h-[27px] w-[27px] items-center justify-center rounded-full transition-all hover:shadow-2xl'
                )}
                onClick={() => addReaction({ native: r.emoji })}
              >
                {r.emoji}
              </button>
              <span>{r.count}</span>
            </div>
          </div>
        ))}
        {/* <div className="h-[27px]" /> */}
      </div>
    </div>
  );
};

const Card = ({
  created_at,
  user_id,
  send_by,
  user,
  type,
}: {
  created_at: string;
  user_id: string;
  send_by: string | null;
  type?: ChatType;
  user?: Pick<
    DBProfile,
    | 'role'
    | 'avatar_url'
    | 'company_name'
    | 'generated_id'
    | 'firstname'
    | 'lastname'
    | 'username'
  > | null;
}) => {
  const {
    firstname,
    lastname,
    company_name,
    generated_id,
    role,
    username,
    avatar_url,
  } = user ?? {};
  const useUsername = username && (type == 'forum' || type == 'echo_community');
  const name = useUsername
    ? username
    : `${firstname ?? ''} ${lastname?.toUpperCase() ?? ''}`;

  return (
    <div className="flex items-center gap-x-spaceMediumContainer">
      {role === 'admin' ? (
        <div className="flex size-[50px] items-center justify-center rounded-full bg-black p-2">
          <Logo className="fill-white transition" />
        </div>
      ) : (
        <div className="border-1 rounded-full border-primary bg-white">
          <Image
            src={avatar_url ?? defaultAvatar}
            alt="avatar"
            width={50}
            height={50}
            className="max-h-[50px] min-h-[50px] min-w-[50px] max-w-[50px] rounded-full object-cover"
          />
        </div>
      )}

      <div className="flex w-full flex-wrap items-center gap-x-spaceMediumContainer">
        {role === 'admin' ? (
          <>
            <p className="font-khand text-lg uppercase">Xpert one</p>
            <p className="mb-[2px]">
              {getLabel({ value: role, select: roleSelect })}
            </p>

            <p
              className={cn('mb-[2px] text-[#868686]', {
                'text-white': user_id === send_by,
              })}
            >
              {formatDate(created_at)}
            </p>
            <p
              className={cn('mb-[2px] text-[#868686]', {
                'text-white': user_id === send_by,
              })}
            >
              {formatHour(created_at)}
            </p>
          </>
        ) : (
          <>
            {generated_id && (
              <p className="font-khand text-lg uppercase">{generated_id}</p>
            )}
            <p className="mb-[2px] font-[400]">
              {name.trim() != '' ? name : 'Utilisateur supprimé'}
            </p>

            {company_name && (
              <p className="mb-[2px] font-[400]">{company_name}</p>
            )}

            <p
              className={cn('mb-[2px] text-[#868686]', {
                'text-white': user_id === send_by,
              })}
            >
              {formatDate(created_at)}
            </p>
            <p
              className={cn('mb-[2px] text-[#868686]', {
                'text-white': user_id === send_by,
              })}
            >
              {formatHour(created_at)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
