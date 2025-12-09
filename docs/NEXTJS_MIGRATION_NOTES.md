# Next.js + TypeScript Migration Notes

These notes outline how to move Arena Fox from the current Vite SPA into a Next.js (App Router) and TypeScript stack without altering the visual design. Pair this with `docs/NEXTJS_MIGRATION_TODO.md` for task-level tracking.

## Goals
- Preserve existing UI/UX, responsiveness, and styling while gaining SSR/ISR benefits.
- Keep Mantine + Tailwind + Framer Motion stack intact where possible; only swap when Next.js compatibility requires it.
- Maintain Supabase integration with edge-friendly API routes and server components where appropriate.
- Replace mock data with Supabase-backed queries and mutations once endpoints and policies are ready.

## Target Stack Decisions
- **Next.js version**: 15 (App Router). Use `app/` directory, colocation for routes and metadata.
- **Rendering**: Default to server components for shell/layout; mark interactivity with client components for forms, modals, and animations.
- **Styling**: Keep Tailwind config, Mantine provider, and existing CSS variables. Global styles move to `app/globals.css` with minimal adjustments.
- **Routing**: Map existing SPA routes to nested `app/(dashboard)/...` segments; protect authenticated routes via middleware and Supabase session checks.
- **Data**: Use Supabase client in server actions for reads/mutations; keep an edge-safe browser client for client components that need live updates.
- **Env**: Migrate `VITE_` variables to `NEXT_PUBLIC_` (browser) and server-only `SUPABASE_SERVICE_ROLE_KEY` stored outside the repo.

## Compatibility Considerations
- **Mantine**: Wrap the app in `ColorSchemeScript`/`MantineProvider` inside `app/layout.tsx`; ensure hooks run only in client components.
- **Framer Motion**: Limit use to client components; animate presence inside dynamic routes where necessary.
- **Headless UI**: Keep components marked `"use client"` to avoid SSR mismatches.
- **Images/Assets**: Replace `public/` references with Next Image where performance gains are needed; retain static `public` paths for parity initially.
- **Routing Guards**: Implement `middleware.ts` for auth redirects (e.g., `/login` vs `/dashboard`), mirroring existing guard behavior.

## Layout Mapping (from SPA to Next.js)
- `src/main.tsx` → `app/layout.tsx` and `app/providers.tsx` for Mantine/Notifications.
- `src/App.tsx` routing shell → `app/(dashboard)/layout.tsx` with shared header/sidebar/footer.
- Feature pages (directory, admin, workspace, 404) → nested routes under `app/(dashboard)/`.
- Auth/login → `app/login/page.tsx` with client-side form handling and Supabase auth calls.

## Data Migration Guidance
- Replace local mock stores with server-side loaders backed by Supabase tables (`accounts`, `profiles`, `badges`, `likes`, `invites`, `workspaces`).
- Keep mock data loaders as dev-only fallbacks using `process.env.NODE_ENV === 'development'` feature flags; avoid shipping mock data to production bundles.
- Document any schema or query changes in `database/` to stay aligned with UI behavior.

## Performance/Optimization Notes
- Enable Next.js Image optimization for avatars/illustrations where available.
- Use route-level `dynamic = "force-static"`/`revalidate` settings for cacheable pages (public marketing) and `force-dynamic` for authenticated dashboards.
- Avoid large client bundles by keeping data fetching in server components and splitting interactive widgets into smaller client modules.
