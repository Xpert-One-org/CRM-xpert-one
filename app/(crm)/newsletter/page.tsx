'use client';

import React from 'react';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import NewsletterTable from './_components/NewsletterTable';

export default function NewsletterPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={[]}>
      <NewsletterTable />
    </ProtectedRoleRoutes>
  );
}
