'use server';

import { msgPerPage } from '@/data/constant';
import type { Reaction } from '@/types/types';
import type { DBChat, DBMessage, MsgFiles } from '@/types/typesDb';
import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const handleReadNewMessage = async ({
  chat_id,
  read_by,
}: {
  chat_id: number;
  read_by: string[];
}) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }
  console.log('read_by', read_by);
  const { data, error } = await supabase
    .from('message')
    .update({
      read_by: read_by.includes(user.id) ? read_by : [...read_by, user.id],
    })
    .eq('chat_id', chat_id)
    .not('read_by', 'cs', `{${user.id}}`)
    .select('*');

  if (error) {
    console.log('error', error);
    return { error: error.message };
  }
  return { error: null };
};

export const getUserChats = async () => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { data: null, error: 'User not found' };
  }
  const { data: chats, error } = await supabase
    .from('chat')
    .select('*, messages:message(*), mission(mission_number)')
    .order('updated_at', { ascending: false })

    .eq('type', 'chat')
    .order('created_at', { referencedTable: 'message', ascending: false })

    .limit(1, { referencedTable: 'message' });

  const chatsWithSingleMission = chats?.map((chat) => ({
    ...chat,
    mission: Array.isArray(chat.mission) ? chat.mission[0] : chat.mission,
  }));

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: chatsWithSingleMission, error: null };
};

export const getMessages = async ({
  chat_id,
  from = 0,
  to = msgPerPage - 1,
}: {
  chat_id: number;
  from?: number;
  to?: number;
}) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { data: null, error: 'User not found', count: 0 };
  }
  const { data, error, count } = await supabase
    .from('message')
    .select(
      '*, base_msg:answer_to(id, content, created_at, send_by, profile:send_by(role, username, avatar_url, company_name, generated_id, firstname, lastname)), user:profile(role, username, company_name, avatar_url, generated_id, firstname, lastname)',
      { count: 'exact' }
    )
    .eq('chat_id', chat_id)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return { data: null, error, count: 0 };
  }

  const sortedData: any = data.toSorted(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return { data: sortedData as DBMessage[], error: null, count };
};

export const insertReaction = async ({
  reaction,
  message_id,
}: {
  reaction: Reaction[];
  message_id: number;
}) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }

  const { data, error } = await supabase
    .from('message')
    .update({
      reactions: reaction,
    })
    .eq('id', message_id)
    .select('*');

  if (error) {
    return { error };
  }
  return { error: null };
};

export const insertMessage = async ({
  message,
  files,
}: {
  message: DBMessage;
  files: MsgFiles[];
}) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { id: null, error: 'User not found' };
  }
  const { data: data, error } = await supabase
    .from('message')
    .insert({
      content: message.content,
      chat_id: message.chat_id,
      answer_to: message.answer_to,
      is_pinned: message.is_pinned,
      files,
    })
    .select('id')
    .single();
  if (error) {
    return { id: null, error };
  }
  return { id: data.id, error: null };
};

export const addFileToMessage = async ({
  message_id,
  files,
}: {
  message_id: number;
  files: MsgFiles[];
}) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }
  console.log('files', files);
  const { error } = await supabase
    .from('message')
    .update({ files })
    .eq('id', message_id);
  if (error) {
    return { error };
  }
  return { error: null };
};

export const postChat = async ({
  chat,
  message,
  receiver_id,
}: {
  chat: DBChat;
  message: DBMessage;
  receiver_id: string;
}) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { data: null, messageData: null, error: 'User not found' };
  }
  const { data, error } = await supabase
    .from('chat')
    .insert({
      title: chat.title,
      topic: chat.topic,
      category: chat.category,
      mission_id: chat.mission_id,
      type: chat.type,
      receiver_id,
    })
    .select('id')
    .single();
  if (error) {
    return { data: null, messageData: null, error: error.message };
  }
  const { data: messageData, error: error2 } = await supabase
    .from('message')
    .insert({
      content: message.content,
      chat_id: data.id,
    })
    .select('id')
    .single();
  if (error2) {
    return { data: null, messageData: null, error: error2.message };
  }
  return { data: data, messageData: messageData, error: null };
};

export const uploadFileChat = async ({
  file,
  filePath,
}: {
  file: string;
  filePath: string;
}) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }

  const base64Data = file.split(',')[1];
  const binaryData = Buffer.from(base64Data, 'base64');

  const { data, error } = await supabase.storage
    .from('chat')
    .upload(filePath, binaryData, {
      upsert: true,
    });
  if (error) {
    return { error };
  }
  return { data, error: null };
};

export const selectBaseMsg = async (message_id: number) => {
  const supabase = createSupabaseAppServerClient();
  const { user } = (await supabase.auth.getUser()).data;
  if (!user) {
    return { error: 'User not found' };
  }
  const { data, error } = await supabase
    .from('message')
    .select(
      '*, profile(role, company_name, generated_id, firstname, lastname, avatar_url, username)'
    )
    .eq('id', message_id)
    .single();
  return { data, error };
};
