# Deployment & launch checklist — JSC RV Service

Everything below is a one-time setup. The site runs today without any of it
(demo mode + in-memory storage); these steps make it real.

## 1. Environment variables (Vercel → Settings → Environment Variables)

Copy from `.env.example`. The must-haves for production:

| Variable | Required? | Notes |
|---|---|---|
| `AUTH_SECRET` | **Yes** | `openssl rand -base64 32`. App **refuses to run** admin/portal without it (fails closed). |
| `ADMIN_PASSWORD` | Yes (real deploy) | Password for the owner sign-in at `/login`. |
| `DEMO_MODE` | Optional | `true` only on the sales-demo deploy. **Omit** for Joe's real site (demo login stays off). |
| `NEXT_PUBLIC_SUPABASE_URL` | For persistence | From the Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For persistence | Publishable key. |
| `SUPABASE_SERVICE_ROLE_KEY` | For persistence | **Secret.** Supabase → Project Settings → API → `service_role`. Until set, customer-access data is in-memory only. |
| `RESEND_API_KEY` | For emails | From resend.com. Until set, emails are logged/skipped (never error). |
| `INQUIRY_TO_EMAIL` | Recommended | Where inquiries + requests go. Default `joe@jscrvrepair.com`. |
| `INQUIRY_FROM_EMAIL` | For emails | Must be a Resend-verified domain, e.g. `JSC RV Service <inquiries@jscrvrepair.com>`. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Primary domain, `https://jscrvrepair.com`, for SEO/OG + email links. |

## 2. Supabase (project: **JSCRvService**, ref `uaksqgpkmxwhqupjcuzh`)

- Schema already applied (`supabase/migrations/0001_customer_access.sql`).
- Grab the **service_role** key from Project Settings → API and set
  `SUPABASE_SERVICE_ROLE_KEY`. That flips the customer-access feature from
  in-memory to persistent. Nothing else changes.

## 3. Domains (Vercel → Settings → Domains)

Primary: **jscrvrepair.com** (set as the project's primary domain).
Add each of the others and choose **"Redirect to jscrvrepair.com"**:

- `warsawrvrental.com`
- `joeknowscampers.com`
- `campnowrvrentals.com`
- `campnowrv.com`

For each domain, point DNS at Vercel at the registrar:
- Apex (`@`): A record → `76.76.21.21` (or the ALIAS/ANAME Vercel shows)
- `www`: CNAME → `cname.vercel-dns.com`

Vercel shows the exact records when you add the domain. These RV-rental domains
are good SEO assets — later they can become dedicated rental landing pages
instead of plain redirects.

## 4. Email (Resend)

1. Add & verify `jscrvrepair.com` in Resend (DNS records).
2. Set `RESEND_API_KEY` and switch `INQUIRY_FROM_EMAIL` to an address on the
   verified domain.
3. Inquiries and customer requests notify `INQUIRY_TO_EMAIL`; customers get
   emails when Joe posts an update or sends their access code.

## 5. Sanity check after deploy

- `/` `/services` `/storage` `/rentals` `/about` `/contact` load.
- `/login` → owner password works; demo accounts hidden (if `DEMO_MODE` unset).
- Admin → Customer Access → create a code → post an update.
- `/track` → sign in with that code + email → request a pickup.
- Confirm the inquiry/request emails arrive at `INQUIRY_TO_EMAIL`.
