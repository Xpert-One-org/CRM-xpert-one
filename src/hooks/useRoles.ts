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
