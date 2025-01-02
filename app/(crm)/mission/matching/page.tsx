'use client';

import React from 'react';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function MatchingPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <ComboboxMission slug="matching" />
    </ProtectedRoleRoutes>
  );
}
