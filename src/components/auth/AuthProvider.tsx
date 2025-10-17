// components/auth/AuthProvider.tsx
'use client';

import { createContext, useMemo, useState } from 'react';
import type { DBProfile } from '@/types/typesDb';

type AuthContextType = {
  user: DBProfile | null;
  setUser: React.Dispatch<React.SetStateAction<DBProfile | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
  isProjectManager: boolean;
  isIntern: boolean;
  isHr: boolean;
  isAdv: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  setLoading: () => {},
  isAdmin: false,
  isProjectManager: false,
  isIntern: false,
  isHr: false,
  isAdv: false,
});

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: DBProfile | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<DBProfile | null>(initialUser);
  // tu contrôles `loading` côté client (ici false par défaut car tu as déjà les données serveur)
  const [loading, setLoading] = useState<boolean>(false);

  const isAdmin = user?.role === 'admin';
  const isProjectManager = user?.role === 'project_manager';
  const isIntern = user?.role === 'intern';
  const isHr = user?.role === 'hr';
  const isAdv = user?.role === 'adv';

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      isAdmin,
      isProjectManager,
      isIntern,
      isHr,
      isAdv,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
