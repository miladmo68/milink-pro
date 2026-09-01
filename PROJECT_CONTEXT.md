# MIlink Client Portal — Project Context

## Purpose

MIlink.ca is a Toronto digital agency site. This repository now includes a client-facing portal (`/portal`) and an administrator workspace (`/admin`) alongside the marketing website. The UI is English; this document is the working context for future development.

## Product principles

- The customer should always know their next required action.
- The client sees only their own projects and client-visible records.
- Internal planning, notes and admin-only records are never visible to clients.
- Every important action produces an activity record and an email notification.
- Payment by Interac e-Transfer is **manually approved** after a client submits a receipt. Never automatically mark an e-Transfer as paid.

## Current application routes

| Route | Purpose |
| --- | --- |
| `/` | MIlink marketing site |
| `/portal` | Client workspace UI: overview, messages, files, project, approvals, payments |
| `/admin` | Admin UI: operations dashboard, leads, payment review, team access |

## Initial admin policy

| Email | Role |
| --- | --- |
| `miladmo68@gmail.com` | `super_admin` |
| `info@milink.ca` | `admin` |

Do not rely on a client-side email check for authorization. The production role must live in the database and be enforced through Row Level Security. `super_admin` can invite, promote, disable and remove other admins. `admin` can manage projects but should not change the super admin account.

## e-Transfer workflow

1. Admin issues an invoice with `payment_method = etransfer`.
2. Client sees the amount, invoice reference, and receiving email `info@milink.ca`.
3. Client sends the e-Transfer, then uploads a receipt (PDF/JPG/PNG).
4. System stores a `payment_submission` with state `pending_review` and emails admins.
5. Admin independently verifies the transfer in the bank.
6. Admin selects **Approve payment** or **Request clarification**.
7. Approval changes the invoice to `paid`, writes an audit event, and emails the client.

Never ask for or store a banking password or e-Transfer security answer in the portal.

## Before production

The presented interface is a polished front-end and interaction prototype. Live identities, database records, file storage and email delivery require the Supabase + Resend setup in `SUPABASE_SETUP.md`. Do not label it production-ready until the schema, RLS policies, environment variables, Google OAuth callback, file policies, and transactional email are configured and tested.

## Product design system (updated 2026-08-31)

The product UI is intentionally different from the marketing site: dense, calm and operational rather than decorative.

- Shared shell: responsive fixed sidebar, compact header, keyboard focus, light/dark theme and click-safe account menus.
- Visual language: midnight surfaces, pale-aqua as the primary action/status accent, restrained amber/red only for attention and destructive actions.
- Spacing: use an 8px rhythm, subtle borders and modest 8–16px card radii. Avoid oversized product typography and oversized empty cards.
- Desktop sidebar: 236px expanded, 64px collapsed rail. Rail labels must be available through accessible hover/focus tooltips.
- Sidebar and header popovers must render above the workspace—not clipped or hidden under content.
- Do not show sample data, decorative charts or technical schema/database errors to clients or administrators. Use truthful loading and helpful empty states instead.

## Information architecture to implement

### Client Portal

1. **Project Home** — one next required action, milestone timeline, status and recent activity.
2. **Project Brief** — saved multi-step wizard: business, goals, pages, features, visual direction, content, references, budget and timeline.
3. **Files** — drag/drop uploads, review state and explicit file requests.
4. **Messages** — client-visible project thread with attachment and unread state.
5. **Approvals** — design/proposal decisions with approve and request-change flows.
6. **Payments** — invoices plus e-Transfer receipt upload/status.

Client language must be simple and reassuring. A client should always know what to do next, and must never see internal notes or implementation errors.

### Admin Portal

1. **Action Center** — a priority queue for new leads, waiting clients, approvals and payment checks.
2. **Leads** — review intake, internal note, qualification and conversion into a project.
3. **Projects / Clients** — real detail views with owner, stage, due date, next action, assets and activity.
4. **Payments** — manual e-Transfer verification with receipt, decision, audit log and client notification.
5. **Settings** — super-admin managed admin access.

