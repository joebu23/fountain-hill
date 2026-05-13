# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server (Next.js + Payload CMS together)
npm run build            # Production build
npm run generate:types   # Regenerate payload-types.ts after schema changes
```

Docker deployment (from repo root):
```bash
docker compose -f docker/docker-compose.yml up -d --build
```

## Architecture

**Stack:** Next.js App Router + Payload CMS v3 + MongoDB Atlas + Tailwind CSS v3

Payload v3 runs *inside* Next.js — the admin UI and REST/GraphQL API are mounted at `app/(payload)/`. The two route groups are:
- `app/(frontend)/` — public site (campaign page at `[campaignSlug]`)
- `app/(payload)/` — Payload admin UI and API catch-alls

**Critical:** `withPayload` in `next.config.ts` is required; removing it causes cryptic build failures. All Payload data access uses the local API (`getPayload({ config })`), never HTTP fetch.

## Payload Schema

Three globals drive the campaign page:
- **`CampaignSettings`** — operational config: slug, goal amount, Givebutter ID, donate URL, `isLive` toggle
- **`CampaignPage`** — all visible content: hero, pillars, stats, services, impact, budget, FAQ, closing CTA, resource links
- **`SiteSettings`** — org-wide: logos, contact info, social links

Collections: `Media`, `Testimonials`, `FAQItems`, `ProjectComponents`, `Users`

Generated types live in `payload-types.ts` — never edit manually, run `generate:types` after any schema change.

## Routing

The campaign URL is CMS-controlled via `CampaignSettings.campaignSlug`. The dynamic route `[campaignSlug]/page.tsx` fetches this value at runtime and calls `notFound()` if it doesn't match. **Do not use `generateStaticParams`** — if the slug changes in the CMS, static routes would 404 until redeploy. Uses `revalidate = 300` (5-min ISR) instead.

When `isLive` is false, the page renders `<ComingSoon>` with no other CMS data fetched.

## Givebutter Integration

`lib/givebutter.ts` fetches live fundraising progress from `GET /campaigns/{id}`. Key field names: `raised` and `goal` (not `raised_amount`/`goal_amount`). The response may be direct or wrapped in a `data` envelope — the code handles both. Falls back to manually-entered values in `CampaignSettings` if the API fails.

## Component Organization

- `components/campaign/` — campaign-specific, not intended for reuse
- `components/shared/` — designed for reuse in Phase 2 (full site rebuild)
- `components/layout/` — `PageHeader` accepts `variant: 'campaign' | 'full'`; `full` variant is Phase 2

`StickyDonateCTA` and `FAQAccordion` are client components (`'use client'`). All others are server components.

## Design System

Custom Tailwind colors (see `tailwind.config.ts`): `brand-blue` (#2B6CB0), `brand-orange` (#E8723A), `surface-light` (#EBF4FB), `text-dark`, `text-muted`.

Fonts: Playfair Display (`font-serif`) for display/hero headlines, Inter (`font-sans`) for all other text. Font CSS variables must be applied to `<html>`, not `<body>`.

Section padding: `py-16 md:py-24`. Container: `max-w-6xl mx-auto px-4 md:px-8`.

Rich text fields use Payload Lexical. Render them with the React renderer from `@payloadcms/richtext-lexical/react` — do not parse raw Lexical JSON manually.

## Environment Variables

See `.env.example`. Required: `PAYLOAD_SECRET` (min 32 chars — shorter causes startup error), `DATABASE_URI` (MongoDB Atlas), `GIVEBUTTER_API_KEY`, `NEXT_PUBLIC_SITE_URL`.

## Deployment

Docker multi-stage build outputs a Next.js standalone bundle. `output: 'standalone'` in `next.config.ts` is required — without it the Docker standalone copy is empty. App container is behind Nginx (TLS termination, HTTP→HTTPS redirect). No local MongoDB — uses Atlas. SSL certs managed by Certbot on the host.

## Phase 2 Notes

Phase 2 adds the full `fountainhillcenter.org` site. Nothing from Phase 1 needs to be removed. Key additions: `PageHeader variant="full"` with nav, new collections (`Staff`, `Services`, `Events`, `BlogPosts`), new App Router pages. All `components/shared/` components are already designed as drop-ins for new page types.
