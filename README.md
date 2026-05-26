# JSC RV Repair — Demo Website & Operations Platform

A complete demo built for **JSC RV Repair** (Leesburg, IN) — owner Joe Crawford —
covering marketing site, customer portal, and full back-office admin console.

> All data is in-memory mock data. No database. Demo only.

---

## What's in the demo

### Public marketing site
- **Home** — hero, services overview, storage spotlight, testimonials, lead-capture form
- **Services** — repair, maintenance, appliances, body/insurance work, service packages
- **Storage** — pricing tiers, pickup-prep differentiator, FAQ, reserve form
- **About Joe** — story, crew, values
- **Contact** — full contact card + lead form
- **Hero & shop imagery** generated with Higgsfield (Soul Location model)

### Customer portal `/portal`
Log in as **Jane Whitcomb** to see:
- **Dashboard** — RVs, active jobs, open quotes, balance, upcoming pickup, messages
- **My RVs** — full details, current spot, service history
- **Schedule Pickup** — pick prep items (tires, battery, water, propane, wash, etc.)
  and notes; demonstrates JSC's signature "pickup-prep" service
- **Quotes** — list + detail page with approve/decline flow
- **Messages** — chat-bubble thread view with the shop; start new threads
- **Billing** — invoices, balance, payments-on-file

### Admin console `/admin`
Log in as **Joe Crawford** to see:
- **Dashboard** — KPIs (active jobs, lot occupancy, A/R, leads), revenue chart, today's bay, activity feed, job pipeline
- **Jobs** — full kanban board across 7 statuses, work-order detail with checklist, notes, status moves, time tracking, linked quote
- **Schedule** — weekly grid of staff shifts + scheduled jobs + upcoming pickups
- **Pickups** — manage pickup-prep requests (pending → confirmed → prepping → ready → picked-up → returned)
- **Storage Lot** — visual lot map for zones A, B, C, and Boat; occupied/available state, monthly revenue per spot
- **Customers** — list + detail (RVs, jobs, financial)
- **RVs** — fleet view across all customers
- **Quotes** — list + printable detail (estimate format with line items + tax)
- **Invoices** — list + printable detail + record payment form
- **Messages** — shared inbox for the shop, thread participants visible
- **Leads** — CRM-style lead pipeline with status updates (new → contacted → scheduled → converted → lost)
- **Analytics** — YTD KPIs, revenue/expense area chart, tech workload bars, expense donut
- **Accounting** — Monthly P&L table, recent expenses list
- **Staff** — crew cards with skills, rates, upcoming shifts, YTD performance

---

## Demo accounts

The login page (`/login`) is a one-click account picker. No passwords.

| Email | Role | Demo flow |
|-------|------|-----------|
| `demo@customer.com` (Jane Whitcomb) | customer | Has stored RV at A-02, confirmed pickup, prep checklist, paid invoice + open invoice, message thread with shop |
| `joe@jscrvrepair.com` | admin | Full access to everything |
| `tina@jscrvrepair.com` | manager | Same as admin (office) |
| `hank@jscrvrepair.com` | tech | Limited mutations (jobs, notes) |
| `danny@jscrvrepair.com` | tech | Same as Hank |
| `eddie@jscrvrepair.com` | tech | Yard/prep technician |

**Recommended demo flow:**
1. Visit `/` to see the marketing site
2. Click "Customer Login" → pick Jane → schedule a pickup, approve the open quote
3. Use the role switcher (top right) → pick Joe → see the pickup land in `/admin/pickups`
4. Navigate to `/admin/jobs` to see the kanban; click any job for detail
5. Visit `/admin/analytics` for the charts and `/admin/accounting` for P&L

---

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** strict
- **Tailwind CSS 4** (CSS-first config in `globals.css`)
- **shadcn-style primitives** built on **Radix UI** in `src/components/ui/`
- **Recharts** for analytics
- **react-hook-form + zod** for form validation
- **sonner** for toast notifications
- **date-fns** + **nanoid**
- **Cookie-based demo auth** (`src/lib/auth.ts`)
- **In-memory mutable store** (`src/lib/store.ts`) with seed data (`src/lib/seed.ts`)
- **Higgsfield MCP** for hero/shop imagery

### File map

```
src/
├── app/
│   ├── (marketing)/        # public site
│   ├── (portal)/portal/    # customer portal (role: customer)
│   ├── (admin)/admin/      # staff console (role: tech|manager|admin)
│   ├── login/              # demo account picker
│   ├── actions/            # server actions
│   └── globals.css         # Tailwind 4 + theme tokens
├── components/
│   ├── brand/              # Logo
│   ├── marketing/          # Header/Footer/LeadForm
│   ├── portal/             # Pickup form, thread view, quote decision, new-thread dialog
│   ├── admin/              # Charts, status forms, payment, lead status
│   ├── shell/              # Sidebar, Topbar, RoleSwitcher
│   └── ui/                 # shadcn-style primitives
└── lib/
    ├── business.ts         # Single source of truth for business facts
    ├── types.ts            # Domain types
    ├── seed.ts             # Realistic seed data
    ├── store.ts            # In-memory data access layer
    ├── auth.ts             # Cookie session
    └── utils.ts            # cn, formatters
```

---

## Run it

```bash
cd website
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build (passes)
npm start          # production server
```

---

## What's intentionally NOT here

- **Real database** — everything is mock; the data layer in `src/lib/store.ts` is the single seam to swap for Postgres + Drizzle, Supabase, or any real backend
- **Real auth** — the cookie-based picker is for demo only; swap for NextAuth / Supabase Auth / Clerk on real launch
- **Vercel / cloud** — no deployment configured; deploy when the client signs
- **Payment processing** — the "Record payment" form is local-only; integrate Stripe/Square when ready
- **Email / SMS** — message threads are in-app; integrate Resend + Twilio for real notifications

---

## Generated imagery

Hero shop photo and shop-interior shot were generated via Higgsfield's Soul Location model.
Files live in `public/images/`.

---

Built for Sweet Dreams Music LLC client engagement. Demo-ready May 2026.
