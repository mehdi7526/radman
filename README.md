# رادمان (Radman)

Persian RTL e-commerce platform for water and air purification systems — storefront, checkout, customer accounts, and admin panel in one Next.js app.

## Overview

Radman is a full-stack shop for home and office purification products: RO water systems, HEPA air purifiers, and consumable filters. The UI is Persian-first (`lang="fa"`, `dir="rtl"`) with a premium industrial brand identity inspired by the Radman logo (navy, gold, dusty teal).

### Features

- **Storefront:** landing page, product catalog with search/filters, product detail, cart, checkout, order tracking
- **Customer accounts:** register, login, profile, order history
- **Admin panel:** products, categories, orders, coupons, shipping methods
- **SEO:** metadata, sitemap, robots, product JSON-LD
- **Accessibility:** skip link, keyboard nav, mobile menu, form labels, focus rings

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS 3 |
| Database | Prisma 6 + SQLite |
| Auth | Cookie sessions + bcrypt |
| Validation | Zod |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment
cp .env.example .env
# Edit .env — set SESSION_SECRET to a long random string

# 3. Database
npm run db:init
npm run prisma:seed

# 4. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Admin Login

| Field | Value |
|-------|-------|
| URL | `/admin/login` |
| Email | `admin@radman.local` |
| Password | `radman-admin-123` |

Change these in production via `.env` before going live.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:init` | Initialize SQLite database |
| `npm run prisma:seed` | Seed sample products and admin user |
| `npm run prisma:migrate` | Run Prisma migrations |

## Project Structure

```
src/
├── app/                  # Routes (App Router)
│   ├── page.tsx          # Landing page
│   ├── products/         # Catalog + product detail
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── account/          # Customer auth + orders
│   └── admin/            # Admin panel
├── components/
│   ├── brand/            # Logo, divider, gear motif
│   ├── site/             # Header, footer, mobile nav
│   ├── product/          # Product cards, gallery
│   ├── cart/             # Cart provider + UI
│   └── ui/               # Button, input, card, etc.
├── lib/
│   ├── brand.ts          # Brand constants
│   ├── queries/          # Cached product queries
│   ├── auth/             # Session helpers
│   └── format.ts         # fa-IR price/date formatting
prisma/
├── schema.prisma         # Data models
└── seed.ts               # Sample data
public/
└── brand/                # Radman logo assets
```

## Design System

Design direction: **Filtration Precision** — cold glacier surfaces, deep navy typography, gold accent, sharp 2px geometry, hairline rules. No decorative gradients or pill-shaped cards.

### Color Tokens

| Token | Role |
|-------|------|
| `deep-ink` | Headlines, hero background |
| `glacier` | Page background |
| `porcelain` | Cards, header |
| `atlas` | Primary brand / buttons |
| `oxygen` | Links, secondary accent |
| `signal` | Single CTA accent (gold) |

Defined in `src/app/globals.css` and mapped in `tailwind.config.ts`.

### Typography

- **Font:** IranYekan FaNum (Persian + native numerals)
- **Headings:** `text-balance`, bold (700)
- **Body:** 16px base, `text-pretty`
- **Prices/specs:** `tabular-nums`

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| `xs` | 375px | Mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1440px | Wide / container max |

### Brand Components

- `Logo` / `LogoMark` — header, footer, hero, admin
- `BrandDivider` — section separators
- `BrandGear` — industrial accent icon

Logo file: `public/brand/radman-logo.png`

## Development Guidelines

### RTL & Persian

- Root layout sets `lang="fa"` and `dir="rtl"`
- Use `dir="ltr"` only for emails, slugs, tracking codes, and numeric inputs where needed
- Format prices and dates with helpers in `src/lib/format.ts`
- UI copy is hardcoded Persian (no i18n framework)

### Code Conventions

- Use existing Tailwind tokens — avoid raw hex in components
- Reuse `src/components/ui/*` primitives before adding new ones
- Server Components by default; add `"use client"` only when needed (cart, mobile nav)
- Product data via `src/lib/queries/products.ts` (cached)
- Server actions for checkout and admin mutations

### Accessibility

- Icon-only buttons must have `aria-label`
- Forms need visible or `sr-only` labels
- Maintain heading hierarchy (h1 → h2 → h3)
- Respect `prefers-reduced-motion` (see `globals.css`)

### Git & Deploy Notes

- Never commit `.env`, `prisma/dev.db`, or `.next`
- Replace mock payment (`PAYMENT_PROVIDER=mock`) before production
- Set `NEXT_PUBLIC_SITE_URL` to your production domain
- Consider PostgreSQL instead of SQLite for production

## Environment Variables

See `.env.example` for all options:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite path (default `file:./dev.db`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `SESSION_SECRET` | Session signing secret |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial admin credentials |
| `PAYMENT_PROVIDER` | `mock` (dev) |
| `STORAGE_PROVIDER` | Image storage mode |

## License

Private project.
