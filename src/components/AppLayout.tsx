import { Link, useRouterState } from "@tanstack/react-router";
import { Home, CalendarDays, Settings as SettingsIcon } from "lucide-react";
import { useWork } from "@/lib/work-store";
import { useT } from "@/lib/i18n";
import type { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const { settings } = useWork();
  const t = useT(settings.lang);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { to: "/", label: t.home, icon: Home },
    { to: "/calendar", label: t.calendar, icon: CalendarDays },
    { to: "/settings", label: t.settings, icon: SettingsIcon },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-lg font-semibold tracking-tight">{t.appName}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-border bg-background">
        <div className="mx-auto grid max-w-2xl grid-cols-3">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
