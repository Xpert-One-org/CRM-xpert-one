'use client';

import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';
import StatistiquesContent from './StatistiquesContent';

export default function StatistiquesPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['project_manager', 'intern', 'hr']}>
      <div className="flex flex-col gap-6">
        <StatistiquesContent />
      </div>
    </ProtectedRoleRoutes>
  );
}
