import { useState, createContext, useContext, ReactNode } from "react";

interface Alert {
  id: string;
  type: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  timestamp: string;
  source: string;
  read: boolean;
}

interface AppContextType {
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  dismissAlert: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

const initialAlerts: Alert[] = [
  { id: "1", type: "critical", title: "SQL Injection Detected", description: "SQLi payload detected on /api/users?id=1 OR 1=1", timestamp: "2026-04-01T09:15:00Z", source: "DAST Scanner", read: false },
  { id: "2", type: "critical", title: "XSS Vulnerability Found", description: "Reflected XSS via search parameter on /search?q=<script>", timestamp: "2026-04-01T09:12:00Z", source: "DAST Scanner", read: false },
  { id: "3", type: "high", title: "Broken Access Control", description: "IDOR detected: user 42 can access /api/users/99/profile", timestamp: "2026-04-01T08:55:00Z", source: "Recon Module", read: false },
  { id: "4", type: "high", title: "Hardcoded API Key", description: "AWS_SECRET_KEY found in src/config/database.js line 14", timestamp: "2026-04-01T08:30:00Z", source: "SAST Analyzer", read: false },
  { id: "5", type: "medium", title: "Missing CSP Header", description: "Content-Security-Policy header not set on main application", timestamp: "2026-04-01T08:20:00Z", source: "Mitigation Center", read: false },
  { id: "6", type: "medium", title: "Excessive Failed Logins", description: "47 failed login attempts from 185.220.101.x in 5 minutes", timestamp: "2026-04-01T08:10:00Z", source: "SIEM", read: false },
  { id: "7", type: "low", title: "Outdated Dependency", description: "lodash@4.17.15 has known prototype pollution vulnerability", timestamp: "2026-04-01T07:45:00Z", source: "SAST Analyzer", read: false },
  { id: "8", type: "low", title: "Debug Endpoint Exposed", description: "/debug/vars endpoint accessible without authentication", timestamp: "2026-04-01T07:30:00Z", source: "Recon Module", read: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <AppContext.Provider value={{ alerts, setAlerts, dismissAlert, unreadCount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be inside AppProvider");
  return ctx;
}

export type { Alert };
