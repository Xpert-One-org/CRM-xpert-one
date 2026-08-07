'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export type NewsletterSubscriber = {
  id: number;
  email: string;
  consent: boolean;
  source: string | null;
  created_at: string;
};

export const getNewsletterSubscribers = async (): Promise<
  NewsletterSubscriber[]
> => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await (supabase as any)
    .from('newsletter_subscribers')
    .select('id, email, consent, source, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
  return (data ?? []) as NewsletterSubscriber[];
};

export const deleteNewsletterSubscriber = async (
  id: number
): Promise<{ error: string | null }> => {
  const supabase = await createSupabaseAppServerClient();
  const { error } = await (supabase as any)
    .from('newsletter_subscribers')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error deleting newsletter subscriber:', error);
    return { error: error.message };
  }
  return { error: null };
};
