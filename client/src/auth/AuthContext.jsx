import { createContext, useContext, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "../services/api";

const AUTH_STORAGE_KEY = "portfolio_admin_session_v1";

const AuthContext = createContext(null);

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

  // Validate session on app launch
  useEffect(() => {
    if (user?.token) {
      authApi.me().catch(() => {
        // Token expired or invalid
        logout();
      });
    }
  }, []);

  const login = async (email, password, rememberMe = true) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.login(email, password);

      if (response.success && response.token) {
        const sessionPayload = {
          ...response.user,
          token: response.token,
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
        throw new Error(response.message || "Authentication failed.");
      }
    } catch (err) {
      setIsLoading(false);
      const errMsg = err.message || "Invalid credentials. Please verify your email and password.";
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      const res = await authApi.changePassword(currentPassword, newPassword);
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      throw err;
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
        changePassword,
        demoCredentials: {
          email: "admin@ashish.dev",
          password: "AdminPassword123!",
        },
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
