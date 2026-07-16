import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ContractType = "full-time" | "part-time";
export type Theme = "light" | "dark";
export type Lang = "it" | "en";

export type MonthEntry = {
  totalHours: number;
  nightHours: number;
  sundayHours: number;
  holidayHours: number;
  ordinaryHoursOverride?: number; // if set, overrides the month's default
  notes?: string;
  savedAt: string;
};

export type Settings = {
  contract: ContractType;
  partTimeWeeklyHours: number; // used when contract = part-time
  baseHourlyPay: number; // €/h
  overtimePct: number;
  nightPct: number;
  sundayPct: number;
  holidayPct: number;
  theme: Theme;
  lang: Lang;
  fontSize: number; // px, base 16
};

export const defaultSettings: Settings = {
  contract: "full-time",
  partTimeWeeklyHours: 20,
  baseHourlyPay: 10,
  overtimePct: 25,
  nightPct: 30,
  sundayPct: 30,
  holidayPct: 50,
  theme: "light",
  lang: "it",
  fontSize: 16,
};

// key: `${year}-${month}` month 1-12
export type Entries = Record<string, MonthEntry>;

type Ctx = {
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  entries: Entries;
  saveEntry: (year: number, month: number, entry: MonthEntry) => void;
  removeEntry: (year: number, month: number) => void;
};

const WorkCtx = createContext<Ctx | null>(null);

const SKEY = "work-hours:settings:v1";
const EKEY = "work-hours:entries:v1";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}
function readEntries(): Entries {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(EKEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function WorkProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [entries, setEntries] = useState<Entries>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettingsState(readLS(SKEY, defaultSettings));
    setEntries(readEntries());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SKEY, JSON.stringify(settings));
    // Apply theme
    const root = document.documentElement;
    if (settings.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.fontSize = `${settings.fontSize}px`;
    root.lang = settings.lang;
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(EKEY, JSON.stringify(entries));
  }, [entries, hydrated]);

  const setSettings = (s: Partial<Settings>) =>
    setSettingsState((prev) => ({ ...prev, ...s }));

  const saveEntry = (year: number, month: number, entry: MonthEntry) => {
    setEntries((prev) => ({ ...prev, [`${year}-${month}`]: entry }));
  };
  const removeEntry = (year: number, month: number) => {
    setEntries((prev) => {
      const next = { ...prev };
      delete next[`${year}-${month}`];
      return next;
    });
  };

  return (
    <WorkCtx.Provider value={{ settings, setSettings, entries, saveEntry, removeEntry }}>
      {children}
    </WorkCtx.Provider>
  );
}

export function useWork() {
  const ctx = useContext(WorkCtx);
  if (!ctx) throw new Error("useWork must be inside WorkProvider");
  return ctx;
}
