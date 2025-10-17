import { useEffect, useState } from 'react';
import UnauthorizedPage from './UnauthorizedPage';
import Loader from '../Loader';
import type { DBCollaboratorRole } from '@/types/typesDb';
import { getLoggedUser } from '@functions/auth/getLoggedUser';

type ProtectedRoleRoutesProps = {
  children: React.ReactNode;
  notAllowedRoles: DBCollaboratorRole[];
};

export default function ProtectedRoleRoutes({
  children,
  notAllowedRoles,
}: ProtectedRoleRoutesProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handleCheckRole = async () => {
    try {
      setIsLoading(true);
      const user = await getLoggedUser();
      if (notAllowedRoles.includes(user.role)) {
        setIsUnauthorized(true);
      } else {
        setIsUnauthorized(false);
      }
    } catch (error) {
      setIsUnauthorized(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCheckRole();
  }, []);

  if (isLoading) {
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
