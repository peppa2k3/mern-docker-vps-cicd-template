import { createContext, useState, useCallback, useContext } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    backgroundcolor: "#f8fafc",
    primarycolor: "#1e3a8a",
    secondarycolor: "#fbbf24",
    cardcolor: "#ffffff",
    textcolor: "#1e293b",
    bordercolor: "#e2e8f0",
    accentcolor: "#3b82f6",
  });

  // Apply theme object → CSS variables on :root
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    root.style.setProperty("--background", newTheme.backgroundcolor);
    root.style.setProperty("--primary", newTheme.primarycolor);
    root.style.setProperty("--secondary", newTheme.secondarycolor);
    root.style.setProperty("--card", newTheme.cardcolor || "#ffffff");
    root.style.setProperty("--text", newTheme.textcolor || "#1e293b");
    root.style.setProperty("--border", newTheme.bordercolor || "#e2e8f0");
    root.style.setProperty("--accent", newTheme.accentcolor || "#3b82f6");
    setTheme(newTheme);
  }, []);

  // Apply + persist to backend
  const saveTheme = useCallback(
    async (newTheme) => {
      applyTheme(newTheme);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await axios.put(
            `${API}/api/auth/theme`,
            { theme: newTheme },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Failed to save theme:", err);
        }
      }
    },
    [applyTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, applyTheme, saveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
