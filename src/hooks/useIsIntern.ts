import { useAuth } from '@/hooks/useAuth';

export const useIsIntern = () => {
  const { user } = useAuth();
  return user?.role === 'intern';
};
