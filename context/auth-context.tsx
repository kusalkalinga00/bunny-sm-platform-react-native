import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, type ReactNode } from "react";

export type AppUser = User & {
  image: string | null;
  address: string | null;
  name: string | null;
  bio: string | null;
  phoneNumber: string | null;
};

export type AuthContextValue = {
  user: AppUser | null;
  setAuth: (authUser: User | null) => void;
  setUserData: (userData: Partial<AppUser>) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setAuth: () => {},
  setUserData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  const setAuth = (authUser: User | null) => {
    setUser(authUser ? ({ ...authUser, image: null } as AppUser) : null);
  };

  const setUserData = (userData: Partial<AppUser>) => {
    setUser((prev) =>
      prev ? { ...prev, ...userData } : (userData as AppUser)
    );
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
