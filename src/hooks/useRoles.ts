import { useAuth } from '@/hooks/useAuth';

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};

export const useIsProjectManager = () => {
  const { user } = useAuth();
  return user?.role === 'project_manager' || user?.role === 'admin';
};

export const useIsIntern = () => {
  const { user } = useAuth();
  return user?.role === 'intern' || user?.role === 'admin';
};

export const useIsHr = () => {
  const { user } = useAuth();
  return user?.role === 'hr' || user?.role === 'admin';
};

export const useIsAdv = () => {
  const { user } = useAuth();
  return user?.role === 'adv' || user?.role === 'admin';
};
