import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AUTH_STORAGE_KEY = "portfolio_admin_session_v1";

const AuthContext = createContext(null);

// Default Admin credentials for portfolio management
const VALID_ACCOUNTS = [
  {
    email: "admin@ashish.dev",
    password: "AdminPassword123!",
    name: "Ashish Sahu",
    role: "Lead Full Stack Developer & Owner",
  },
  {
    email: "ashishsahu01072005@gmail.com",
    password: "ashish2026",
    name: "Ashish Sahu",
    role: "Portfolio Administrator",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = Boolean(user && user.token);

  const login = async (email, password, rememberMe = true) => {
    setIsLoading(true);
    setError("");

    // Simulate realistic async verification
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanEmail = (email || "").trim().toLowerCase();
    const matchedAccount = VALID_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === password
    );

    if (matchedAccount) {
      const sessionPayload = {
        email: matchedAccount.email,
        name: matchedAccount.name,
        role: matchedAccount.role,
        token: "jwt_admin_" + Math.random().toString(36).substring(2) + Date.now().toString(36),
        loginTime: new Date().toISOString(),
        expiresIn: "24h",
      };

      setUser(sessionPayload);
      setIsLoading(false);

      try {
        if (rememberMe) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionPayload));
        } else {
          sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionPayload));
        }
      } catch {}

      return { success: true };
    } else {
      setIsLoading(false);
      const errMsg = "Invalid email or password. Use demo credentials or verify your entry.";
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const logout = () => {
    setUser(null);
    setError("");
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        setError,
        login,
        logout,
        demoCredentials: VALID_ACCOUNTS[0],
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/secret-login" state={{ from: location }} replace />;
  }

  return children;
}
