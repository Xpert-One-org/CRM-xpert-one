import { useEffect, useState } from 'react';
import { createSupabaseFrontendClient } from '@/utils/supabase/client';
import type { DBProfile } from '@/types/typesDb';

export function useAuth() {
  const [user, setUser] = useState<DBProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseFrontendClient();

    const getCurrentUser = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          const { data: userData } = await supabase
            .from('profile')
            .select('*')
            .eq('id', authUser.id)
            .single();

          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        console.log('ok');
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return {
    user,
    loading,
  };
}
