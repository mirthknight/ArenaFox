# Next.js Migration TODO

Actionable checklist to move from Vite SPA to Next.js + TypeScript while keeping the UI unchanged (unless intentional improvements are documented).

## Phase 0 — Inventory & Prep
- [ ] Snapshot current routes, layouts, and providers (Mantine, Notifications, Supabase) to mirror in Next layout tree.
- [ ] Confirm Tailwind config works under Next (PostCSS, content paths, CSS variables).
- [ ] Audit mock data usage across dashboard/admin/profile/workspace screens.
- [ ] Validate Supabase schema/docs alignment with intended data flows.

## Phase 1 — Next.js Skeleton
- [ ] Initialize Next.js 15 project with `app/` directory and TypeScript.
- [ ] Add Tailwind, Mantine, Framer Motion, Headless UI dependencies and verify SSR compatibility flags.
- [ ] Create `app/layout.tsx`, `app/providers.tsx`, and `app/globals.css` mirroring current theme.
- [ ] Implement `middleware.ts` for auth redirects (login ↔ dashboard) using Supabase session checks.

## Phase 2 — Route & Layout Porting
- [ ] Map dashboard shell to `app/(dashboard)/layout.tsx` with header/sidebar/footer parity.
- [ ] Port public/login route to `app/login/page.tsx` with identical form and animations.
- [ ] Port feature pages (profile directory, admin tools, workspace flows, 404) into nested routes, keeping component structure and responsive breakpoints.
- [ ] Preserve existing motion/animation cues in client components only.

## Phase 3 — Data Wiring (Supabase)
- [ ] Replace mock stores with server actions/route handlers that query Supabase tables (`accounts`, `profiles`, `badges`, `likes`, `invites`, `workspaces`).
- [ ] Add optimistic UI patterns or revalidation hooks for likes, badges, and enable/disable toggles.
- [ ] Document any new SQL or policy adjustments in `database/schema.sql` and `database/QUERIES.md`.
- [ ] Keep dev-mode mock loaders behind feature flags to avoid breaking local workflows.

## Phase 4 — Optimization & QA
- [ ] Enable Next.js Image for avatars/illustrations where beneficial without changing layout dimensions.
- [ ] Review bundle size and split interactive widgets into smaller client components.
- [ ] Run accessibility and responsive checks to confirm UI parity across breakpoints.
- [ ] Update README and deployment notes for Next.js commands and environment variables.

## Phase 5 — Cutover
- [ ] Remove unused Vite-specific configs and entry points after parity validation.
- [ ] Verify Supabase credentials handling (client vs server) and secret storage for deployment targets.
- [ ] Tag release notes summarizing migration scope and remaining follow-ups.
