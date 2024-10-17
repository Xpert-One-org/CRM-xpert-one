'use client';
import SendSvg from '@/components/svg/SendSvg';
import { FileText, Paperclip, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import useChat from '@/store/chat/chat';
import { insertMessage } from '@functions/chat';
import type { DBBaseMsg, DBMessage, DBProfile } from '@/types/typesDb';

export default function InputSend({
  user_id,
  profile,
}: {
  user_id: string;
  profile: Pick<DBProfile, 'role' | 'firstname' | 'lastname'> | null;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const {
    chatSelected,
    setMessages,
    setInputScrollHeight,
    answeringMsg,
    setIsFileLoading,
    setAnsweringMsg,
    messages,
  } = useChat();
  const supabase = createSupabaseFrontendClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const handleSend = async () => {
    const filesToUpload = files;
    setFiles([]);
    setIsFileLoading(true);
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (chatSelected === null) return;
    const msg_answered =
      messages.find((m) => m.id === answeringMsg?.id) ?? null;
    const msg_answered_formated: DBBaseMsg | null = msg_answered && {
      id: msg_answered.id ?? 0,
      content: msg_answered.content,
      created_at: msg_answered.created_at,
      send_by: msg_answered.send_by,
      profile: msg_answered.user,
    };

    const message: DBMessage = {
      content: textarea.value,
      created_at: new Date().toISOString(),
      id: 0,
      files: files.map((f) => {
        return {
          name: f.name,
          type: f.type,
          url: URL.createObjectURL(f),
        };
      }),
      reactions: [],
      send_by: user_id,
      user: profile as DBProfile,
      chat_id: chatSelected.id,
      read_by: [user_id],
      answer_to: answeringMsg?.id ?? null,
      is_pinned: false,
      base_msg: msg_answered_formated,
    };
    setAnsweringMsg(null);
    const content = textarea.value.trim();

    if (content === '' && !files) return;
    textarea.value = '';

    // ADD INSTANT TO CLIENT
    setMessages((prev: DBMessage[]) => [...prev, message]);

    const filesUrl: any[] = [{}];

    if (filesToUpload.length > 0) {
      const uploadPromises = files.map(async (file, i) => {
        const filePath = `${chatSelected.type}/${chatSelected.id}/${file.type}_${new Date().getTime()}`;

        const { data, error: fileError } = await supabase.storage
          .from('chat')
          .upload(filePath, file);
        if (fileError) {
          console.error(`Failed to upload file: ${file.name}`, fileError);
          return;
        }
        const publicURL = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.supabase.in/storage/v1/object/public/${data.fullPath}`;
        filesUrl.push({
          name: file.name,
          type: file.type,
          url: publicURL,
        });
      });

      Promise.all(uploadPromises)
        .then(async () => {
          const filteredFiles = filesUrl.filter((f) => f.url);
          const { id, error } = await insertMessage({
            message,
            files: filteredFiles,
          });
          if (error) {
            console.error(error);
            return;
          }

          if (id) {
            setMessages((prev: DBMessage[]) =>
              prev.map((msg) => (msg.id === 0 ? { ...msg, id } : msg))
            );
          }
          setInputScrollHeight('58px');
          setIsFileLoading(false);
        })
        .catch((error) => {
          console.error('An error occurred during file upload', error);
          setIsFileLoading(false);
        });
    } else {
      const { id, error } = await insertMessage({ message, files: filesUrl });
      if (error) {
        console.error(error);
        return;
      }

      if (id) {
        setMessages((prev: DBMessage[]) =>
          prev.map((msg) => (msg.id === 0 ? { ...msg, id } : msg))
        );
      }

      setInputScrollHeight('58px');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current?.value === '') return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    } else {
      return;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    const div = divRef.current;
    const answer = answerRef.current;
    if (!textarea) return;

    const handleInput = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;

      textarea.scrollHeight < 210 &&
        setInputScrollHeight(
          `${textarea.scrollHeight + (answer?.scrollHeight ?? 0) + (div?.scrollHeight ? 100 : 0)}px`
        );
    };

    textarea.addEventListener('input', handleInput);
    handleInput();

    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, [files, chatSelected, answeringMsg]);

  return (
    <div className="absolute bottom-0 left-0 w-full lg:bg-background">
      <div className="relative mx-[30px] my-spaceSmall flex items-center justify-between">
        <div className="w-full border-border-gray">
          {answeringMsg && (
            <div
              ref={answerRef}
              className="flex w-fit items-start gap-x-spaceSmall rounded-t-lg border border-border-gray bg-primary p-2 text-white"
            >
              <div className="flex flex-col gap-y-1">
                <p className="text-xs">
                  Répondre à{' '}
                  <span className="font-bold">
                    {answeringMsg.user?.role === 'admin'
                      ? 'XPERT ONE'
                      : answeringMsg.user?.firstname}{' '}
                    :
                  </span>
                </p>
                <p className="rounded-xs bg-white p-2 text-xs text-dark">
                  "{answeringMsg.content}"
                </p>
              </div>
              <button
                onClick={() => setAnsweringMsg(null)}
                className="rounded-full p-px transition hover:bg-light-gray-third"
              >
                <X size={14} color="white" />
              </button>
            </div>
          )}
          <div
            ref={divRef}
            className={cn(
              'flex gap-2 overflow-x-auto rounded-t-lg bg-white',
              { 'border border-b-0': files.length },
              { 'p-2': files.length }
            )}
          >
            {files.map((file, i) => (
              <div
                className="relative flex w-fit items-center rounded-lg border border-border-gray bg-white p-2"
                key={file.name + i}
              >
                {file.type.includes('image') ? (
                  <div className="flex h-[80px] w-[100px] items-center">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="image"
                      width={100}
                      height={100}
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-[100px] flex-col items-center">
                    <FileText strokeWidth={1} size={58} />
                    <p className="truncate pt-2 text-xxs font-light">
                      {file.name}
                    </p>
                  </div>
                )}
                <button
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, index) => index !== i))
                  }
                  className="absolute -right-2 -top-2 rounded-full bg-fond-gray p-px transition hover:bg-light-gray-third"
                >
                  <X size={14} color="white" />
                </button>
              </div>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            disabled={!chatSelected}
            onKeyDown={handleKeyDown}
            style={{ maxHeight: '210px' }}
            placeholder="Ecrivez votre message"
            className={cn(
              'w-full resize-none rounded-b-lg border bg-transparent bg-white px-spaceMediumContainer py-spaceXSmall pr-14 text-sm outline-none placeholder:font-light',
              { 'rounded-t-lg': !files.length },
              { 'rounded-tl-none': answeringMsg }
            )}
          />

          <div className="absolute bottom-0 right-0 mx-spaceMediumContainer my-[19px] flex items-center gap-x-spaceSmall">
            <label
              htmlFor="file"
              className={cn('whitespace-nowrap text-xs transition-transform', {
                'cursor-pointer hover:scale-105': chatSelected,
              })}
            >
              <input
                disabled={!chatSelected}
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <Paperclip size={20} strokeWidth={1} />
            </label>
            <button
              disabled={!chatSelected}
              onClick={handleSend}
              className="w-fit rounded-xs bg-accent p-spaceXSmall transition-transform hover:scale-105 disabled:hover:scale-100"
            >
              <SendSvg />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
