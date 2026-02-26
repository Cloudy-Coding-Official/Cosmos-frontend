import { createContext, useContext, useState, useCallback, useEffect } from "react";
import * as authApi from "../api/auth";
import type { AuthUser } from "../api/auth";

export type UserRole = "comprador" | "retailer" | "proveedor";

function deriveFrontendRole(user: AuthUser | null): UserRole | null {
  if (!user) return null;
  if (user.hasProviderProfile || user.pendingProvider) return "proveedor";
  if (user.hasStoreProfile) return "retailer";
  return "comprador";
}

type AuthContextType = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (role?: UserRole) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const userRole = deriveFrontendRole(user);
  const isLoggedIn = !!user;

  const refreshUser = useCallback(async () => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("cosmos_access_token") : null;
    if (!token) {
      setUserState(null);
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUserState(me);
      localStorage.setItem("cosmos_logged_in", "true");
      localStorage.setItem("cosmos_user_role", deriveFrontendRole(me) ?? "comprador");
    } catch {
      authApi.clearStoredTokens();
      setUserState(null);
      localStorage.removeItem("cosmos_logged_in");
      localStorage.removeItem("cosmos_user_role");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("cosmos_access_token")) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
  }, []);

  const login = useCallback((role?: UserRole) => {
    localStorage.setItem("cosmos_logged_in", "true");
    localStorage.setItem("cosmos_user_role", role ?? "comprador");
  }, []);

  const logout = useCallback(() => {
    authApi.logoutApi();
    setUserState(null);
    localStorage.removeItem("cosmos_logged_in");
    localStorage.removeItem("cosmos_user_role");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        userRole,
        loading,
        login,
        logout,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
