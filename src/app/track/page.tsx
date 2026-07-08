import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  HelpCircle,
  KeyRound,
  LogOut,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitRequestAction, trackLoginAction, trackLogoutAction } from "@/app/actions/track";
import { getAccessSession } from "@/lib/access-auth";
import { accessStore } from "@/lib/access-store";
import { BUSINESS } from "@/lib/business";
import { formatDateTime, relativeTime } from "@/lib/utils";

export const metadata = {
  title: "Track your RV",
  description: "Follow updates and request pickups or service with your JSC RV Service access code.",
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const sp = await searchParams;
  const accessId = await getAccessSession();
  const access = accessId ? await accessStore.getAccess(accessId) : null;

  if (!access || access.revoked) {
    return <TrackShell>{<TrackLogin error={sp.error} revoked={!!access?.revoked} />}</TrackShell>;
  }

  const [updates, requests] = await Promise.all([
    accessStore.listUpdates(access.id),
    accessStore.listRequests(access.id),
  ]);

  return (
    <TrackShell signedIn>
      <TrackPanel access={access} updates={updates} requests={requests} sent={!!sp.sent} />
    </TrackShell>
  );
}

/* ─────────────── shell ─────────────── */
function TrackShell({ children, signedIn }: { children: React.ReactNode; signedIn?: boolean }) {
  return (
    <div className="min-h-screen bg-cream bg-grain text-ink">
      <header className="border-b border-ink/10 bg-cream/95 backdrop-blur">
        <div className="container-wide flex h-20 items-center justify-between">
          <Link href="/" aria-label="JSC RV Service home">
            <Logo />
          </Link>
          {signedIn ? (
            <form action={trackLogoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </form>
          ) : (
            <a href={`tel:${BUSINESS.phoneRaw}`} className="font-mono text-xs uppercase tracking-[0.18em] text-ink/70 hover:text-garage">
              {BUSINESS.phone}
            </a>
          )}
        </div>
      </header>
      <main className="container-tight py-12 lg:py-16">{children}</main>
    </div>
  );
}

/* ─────────────── login ─────────────── */
function TrackLogin({ error, revoked }: { error?: string; revoked?: boolean }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <span className="inline-grid h-14 w-14 place-items-center rounded-full border-2 border-ink/85">
          <KeyRound className="h-6 w-6 text-garage" />
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight">Track your rig</h1>
        <p className="mt-3 text-ink/70">
          Enter the access code from Joe and the email it was sent to. No password,
          no signup.
        </p>
      </div>

      <form action={trackLoginAction} className="grid gap-4 border-2 border-ink/85 bg-paper p-7">
        {revoked && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            That access code is no longer active. Give the shop a call.
          </p>
        )}
        {error === "invalid" && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            We couldn&apos;t match that code and email. Double-check both and try again.
          </p>
        )}
        {error === "missing" && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Please enter both your code and email.
          </p>
        )}
        {error === "session" && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Your session expired — please sign in again.
          </p>
        )}
        <div className="grid gap-1.5">
          <Label htmlFor="code">Access code</Label>
          <Input id="code" name="code" required placeholder="JSC-XXXXXX" className="font-mono uppercase tracking-widest" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Sign in <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Don&apos;t have a code?{" "}
        <Link href="/contact" className="text-garage underline underline-offset-4">
          Get in touch
        </Link>{" "}
        or call {BUSINESS.phone}.
      </p>
    </div>
  );
}

/* ─────────────── panel ─────────────── */
function TrackPanel({
  access,
  updates,
  requests,
  sent,
}: {
  access: NonNullable<Awaited<ReturnType<typeof accessStore.getAccess>>>;
  updates: Awaited<ReturnType<typeof accessStore.listUpdates>>;
  requests: Awaited<ReturnType<typeof accessStore.listRequests>>;
  sent?: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* Header card */}
      <div className="border-2 border-ink/85 bg-paper p-7">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/55">
          Your account · {access.code}
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-3xl font-bold tracking-tight">{access.itemLabel}</h1>
          <Badge variant="success" className="text-sm">{access.currentStatus}</Badge>
        </div>
        <p className="mt-2 text-sm text-ink/60">Hi {access.customerName} — here&apos;s the latest.</p>
      </div>

      {sent && (
        <div className="flex items-center gap-2 border-2 border-patina/40 bg-patina/10 px-4 py-3 text-sm text-ink">
          <CheckCircle2 className="h-4 w-4 text-patina" />
          Request sent — Joe will follow up. You&apos;ll see it below.
        </div>
      )}

      {/* Request actions */}
      <div>
        <h2 className="font-display text-xl font-semibold">What do you need?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <RequestCard
            icon={<CalendarClock />}
            title="Plan a pickup"
            desc="Tell us the day you want it ready to roll."
          >
            <input type="hidden" name="type" value="pickup" />
            <Label htmlFor="requestedDate" className="text-xs">Pickup date</Label>
            <Input id="requestedDate" name="requestedDate" type="date" required />
            <Input name="details" placeholder="Any notes (optional)" />
          </RequestCard>

          <RequestCard
            icon={<Wrench />}
            title="Request service"
            desc="Something needs a look? Describe it."
          >
            <input type="hidden" name="type" value="service" />
            <Textarea name="details" rows={3} required placeholder="e.g. Slide-out is sticking, want the brakes checked…" />
          </RequestCard>

          <RequestCard
            icon={<HelpCircle />}
            title="Ask us anything"
            desc="Questions, changes, anything else."
          >
            <input type="hidden" name="type" value="other" />
            <Textarea name="details" rows={3} required placeholder="How can we help?" />
          </RequestCard>
        </div>
      </div>

      {/* Your requests */}
      {requests.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-semibold">Your requests</h2>
          <ul className="mt-4 space-y-2">
            {requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between border border-ink/15 bg-paper px-4 py-3 text-sm">
                <div>
                  <span className="font-semibold capitalize">{r.type}</span>
                  {r.requestedDate ? ` · ${r.requestedDate}` : ""}
                  {r.details ? <span className="text-ink/60"> — {r.details}</span> : ""}
                  <div className="text-[11px] uppercase tracking-wide text-ink/45">
                    {relativeTime(r.createdAt)}
                  </div>
                </div>
                <Badge variant={r.status === "new" ? "warning" : "muted"} className="capitalize">
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Update timeline */}
      <div>
        <h2 className="font-display text-xl font-semibold">Updates</h2>
        {updates.length === 0 ? (
          <p className="mt-4 border border-dashed border-ink/20 bg-paper px-4 py-8 text-center text-sm text-ink/55">
            No updates yet. We&apos;ll post here (and email you) as work happens.
          </p>
        ) : (
          <ol className="mt-4 space-y-5">
            {updates.map((u) => (
              <li key={u.id} className="relative border-l-2 border-garage/40 pl-5">
                <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-garage" />
                <div className="font-display text-lg font-semibold">{u.title}</div>
                {u.body && <p className="mt-1 text-sm text-ink/70">{u.body}</p>}
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                  {formatDateTime(u.createdAt)}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function RequestCard({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <form action={submitRequestAction} className="flex h-full flex-col border-2 border-ink/85 bg-paper p-5">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-cream [&_svg]:size-4">
        {icon}
      </span>
      <h3 className="mt-3 font-display text-lg font-semibold">{title}</h3>
      <p className="mb-3 text-xs text-ink/60">{desc}</p>
      <div className="grid flex-1 content-start gap-2">{children}</div>
      <Button type="submit" size="sm" className="mt-4 w-full">Send</Button>
    </form>
  );
}
