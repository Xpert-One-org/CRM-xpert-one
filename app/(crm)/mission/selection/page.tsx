'use client';

import React from 'react';
import ComboboxMission from '@/components/combobox/ComboboxMission';
import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function MissionSelectionPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['hr', 'adv']}>
      <ComboboxMission slug="selection" />
    </ProtectedRoleRoutes>
  );
}
