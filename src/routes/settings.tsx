import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { NumberField } from "@/components/NumberField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultSettings, useWork } from "@/lib/work-store";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, setSettings } = useWork();
  const t = useT(settings.lang);

  return (
    <AppLayout>
      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle>{t.contract}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={settings.contract}
              onValueChange={(v) => setSettings({ contract: v as "full-time" | "part-time" })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">{t.fullTime}</SelectItem>
                <SelectItem value="part-time">{t.partTime}</SelectItem>
              </SelectContent>
            </Select>
            {settings.contract === "part-time" && (
              <div className="space-y-1">
                <Label>{t.partTimeWeekly}</Label>
                <NumberField
                  value={settings.partTimeWeeklyHours}
                  onChange={(n) => setSettings({ partTimeWeeklyHours: n })}
                />
              </div>
            )}
            <div className="space-y-1">
              <Label>{t.baseHourlyPay}</Label>
              <NumberField
                value={settings.baseHourlyPay}
                onChange={(n) => setSettings({ baseHourlyPay: n })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.percentages}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>{t.overtimePct}</Label>
              <NumberField value={settings.overtimePct} onChange={(n) => setSettings({ overtimePct: n })} />
            </div>
            <div className="space-y-1">
              <Label>{t.nightPct}</Label>
              <NumberField value={settings.nightPct} onChange={(n) => setSettings({ nightPct: n })} />
            </div>
            <div className="space-y-1">
              <Label>{t.sundayPct}</Label>
              <NumberField value={settings.sundayPct} onChange={(n) => setSettings({ sundayPct: n })} />
            </div>
            <div className="space-y-1">
              <Label>{t.holidayPct}</Label>
              <NumberField value={settings.holidayPct} onChange={(n) => setSettings({ holidayPct: n })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t.appearance}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>{t.lang}</Label>
              <Select value={settings.lang} onValueChange={(v) => setSettings({ lang: v as "it" | "en" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>{t.theme}</Label>
              <Select value={settings.theme} onValueChange={(v) => setSettings({ theme: v as "light" | "dark" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t.light}</SelectItem>
                  <SelectItem value="dark">{t.dark}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.fontSize}: {settings.fontSize}px</Label>
              <Slider
                min={12}
                max={22}
                step={1}
                value={[settings.fontSize]}
                onValueChange={([v]) => setSettings({ fontSize: v })}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            if (confirm(t.resetConfirm)) setSettings(defaultSettings);
          }}
        >
          {t.reset}
        </Button>
      </div>
    </AppLayout>
  );
}
