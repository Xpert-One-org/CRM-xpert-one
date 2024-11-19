import { create } from 'zustand';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';

type HasSeen = {
  has_seen_my_missions: boolean | null;
  has_seen_available_missions: boolean | null;
  has_seen_messaging: boolean | null;
  has_seen_community: boolean | null;
  has_seen_blog: boolean | null;
  has_seen_newsletter: boolean | null;
  has_seen_my_profile: boolean | null;
  has_seen_created_missions: boolean | null;
};

type PopupInformativeState = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setHasSeen: (page: keyof HasSeen) => void;
};

export const usePopupInformativeStore = create<PopupInformativeState>(
  (set) => ({
    showModal: false,
    setShowModal: (value: boolean) => set({ showModal: value }),
    setHasSeen: async (page: keyof HasSeen) => {
      const supabase = createSupabaseFrontendClient();
      const { user } = (await supabase.auth.getUser()).data;
      if (user) {
        await supabase
          .from('profile')
          .update({ [page]: true })
          .eq('id', user.id);
      }
    },
  })
);
