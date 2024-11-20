'use client';
import React, { useEffect, useState } from 'react';
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
} from '@/components/ui/credenza';
import Image from 'next/image';

import { topicEchoSelect, topicSelect } from '@/data/mocked_select';
import { toast } from 'sonner';
import { DESKTOP } from '@/data/constant';
import { cn } from '@/lib/utils';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

import Input from '@/components/inputs/Input';
import { Button } from '@/components/ui/button';
import TextArea from '@/components/inputs/TextArea';
import SelectComponent from '@/components/inputs/SelectComponent';
import FileInput from '@/components/inputs/FileInput';
import type { ChatType, DBChat, DBMessage } from '@/types/typesDb';
import { useSelect } from '@/store/select';
import useChat from '@/store/chat/chat';
import { useMediaQuery } from '@/hooks/use-media-query';
import { addFileToMessage, postChat } from '@functions/chat';
import Combobox from '@/components/inputs/Combobox';
import ComboboxChat from './ComboboxChat';
import { Label } from '@/components/ui/label';
import useUser from '@/store/useUser';

export default function PopupNewChat({
  text = 'Nouveau message',
  type = 'chat',
}: {
  type?: ChatType;
  text?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP);
  const [file, setFile] = useState<File | null>(null);
  const [newMsg, setNewMsg] = useState<DBMessage>({
    content: '',
    chat_id: null,
    created_at: '',
    send_by: '',
    reactions: [],
    read_by: [],
    files: [],
    id: 0,
    answer_to: null,
    is_pinned: false,
  });
  const [newChat, setNewChat] = useState<DBChat>({
    title: '',
    updated_at: '',
    topic: '',
    mission_id: null,
    created_at: '',
    created_by: '',
    id: 0,
    messages: [],
    mission: null,
    category: null,
    receiver_id: null,
    type: type,
  });

  const { subjects, fetchSubjects } = useSelect();

  const { chatSelected, insertChat, popupOpen, setPopupOpen } = useChat();
  const { searchUserSelected, clearSearchUserSelected } = useUser();
  const supabase = createSupabaseFrontendClient();

  const handleChangeSelect = (value: string, name: string) => {
    setNewChat((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewChat((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = ({
    e,
  }: {
    e: React.ChangeEvent<HTMLInputElement>;
    file_name: string;
  }) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleChangeMsg = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewMsg((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!searchUserSelected && isChat) {
      toast.warning('Veuillez sélectionner un destinataire');
      return;
    }
    insertChat({
      chat: newChat,
      message: newMsg,
      receiver_id:
        isChat && searchUserSelected ? searchUserSelected.id : undefined,
      file,
    });
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const isForum = type === 'forum';
  const isEcho = type === 'echo_community';
  const isChat = type === 'chat';
  const selectContent = isForum ? subjects : topicEchoSelect;

  const selectDefault = isForum ? newChat.category : newChat.topic;
  const selectName = isForum ? 'category' : 'topic';

  const isDisabled =
    !newChat.title ||
    (isForum ? !newChat.category : !newChat.topic) ||
    !newMsg.content ||
    (isChat && !searchUserSelected) ||
    isLoading;

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      <Button
        className={cn(
          'h-auto w-fit px-spaceMedium py-spaceMediumContainer text-white lg:block',
          {
            hidden: !isDesktop && chatSelected,
          }
        )}
        onClick={() => setPopupOpen(true)}
      >
        {text}
      </Button>

      <CredenzaContent className="font-fira mx-4 max-w-[946px] overflow-hidden rounded-sm border-0 bg-white bg-opacity-70 p-0 backdrop-blur-sm">
        <div className="relative h-[175px] w-full">
          <Image
            src="/static/background.jpg"
            fill
            objectFit="cover"
            alt="confirm-popup"
          />
        </div>
        <div className="flex flex-col gap-y-spaceContainer p-6">
          {type === 'chat' && (
            <div className="flex flex-col gap-y-1">
              <Label className="">Destinataire</Label>
              <ComboboxChat />
            </div>
          )}
          <div className="grid grid-cols-1 gap-x-spaceContainer gap-y-spaceSmall md:grid-cols-3">
            <Input
              label="Titre"
              placeholder="Titre de la conversation"
              name={'title'}
              defaultValue={newChat.title ?? ''}
              onChange={handleChange}
            />
            <SelectComponent
              label="Catégorie de discussion"
              placeholder="Sélectionner un catégorie"
              name={selectName}
              options={selectContent}
              defaultSelectedKeys={selectDefault ?? ''}
              onValueChange={handleChangeSelect}
            />

            {/* {type != 'forum' &&
              type != 'echo_community' &&
              newChat.topic == 'mission' && (
                <SelectComponent
                  label="Mission"
                  name={'mission'}
                  placeholder="Sélectionner une mission"
                  options={topicSelect}
                  defaultSelectedKeys={
                    newChat.mission_id ? String(newChat.mission_id) : ''
                  }
                  onValueChange={handleChangeSelect}
                />
              )} */}
            {/* {(type === 'echo_community' || type === 'forum') && (
              <FileInput
                label="Joindre un fichier"
                name={'files'}
                fileName={file?.name ?? ''}
                placeholder="Charger une image pour le topic"
                onChange={(e) => handleFileChange({ e, file_name: 'files' })}
              />
            )} */}
          </div>

          <TextArea
            label="Description"
            placeholder="Description de la conversation"
            name={'content'}
            defaultValue={newMsg.content ?? ''}
            onChange={handleChangeMsg}
          />
          <div className="flex gap-x-spaceSmall self-end">
            <CredenzaClose asChild>
              <Button className="w-fit self-end border border-fond-gray bg-inactive px-spaceContainer text-dark">
                Annuler le message
              </Button>
            </CredenzaClose>

            <Button
              onClick={handleSend}
              className="w-fit self-end px-spaceContainer"
              disabled={isDisabled}
              variant={'secondary'}
            >
              {isLoading ? 'Chargement...' : 'Envoyer'}
            </Button>
          </div>
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
