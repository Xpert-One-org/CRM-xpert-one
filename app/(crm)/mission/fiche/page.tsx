'use client';

import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import React from 'react';

export default function page() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <ComboboxMission slug="fiche" />
    </ProtectedRoleRoutes>
  );
}
