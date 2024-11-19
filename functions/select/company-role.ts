'use server';

import type { DBCompanyRoles } from '@/types/typesDb';
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

export const insertCompanyRole = async (companyRole: DBCompanyRoles) => {
  const supabase = await createSupabaseAppServerClient();
  const { data, error } = await supabase
    .from('company_roles')
    .insert({
      label: companyRole.label,
      value: companyRole.value,
      json_key: companyRole.json_key,
    })
    .select('*');

  if (error) {
    console.error('Error inserting company role:', error);
    return { data: null, error: error };
  }

  return { data: data[0] };
};