The Admin home should prioritize actionable live lists over analytics cards. Metrics are only useful when they lead to a clear drill-down or action.

## Phased delivery

### Phase 1 — foundations and visual quality

- Consolidate shared tokens/components for shell, navigation, status, popovers, empty/loading states and toasts.
- Remove technical error leakage and misleading placeholder data.
- Verify desktop, mobile, dark/light, keyboard and layering behavior.

### Phase 2 — client project workflow

- Persist project briefs and drafts.
- Implement client Project Home, required action cards, milestone timeline, files, messages, approvals and payment submission.

### Phase 3 — admin operations

- Implement the Action Center, real lead/project/client views and payment review queue.
- Add activity/audit logs and email notifications to every important lifecycle event.

### Phase 4 — production hardening

- Add project briefs, files, messages, approvals, activity, notification and payment-submission migrations.
- Configure Supabase Storage and RLS policies; test as client, admin and super admin.
- Configure transactional email delivery and test all auth callbacks, upload failures, mobile states and empty/error/loading states.

## Definition of done for every portal change

- `npm run build` passes.
- No console errors, route errors, inaccessible controls or clipping/layering regressions.
- Loading, empty, error and populated states are each intentionally designed.
- No secret, service-role key or private client data appears in tracked code, UI or documentation.

## Implemented redesign baseline

The active /portal and /admin routes now use src/components/portal/PortalExperience.jsx and its scoped CSS module rather than the earlier dashboard-card layout.

- Client active home: focused project-start action, guided milestone view, private-workspace reassurance and a four-step project-brief flow with local draft/progress feedback.
- Admin active home: Action Center, truthful zero-state metrics, priority queue, project lifecycle explanation and live-project empty state.
- The previous implementation remains in the route files as inactive legacy code during the migration. Do not revive it; extend the active shared experience and replace local prototype state with Supabase-backed records in Phase 2/3.

## Live intake and CRM update (2026-08-31)

- The active **Start your project brief** button and **Project brief** navigation now open a Supabase-backed intake form inside the existing client dashboard shell. It saves drafts, allows later edits, and submits the brief for MIlink review.
- The active Admin **Action Center** now queries real profile records inside the existing admin shell. It provides all registrations, accounts with no submitted project, submitted briefs, search, and a selected client-detail panel.
- Required database setup remains: run `supabase/schema.sql` first, followed by `supabase/portal_v2.sql`, in the Supabase SQL Editor. Without those migrations, the screens intentionally remain empty rather than showing fake example data.
- `portal_v2.sql` now backfills every existing `auth.users` account into `profiles` and grants clients restricted insert/update policies for only their own projects. This resolves the two common migration symptoms: an existing registered client not appearing in Admin and a client brief failing to save under RLS.
- The migration is explicitly rerunnable: every named policy used by the portal is dropped before it is recreated. Never remove customer rows to resolve a duplicate-policy error; rerun the latest `portal_v2.sql` instead.
- Project-brief submission validates required business name, main goal, pages and features. Drafts can still be saved before all required fields are completed.
- Next implementation scope: connect the existing Files, Messages, Approvals and Payments sidebar views to `project_assets`, `messages`, `project_requests`, `notifications` and payment records; retain the shared dashboard shell and never replace it with a standalone layout.

## Portal v3 implementation (2026-08-31)

- Active portal and admin routing remains unchanged; `PortalExperience.jsx` now provides the shared responsive SaaS shell, light/dark mode, collapse/mobile navigation, account menu, and in-app notification popover.
- Client workflow: a five-step autosaving brief with final-submit validation, goals/pages/features selection, design references, colours, timeline/budget, secure private uploads, roadmap and asset manager.
- Admin workflow: a real-time Supabase CRM for all profiles (including registered/no-brief clients), filters, search, detailed brief review, status changes, missing-information notifications, proposal fields and manual e-Transfer decisions.
- `supabase/portal_v3.sql` is the current additive and rerunnable migration. It repairs auth-to-profile synchronization, adds briefs/files/storage/outbox/notifications data, and replaces conflicting profile policies safely.
