import type { Settings } from "./work-store";

// Compute default ordinary monthly hours for a month/year.
// full-time: business days (Mon-Fri) * 8, minus Italian national holidays that fall on weekdays * 8.
// part-time: business days * (weeklyHours / 5).
const ITALIAN_HOLIDAYS_FIXED: Array<[number, number]> = [
  [1, 1], [1, 6], [4, 25], [5, 1], [6, 2], [8, 15], [11, 1], [12, 8], [12, 25], [12, 26],
];

// Simple Gauss algorithm for Easter Monday
function easterMonday(year: number): { m: number; d: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  // Easter Monday = Easter Sunday + 1
  const easter = new Date(year, month - 1, day);
  easter.setDate(easter.getDate() + 1);
  return { m: easter.getMonth() + 1, d: easter.getDate() };
}

export function defaultOrdinaryHours(year: number, month: number, settings: Settings): number {
  const em = easterMonday(year);
  const holidays = new Set<string>([
    ...ITALIAN_HOLIDAYS_FIXED.map(([m, d]) => `${m}-${d}`),
    `${em.m}-${em.d}`,
  ]);
  const days = new Date(year, month, 0).getDate();
  let workDays = 0;
  for (let d = 1; d <= days; d++) {
    const dt = new Date(year, month - 1, d);
    const wd = dt.getDay();
    if (wd === 0 || wd === 6) continue; // sun, sat
    if (holidays.has(`${month}-${d}`)) continue;
    workDays++;
  }
  const dailyHours =
    settings.contract === "full-time" ? 8 : settings.partTimeWeeklyHours / 5;
  return Math.round(workDays * dailyHours * 100) / 100;
}

export type CalcResult = {
  ordinary: number;
  overtime: number;
  night: number;
  sunday: number;
  holiday: number;
  base: number;
  overtimePay: number;
  nightPay: number;
  sundayPay: number;
  holidayPay: number;
  gross: number;
};

export function computePay(input: {
  totalHours: number;
  nightHours: number;
  sundayHours: number;
  holidayHours: number;
  ordinaryHours: number;
  settings: Settings;
}): CalcResult {
  const { totalHours, nightHours, sundayHours, holidayHours, ordinaryHours, settings } = input;
  const overtime = Math.max(0, totalHours - ordinaryHours);
  const ordinary = Math.max(0, totalHours - overtime);
  const p = settings.baseHourlyPay;

  // Ordinary base pay = ordinary hours * base rate (night/sunday/holiday portions
  // still get their extra % on top; they are typically a subset of the total).
  const base = ordinary * p;
  const overtimePay = overtime * p * (1 + settings.overtimePct / 100);
  // Additional percentages applied as surcharge on top of base rate for those hours.
  const nightPay = nightHours * p * (settings.nightPct / 100);
  const sundayPay = sundayHours * p * (settings.sundayPct / 100);
  const holidayPay = holidayHours * p * (settings.holidayPct / 100);

  const gross = base + overtimePay + nightPay + sundayPay + holidayPay;
  return {
    ordinary,
    overtime,
    night: nightHours,
    sunday: sundayHours,
    holiday: holidayHours,
    base,
    overtimePay,
    nightPay,
    sundayPay,
    holidayPay,
    gross,
  };
}

export function parseNum(v: string): number {
  if (!v) return 0;
  const n = parseFloat(v.replace(/\./g, "").replace(",", "."));
  return isFinite(n) ? n : 0;
}
export function fmtNum(n: number, digits = 2): string {
  if (!isFinite(n)) return "0";
  return n.toLocaleString("it-IT", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export function fmtMoney(n: number): string {
  return `${fmtNum(n, 2)} €`;
}
