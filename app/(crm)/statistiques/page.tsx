'use client';

import ProtectedRoleRoutes from '@/components/auth/ProtectedRoleRoutes';

export default function StatistiquesPage() {
  return (
    <ProtectedRoleRoutes notAllowedRoles={['project_manager', 'intern', 'hr']}>
      <div className="flex flex-col gap-6">
        <h1>Statistiques</h1>
      </div>
    </ProtectedRoleRoutes>
  );
}
