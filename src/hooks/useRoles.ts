import { useAuth } from '@/hooks/useAuth';

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};

export const useIsProjectManager = () => {
  const { user } = useAuth();
  return user?.role === 'project_manager';
};

export const useIsIntern = () => {
  const { user } = useAuth();
  return user?.role === 'intern';
};

export const useIsHr = () => {
  const { user } = useAuth();
  return user?.role === 'hr';
};

export const useIsAdv = () => {
  const { user } = useAuth();
  return user?.role === 'adv';
};

// Hook optimisé pour récupérer tous les rôles en une fois
export const useUserRole = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return { role: null, loading: true };
  }

  const isAdmin = user?.role === 'admin';
  const isProjectManager = user?.role === 'project_manager';
  const isIntern = user?.role === 'intern';
  const isHr = user?.role === 'hr';
  const isAdv = user?.role === 'adv';

  return {
    role: user?.role,
    loading,
    isAdmin,
    isProjectManager,
    isIntern,
    isHr,
    isAdv,
  };
};
