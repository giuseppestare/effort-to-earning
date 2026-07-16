import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWork } from "@/lib/work-store";
import { useT, monthName } from "@/lib/i18n";
import { computePay, defaultOrdinaryHours, fmtMoney, fmtNum } from "@/lib/calc";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const { settings, entries, removeEntry } = useWork();
  const t = useT(settings.lang);

  const keys = Object.keys(entries).sort((a, b) => {
    const [ay, am] = a.split("-").map(Number);
    const [by, bm] = b.split("-").map(Number);
    if (by !== ay) return by - ay;
    return bm - am;
  });

  return (
    <AppLayout>
      <h2 className="mb-4 text-xl font-semibold">{t.monthlyRecords}</h2>
      {keys.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.noRecords}</p>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => {
            const [y, m] = k.split("-").map(Number);
            const e = entries[k];
            const ord = e.ordinaryHoursOverride ?? defaultOrdinaryHours(y, m, settings);
            const r = computePay({
              totalHours: e.totalHours,
              nightHours: e.nightHours,
              sundayHours: e.sundayHours,
              holidayHours: e.holidayHours,
              ordinaryHours: ord,
              settings,
            });
            return (
              <Card key={k}>
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base capitalize">
                    {monthName(m, settings.lang)} {y}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEntry(y, m)}
                    aria-label={t.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.totalHours}</span>
                    <span className="tabular-nums">{fmtNum(e.totalHours)} {t.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.ordinary} / {t.overtime}</span>
                    <span className="tabular-nums">{fmtNum(r.ordinary)} / {fmtNum(r.overtime)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-base font-semibold">
                    <span>{t.gross}</span>
                    <span className="tabular-nums">{fmtMoney(r.gross)}</span>
                  </div>
                  <p className="pt-1 text-xs text-muted-foreground">
                    {t.savedOn} {new Date(e.savedAt).toLocaleString(settings.lang === "it" ? "it-IT" : "en-US")}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
