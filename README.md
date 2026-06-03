# Bluepoint — Estimate OS (Demo)

A Next.js 15 (App Router, TypeScript, Tailwind) interactive demo of a multi-tenant estimate-automation dashboard for HousecallPro.

The whole UI is a working prototype:

- **Home** — automation status banner, three KPIs, and a live activity feed.
- **Connections** — paste a (fake) HousecallPro API token + click **Sign in with Microsoft** to walk through the onboarding flow.
- **Settings** — per-tenant configuration (labor rate, markup, ZIP, escalation timings, notifications).
- **Billing** — Stripe-style plan card with usage and tier comparison.

Everything is state-only — no backend yet. This is the design demo your client clicks through.

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (recommended)

The fastest path is **GitHub → Vercel import**:

1. Create a new repo on GitHub (private is fine).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "initial"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. Go to https://vercel.com/new, **Import** the repo. Vercel auto-detects Next.js — accept all defaults and click **Deploy**.
4. You'll get a `*.vercel.app` URL in ~60 seconds. Send that to your client.

### Alternative: Vercel CLI

```bash
npm i -g vercel
vercel        # follow prompts to create the project
vercel --prod # deploy to production
```

## Where to change content

- **Tenant name / owner** — `components/dashboard.tsx`, the `tenant` constant near the top.
- **Activity feed entries** — same file, the `automationEvents` array.
- **Product name** — search for `Bluepoint` across the project.
- **Webhook URL shown to users** — `HCPConnectionCard`, the `url` constant.
- **Plan pricing / tiers** — `BillingView`, the `plans` array.

## Stack

- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- lucide-react (icons)
- next/font (Manrope + Fraunces)
