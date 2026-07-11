import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck, UserCog, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/brand/logo";
import { DEMO_ACCOUNTS, isDemoMode } from "@/lib/auth";
import { loginAsDemoUser, loginWithPasswordAction } from "@/app/actions/auth";

export const metadata = { title: "Sign In — Customer Portal" };

const groups = [
  {
    label: "Customer",
    icon: <UserCog className="h-4 w-4" />,
    color: "info" as const,
    accent: "border-info/30 bg-info/5",
  },
  {
    label: "Staff",
    icon: <Wrench className="h-4 w-4" />,
    color: "warning" as const,
    accent: "border-warning/30 bg-warning/5",
  },
  {
    label: "Admin",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "destructive" as const,
    accent: "border-destructive/30 bg-destructive/5",
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const demo = isDemoMode();

  // On the live site, /login is the customer login. The demo account picker
  // only exists when demo mode is on (for showing the platform to a prospect).
  // The admin/owner sign-in is not here — it lives at /admin.
  if (!demo) redirect("/track");

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-foreground p-12 text-background md:flex md:flex-col md:justify-between">
        <Link href="/" aria-label="JSC RV Service home">
          <Logo invert />
        </Link>
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight">
            One log-in. Everything for your RV.
          </h2>
          <p className="mt-4 max-w-md text-background/80">
            Track storage, request a pickup prep, approve quotes, and message the
            shop — all from one place. Built for customers; powered by the team
            that keeps your rig running.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-background/80">
            {[
              "Schedule pickup with your prep list",
              "Approve quotes & view invoices",
              "Real-time messages from Joe & the techs",
              "Photos and notes from every visit",
            ].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <ArrowRight className="h-4 w-4 text-primary" />
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-background/60">
          © {new Date().getFullYear()} JSC RV Service · Leesburg, IN
        </div>
      </div>

      <div className="flex flex-col bg-background p-6 md:p-12">
        <div className="md:hidden">
          <Link href="/" aria-label="JSC RV Service home">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {demo ? (
              <Badge variant="muted" className="mb-3">Demo mode</Badge>
            ) : (
              <Badge variant="muted" className="mb-3">Staff sign-in</Badge>
            )}
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {demo ? "Pick an account to demo" : "Sign in to the shop"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {demo
                ? "Each account drops you into a real workspace with sample customers, jobs, and history. Switch any time from the menu."
                : "Enter the owner password to reach the admin panel and inquiries."}
            </p>

            {/* ── Owner / staff password sign-in ── */}
            <Card className="mt-6 border-2">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Owner sign-in
                  </span>
                </div>
                <form action={loginWithPasswordAction} className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {error === "invalid" && (
                    <p className="text-xs text-destructive">
                      Incorrect password. Try again, or call the office.
                    </p>
                  )}
                  <Button type="submit" className="w-full">
                    Sign in <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* ── Demo accounts (demo mode only) ── */}
            {demo && (
              <>
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    or try a demo account
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid gap-3">
                  {groups.map((g) => {
                    const accounts = DEMO_ACCOUNTS.filter((a) =>
                      g.label === "Customer"
                        ? a.role === "customer"
                        : g.label === "Admin"
                          ? a.role === "admin"
                          : a.role === "manager" || a.role === "tech",
                    );
                    return (
                      <div key={g.label} className={`rounded-lg border ${g.accent} p-4`}>
                        <div className="mb-3 flex items-center gap-2">
                          {g.icon}
                          <span className="text-xs font-semibold uppercase tracking-wide">
                            {g.label}
                          </span>
                        </div>
                        <div className="grid gap-2">
                          {accounts.map((a) => (
                            <form key={a.id} action={loginAsDemoUser}>
                              <input type="hidden" name="userId" value={a.id} />
                              <button
                                type="submit"
                                className="group flex w-full items-center justify-between rounded-md border bg-background px-3 py-2.5 text-left transition-all hover:border-primary hover:shadow-sm"
                              >
                                <div>
                                  <div className="text-sm font-semibold group-hover:text-primary">
                                    {a.label}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {a.subtitle}
                                  </div>
                                </div>
                                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                              </button>
                            </form>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Card className="mt-6 border-2">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground">
                      <strong className="text-foreground">Tip:</strong> Start as
                      Jane (customer) to see the trip-prep flow, then switch to Joe
                      to see how it lands in the admin queue.
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <div className="mt-6 rounded-lg border bg-secondary/30 p-4 text-center">
              <div className="text-sm font-semibold">Bought something from Joe?</div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Track your RV and request pickups with your access code — no account needed.
              </p>
              <Link
                href="/track"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Track your RV <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                ← Back to website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
