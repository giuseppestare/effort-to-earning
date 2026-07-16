import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { NumberField } from "@/components/NumberField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { useWork } from "@/lib/work-store";
import { useT, monthName } from "@/lib/i18n";
import { computePay, defaultOrdinaryHours, fmtMoney, fmtNum } from "@/lib/calc";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { settings, saveEntry, entries } = useWork();
  const t = useT(settings.lang);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const existing = entries[`${year}-${month}`];
  const defOrd = useMemo(
    () => defaultOrdinaryHours(year, month, settings),
    [year, month, settings],
  );

  const [totalHours, setTotalHours] = useState(existing?.totalHours ?? 0);
  const [nightHours, setNightHours] = useState(existing?.nightHours ?? 0);
  const [sundayHours, setSundayHours] = useState(existing?.sundayHours ?? 0);
  const [holidayHours, setHolidayHours] = useState(existing?.holidayHours ?? 0);
  const [ordinaryHours, setOrdinaryHours] = useState(
    existing?.ordinaryHoursOverride ?? defOrd,
  );

  // When month/year change, reset defaults if no existing entry
  useMemo(() => {
    const e = entries[`${year}-${month}`];
    setTotalHours(e?.totalHours ?? 0);
    setNightHours(e?.nightHours ?? 0);
    setSundayHours(e?.sundayHours ?? 0);
    setHolidayHours(e?.holidayHours ?? 0);
    setOrdinaryHours(e?.ordinaryHoursOverride ?? defaultOrdinaryHours(year, month, settings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const result = computePay({
    totalHours,
    nightHours,
    sundayHours,
    holidayHours,
    ordinaryHours,
    settings,
  });

  const onSave = () => {
    saveEntry(year, month, {
      totalHours,
      nightHours,
      sundayHours,
      holidayHours,
      ordinaryHoursOverride: ordinaryHours !== defOrd ? ordinaryHours : undefined,
      savedAt: new Date().toISOString(),
    });
    toast.success(t.saved);
  };

  const years = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  return (
    <AppLayout>
      <Toaster position="top-center" richColors />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{t.inputTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>{t.month}</Label>
                <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {monthName(m, settings.lang)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>{t.year}</Label>
                <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="total">{t.totalHours}</Label>
              <NumberField id="total" value={totalHours} onChange={setTotalHours} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ord">{t.ordinaryHours}</Label>
              <NumberField id="ord" value={ordinaryHours} onChange={setOrdinaryHours} />
              <p className="text-xs text-muted-foreground">{t.ordinaryHint}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>{t.nightHours}</Label>
                <NumberField value={nightHours} onChange={setNightHours} />
              </div>
              <div className="space-y-1">
                <Label>{t.sundayHours}</Label>
                <NumberField value={sundayHours} onChange={setSundayHours} />
              </div>
              <div className="space-y-1">
                <Label>{t.holidayHours}</Label>
                <NumberField value={holidayHours} onChange={setHolidayHours} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.result}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label={t.ordinary} value={`${fmtNum(result.ordinary)} ${t.hours}`} />
            <Row label={t.overtime} value={`${fmtNum(result.overtime)} ${t.hours}`} />
            <div className="my-2 border-t border-border" />
            <Row label={t.basePay} value={fmtMoney(result.base)} />
            <Row label={t.overtimePay} value={fmtMoney(result.overtimePay)} />
            <Row label={t.nightPay} value={fmtMoney(result.nightPay)} />
            <Row label={t.sundayPay} value={fmtMoney(result.sundayPay)} />
            <Row label={t.holidayPay} value={fmtMoney(result.holidayPay)} />
            <div className="my-2 border-t border-border" />
            <Row label={t.gross} value={fmtMoney(result.gross)} strong />
          </CardContent>
        </Card>

        <Button className="w-full" size="lg" onClick={onSave}>
          {t.save}
        </Button>
      </div>
    </AppLayout>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? "text-base font-semibold" : "text-sm"}`}>
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
