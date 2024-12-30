import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import UnauthorizedPage from './UnauthorizedPage';
import Loader from '../Loader';

type ProtectedRoleRoutesProps = {
  children: React.ReactNode;
  notAllowedRoles: string[];
};

export default function ProtectedRoleRoutes({
  children,
  notAllowedRoles,
}: ProtectedRoleRoutesProps) {
  const { user, loading } = useAuth();
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (!loading && (!user || notAllowedRoles.includes(user.role))) {
      setIsUnauthorized(true);
    }
  }, [user, loading, notAllowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isUnauthorized) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
