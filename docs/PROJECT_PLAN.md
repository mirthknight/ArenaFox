# Project Plan and Traceability

This plan tracks the requirements from the latest user brief and how the repo satisfies them. Update this file whenever tasks are completed or new needs arrive.

## Guiding Principles
- Keep login and dashboard styling consistent (colors, typography, shell chrome).
- Maintain responsive, mobile-friendly layouts with properly aligned elements across dashboard pages.
- Document Supabase-ready SQL schema and key queries alongside any feature work.
- Structure code so layouts, features, and services stay modular and reusable.
- Never commit sensitive information (use env placeholders only).

## Current State (what exists today)
- Authentication flow with Supabase session checks, guarded routes, and sign-out handling.
- Dashboard shell (header, sidebar, footer) themed to match the login experience.
- Profile directory UI with badges, verification state, like counts, enable/disable toggles, and admin edit controls backed by mock data.
- Admin-only guard and modal for editing member roles/status/verification and enablement.
- Supabase schema defined in `database/schema.sql` plus execution guidance in `database/EXECUTION_GUIDE.md`.
- Dashboard and admin tools now use a light, Scandinavian-inspired layout with simplified data tables, a mock-data notice bar, dynamic page titles, and modal-driven profile editing.
- Sidebar styling refreshed with clearer active highlights and admin nav badges, and the admin user management view is broken into reusable components for easier iteration.
- SPA-friendly routing guardrails were added (login redirect rules, authenticated 404, static 404.html fallback) to handle deep links like `/login` on a fresh load.
- Workspaces now have domain models backed by Supabase tables (workspaces, members, invites, players, events, change requests, activity, and comments), a singleton store with summary selectors, and persistence helpers for both Supabase and local storage.
- Workspace state auto-detects when Supabase is unavailable and loads seeded mock data so the UI stays usable during local development or outages.
- Workspace creation controls are surfaced on the dashboard home and sidebar, using the workspace store to seed new alliances even when Supabase is offline.

## Immediate Next Steps
- Wire the profile directory and admin management views to Supabase tables (accounts, profiles, badges, likes, invites) once backend data is available.
- Add invite creation and acceptance flows (no public signup) using the `user_invites` table.
- Replace mock profile/badge/like data with real queries (see `database/QUERIES.md`) and surface error handling in the UI.
- Audit dashboard styling against the login palette once data wiring is done to keep the UI consistent.

## Data & Operations References
- **Schema**: `database/schema.sql` (Supabase-compatible DDL for accounts, profiles, badges, likes, invites, and RLS policies).
- **Queries**: `database/QUERIES.md` (ready-to-run SQL snippets for profile listings, likes, badge assignments, and invite management).
- **Setup**: `database/EXECUTION_GUIDE.md` (how to apply the schema and provision admin credentials without committing secrets).

## How to Update This Plan
- Add or complete checklist items as work progresses.
- Note any schema or API changes and ensure the docs in `database/` stay aligned with the UI behavior.
- If new recurring requirements appear, copy them into `AGENTS.md` so future contributors follow the same constraints.
