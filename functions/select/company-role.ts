'use server';

import { createSupabaseAppServerClient } from '@/utils/supabase/server';

export const getCompanyRoles = async () => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('company_roles')
    .select('label, value');

  if (error) {
    console.error('Error fetching company roles:', error);
    return { data: null, error: error };
  }

  if (!data) {
    console.error('Error fetching company roles:', 'No data returned');
    return { data: null, error: 'No data returned' };
  }

  return { data };
};
