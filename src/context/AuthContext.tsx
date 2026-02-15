import { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "comprador" | "retailer" | "proveedor";

type AuthContextType = {
  isLoggedIn: boolean;
  userRole: UserRole | null;
  login: (role?: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("cosmos_logged_in") === "true";
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const r = localStorage.getItem("cosmos_user_role");
    return (r === "comprador" || r === "retailer" || r === "proveedor") ? r : null;
  });

  const login = useCallback((role?: UserRole) => {
    setIsLoggedIn(true);
    localStorage.setItem("cosmos_logged_in", "true");
    const r = role || "comprador";
    setUserRole(r);
    localStorage.setItem("cosmos_user_role", r);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("cosmos_logged_in");
    localStorage.removeItem("cosmos_user_role");
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
