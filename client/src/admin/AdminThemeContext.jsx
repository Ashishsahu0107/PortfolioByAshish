import { createContext, useContext, useState, useEffect } from "react";
import { LOGIN_THEMES } from "../components/loginThemes";

const AdminThemeContext = createContext(null);

export function AdminThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem("secret_login_theme") || "amber";
  });

  const currentTheme =
    LOGIN_THEMES.find((t) => t.id === themeId) || LOGIN_THEMES[0];

  const setTheme = (id) => {
    setThemeId(id);
    localStorage.setItem("secret_login_theme", id);
  };

  useEffect(() => {
    // Dynamically inject CSS variables onto the root or admin container
    const root = document.documentElement;
    root.style.setProperty("--admin-accent", currentTheme.accent);
    root.style.setProperty("--admin-glow", currentTheme.glow);
    root.style.setProperty("--admin-trim", currentTheme.lampTrim);
    root.style.setProperty("--admin-trim-light", currentTheme.lampTrimLight);

    // Convert hex to rgb
    const hex = currentTheme.accent.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) || 245;
    const g = parseInt(hex.substring(2, 4), 16) || 158;
    const b = parseInt(hex.substring(4, 6), 16) || 11;
    root.style.setProperty("--admin-accent-rgb", `${r}, ${g}, ${b}`);

    // Dynamic gradient
    const gradient = `linear-gradient(135deg, ${currentTheme.accent}, ${currentTheme.glow})`;
    root.style.setProperty("--admin-gradient", gradient);
    root.style.setProperty(
      "--admin-shadow",
      `0 4px 18px rgba(${r}, ${g}, ${b}, 0.35)`
    );
  }, [currentTheme]);

  return (
    <AdminThemeContext.Provider
      value={{ currentTheme, themeId, setTheme, themes: LOGIN_THEMES }}
    >
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) {
    return {
      currentTheme: LOGIN_THEMES[0],
      themeId: "amber",
      setTheme: () => {},
      themes: LOGIN_THEMES,
    };
  }
  return ctx;
}
