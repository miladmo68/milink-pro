# MiLink — Single Source of Truth

> **Audit status:** 2026-09-02. This document describes the codebase as audited. Applied Supabase migrations must still be verified in each real environment.

## 1. Strict Development Guardrail: MARKETING FROZEN (Zero-Touch Policy)

### CRITICAL RULE — MARKETING IS FINALIZED AND FROZEN

All Marketing / Landing-page components, styles, copy, animations, SEO metadata, and layouts are **100% finalized and frozen**. This includes `/`, hero sections, services, work, pricing, testimonials, contact, navigation, footer, and marketing route pages.

Under **no circumstances** may future automated or manual work alter, refactor, restyle, reorganize, or otherwise touch marketing files unless the user explicitly and unambiguously authorizes marketing work. Dashboard styling, theming, logic, and bug fixes must be isolated to `/admin`, `/portal`, authentication pages, dashboard-specific API routes, and dashboard-specific wrappers/components.

### Frozen marketing scope

- `src/app/page.jsx` and the landing-page composition.
- `src/sections/**`: `Hero`, `Services`, `Work`, `Pricing`, `Testimonials`, `Contact`, and `FAQ`.
- Marketing layout/components: `Navbar`, `Footer`, `PageShell`, `SectionPage`, `SEO`, `CanvasBackground`, `CountUp`, `Lightbox`, `Modal`, `LogoFancy`, `ScrollParallax`.
- Marketing routes: `/contact`, `/pricing`, `/services`, `/services/[id]`, `/testimonials`, `/work`.
- Marketing data/copy in `src/data/content.js` and public marketing assets.
- Root marketing metadata/structured data, except for an explicitly authorized auth/security continuity fix.

### Permitted dashboard scope

- `src/app/portal/**`, `src/app/admin/**`, `/auth/callback`, `/forgot-password`, `/reset-password`.
- `src/components/portal/**`, `src/components/auth/**`, dashboard API routes, and Supabase migrations.
- Dashboard-only CSS selectors and shared dashboard utilities. Do not use broad global CSS to repair a dashboard-only issue.

---

## 2. Platform Identity, Purpose & Capabilities

### What MiLink does

MiLink.ca is a Toronto web design and development agency. This repository combines the public agency site with a private client-delivery platform.

The authenticated product has two experiences:

1. **Client Portal (`/portal`)** — clients submit and revise a website brief, upload assets, receive project/file requests, communicate with MiLink, follow milestones, review approvals, and track payment-related steps.
2. **Admin Command Center (`/admin`)** — MiLink operators see registrations and briefs, triage work, inspect project records, update lifecycle stages, request assets, send proposals, communicate, and review manual e-Transfer states.

The business value is a single private project workspace replacing fragmented email threads, file links, and unstructured requirements gathering.

### What MiLink does not do

- It is not an autonomous website generator, CMS, hosting provider, or domain registrar.
- It does not automatically settle card payments or Interac e-Transfers. e-Transfer confirmation remains an intentional human admin decision after bank-side verification.
- It is not a public social network, public file drive, or marketplace.
- It must not reveal internal notes, technical/database errors, secrets, service-role keys, or another client's information to a client.
- It must never ask for or retain bank passwords, Interac security answers, or unrelated credentials.

### Core user journey

1. An anonymous visitor explores the frozen marketing site and chooses a portal/project-start route.
2. They create an account via email/password or Google OAuth. An Auth trigger creates/updates the matching `profiles` record.
3. Email/password users verify their email before entering the workspace. Existing users can recover a password; Google users can add a password in profile settings.
4. The client enters `/portal`, completes a multi-step website brief, and saves drafts during the process.
5. Final submission changes the brief to `submitted`; in-app notifications and SMTP email alert MiLink.
6. Admins inspect the brief, update status, request assets/information, prepare a proposal, and communicate in the project thread.
7. Clients see real-time status/file/message activity, upload voluntary or requested assets, and reply to requests.
8. Admins accept/dismiss file-request submissions, manually review payment states, and move the project through review, development, client review, and completion.

---

## 3. Tech Stack & Infrastructure

### Framework and libraries

| Area | Current implementation |
| --- | --- |
| Framework | Next.js `14.2.0`, **App Router**, under `src/app`. |
| UI runtime | React `18.3.1` / `react-dom` `18.3.1`. |
| Styling | Tailwind CSS `3.4.17`, CSS Modules, and legacy/global CSS. |
| Icons/motion | Lucide React, Heroicons, Framer Motion. |
| UI dependency | DaisyUI is installed and custom themes are defined. |
| Files | `jszip` and `file-saver` are installed for asset export/download workflows. |
| Email | Nodemailer `7.0.6` via Node.js Next route handlers. |
| Build | `npm run build` runs `next build`; `reactStrictMode` is enabled. |

### Supabase architecture

Supabase provides:

- **Auth:** email/password, confirmation links, recovery, Google OAuth, identities and metadata.
- **PostgreSQL:** profiles, project briefs, files, messages, requests, notifications, legacy projects/invoices, and email outbox records.
- **RLS:** owner-versus-admin authorization.
- **Realtime:** client brief, CRM, notification, unread message, messages, files, and file-request synchronization where migrations have been applied.
- **Storage:** private `project-assets` and `portal-files` buckets.

Browser access is centralized at `src/lib/supabase/client.js` through `getSupabaseBrowserClient()`, which returns an `@supabase/ssr` browser client only if the public URL and anonymous key exist. Server-side privileged routes create isolated `@supabase/supabase-js` clients and keep the service-role key server-only.

### Styling and theme system

- Tailwind `darkMode` is class based.
- `src/hooks/useTheme.js` toggles root `dark`, `mode-dark`, and `mode-light` classes plus the DaisyUI `data-theme` attribute.
- `src/config/theme.js` defines custom `milinklight` and `milinkdark` palettes.
- The active shared Dashboard shell is `src/components/portal/PortalExperience.jsx`, styled principally by `PortalExperienceV4.module.css` token variables: background, surface, text, muted, line, and accent.
- The shell also imports targeted overview, modal, notification, sidebar-seam, and stage-control refinement modules.
- `src/app/globals.css` contains base/marketing styles and some dashboard `mi-*` selectors. It is a shared risk area: dashboard-only visual fixes should prefer the actual dashboard component/CSS module.

### State and data fetching

- Dashboard state uses React hooks directly: `useState`, `useEffect`, `useCallback`, `useMemo`, and `useRef`.
- There is no Redux, Zustand, React Query, server-action data layer, or separate repository/data-access abstraction today.
- Browser components query Supabase directly under RLS; privileged deletion and email delivery go through API routes.
- The Admin CRM uses a stable callback and debounced Realtime refresh. It excludes admin/super-admin profile records from client metrics/listing.
- Error handling should set state and render a designed error message. Never use page reloads, hard redirects, or unconditional `router.refresh()` as query-failure recovery.

### Environment variables

Do not put values/secrets in source control or this document. `.env.example` documents these names:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe anonymous key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only administrative key. |
| `NEXT_PUBLIC_SITE_URL` | Canonical app URL, normally `https://milink.ca`. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Unified Nodemailer SMTP config. |
| `TO_EMAIL` | Comma-separated agency/admin alert recipients. |
| `REPLY_TO_EMAIL` | Default transactional reply address. |
| `BUSINESS_ADDRESS` | Email footer business address. |
| `EMAIL_DISPATCH_SECRET` | Optional trusted server-job secret for `/api/send-email`. |

`/.env.local` is local-only and must never be committed. Supabase Redirect URLs must allow the exact callback routes for both localhost and production.

---

## 4. Architecture & Project Tree

```text
.
├── public/                         # Static logo, brand, image and marketing assets
├── src/
│   ├── app/                        # Next.js App Router pages/layouts/route handlers
│   │   ├── admin/                  # Admin route wrapper and inactive legacy prototype source
│   │   ├── api/                    # Contact, transactional email, privileged deletion
│   │   ├── auth/callback/          # Auth-code exchange callback
│   │   ├── portal/                 # Client route wrapper and inactive legacy prototype source
│   │   ├── forgot-password/        # Recovery request page
│   │   ├── reset-password/         # Secure password update page
│   │   ├── contact/, pricing/, services/, testimonials/, work/ # FROZEN marketing routes
│   │   ├── globals.css             # Shared global styles; includes dashboard selectors
│   │   ├── layout.jsx              # Root fonts, metadata, global layout
│   │   ├── page.jsx                # FROZEN landing page + limited auth-code safety forward
│   │   └── robots.js, sitemap.js
│   ├── components/
│   │   ├── auth/                   # SecureAccess, PasswordRecovery
│   │   ├── portal/                 # Active shared Portal/Admin product and CSS modules
│   │   ├── ui/                     # UI helpers, e.g. CustomCursor
│   │   └── [marketing components]  # FROZEN unless marketing work is explicitly authorized
│   ├── config/                     # Site and theme configuration
│   ├── data/                       # FROZEN marketing content data
│   ├── hooks/                      # Theme helper
│   ├── lib/supabase/               # Browser Supabase client factory
│   └── sections/                   # FROZEN marketing sections
├── supabase/                       # Safe/rerunnable SQL migrations and repairs
├── package.json
├── tailwind.config.js
├── next.config.js
└── PROJECT_CONTEXT.md
```

### Route responsibilities

| Route | Responsibility |
| --- | --- |
| `/` | Frozen marketing landing. On a stray auth `?code=`, it forwards the user on the same origin to `/auth/callback`. |
| `/portal` | Client route wrapper; unauthenticated users see `SecureAccess`, authenticated users see `ClientExperience`. |
| `/admin` | Admin route wrapper; renders admin sign-in or `AdminExperience`. |
| `/auth/callback` | Exchanges Supabase code/session, resolves role, redirects to portal/admin. |
| `/forgot-password` | Password reset request screen. |
| `/reset-password` | Validates recovery session/code and sets new password. |
| `/api/send-email` | Authenticated/trusted transactional event dispatcher through Nodemailer. |
| `/api/contact` | Frozen marketing contact-form email route, except authorized delivery/security work. |
| `/api/admin/delete-client` | Privileged client records/storage cleanup and Supabase Auth user deletion. |

### Active shared dashboard implementation

- `src/components/portal/PortalExperience.jsx` is the **active dashboard application**. It owns the shared `Shell`, sidebar/header, profile menu, notification popover, client tabs, admin tabs, CRM screens, messages, and modals.
- `src/components/portal/PortalExperienceV4.module.css` is the primary active dashboard CSS module.
- Supporting active style modules include `PortalExperienceOverviewRefinements.module.css`, `PortalExperienceModal.module.css`, `PortalExperienceModalRefinements.module.css`, `NotificationPopover.module.css`, `PortalSidebarSeam.module.css`, and `PortalStageAction.module.css`.
- `src/app/portal/ClientPortal.jsx` and `src/app/admin/AdminPortal.jsx` are route adapters. They retain prototype JSX below current return paths; it is inactive and must not be revived.
- `src/components/auth/SecureAccess.jsx` owns email/password auth, confirmation resend, Google OAuth initiation, and dynamic origin logic.
- `src/components/auth/PasswordRecovery.jsx` owns password-recovery request and reset logic.

### Legacy/debt inventory

- `DataPortals.jsx` / `DataPortals.module.css` and older portal modules (`PortalExperience.module.css`, `V3`, `V5`, `PortalRailFix`) are prototype/historical material. Verify their import graph before deleting anything.
- `useTheme.js` includes an old commented implementation before its active implementation.
- Current dashboard styling mixes CSS Modules, `mi-*` global selectors, and inline style objects. It works but makes parity and future maintenance harder.

---

## 5. Dashboard Deep Dive & Capabilities Breakdown

### Client Portal (`/portal`)

#### Shared shell

- Responsive desktop sidebar, collapsed icon rail, mobile drawer, header theme control, notification bell, user/account popovers, sign-out, and unread-message indicator.
- Mobile dashboard standards: the sidebar becomes an auto-closing slide-over drawer; all navigation and account/support targets keep a minimum 44px touch target. CRM filters remain touch-scrollable, CRM rows reflow into stacked cards, payment actions wrap rather than overflow, and chat composers remain reachable while scrolling.
- Client query state maps to `?tab=overview`, `?tab=brief`, `?tab=assets`, `?tab=messages`, and `?tab=profile`.
- Account settings are placed in the account/user menu rather than duplicated in primary nav where configured.

#### Overview

- **No submitted brief:** hero invites the client to start a brief and shows an estimated completion time.
- **Active project:** hero becomes a command card with business/project name, current stage, stage explanation, `View / edit project brief`, and `Message MiLink team` actions.
- Roadmap stages: brief submitted, MiLink review, proposal & scope, development, client review, launch.
- **Onboarding Readiness:** when a client has a brief, the Overview includes a live readiness card beside the roadmap. It tracks vector logo/brand assets, page copywriting, domain/DNS details, and colour/typography approval. Each item can be toggled between `pending` and `ready`, displays completion percentage/progress, auto-saves optimistically, and synchronizes with the agency team through the existing brief Realtime listener.
- **Live Progress Updates:** active projects show a vertical changelog beside the roadmap. Each update has a category (`Design`, `Development`, `Milestone`, or `Note`), concise message, and localized timestamp. Until the first update arrives, the card displays a calm empty state rather than placeholder content.
- Includes next-step, privacy reassurance, support card, pending file requests, and an optional compact asset context.

#### Project Brief — fields, validation, persistence

| Step | Fields |
| --- | --- |
| Business & scope | `business_name`, `industry`, `current_website`, `business_description`, `main_goals`. |
| Pages & structure | `site_type`, `page_structure`, `custom_pages`. |
| Features | `required_features` such as e-commerce, booking, SEO, multilingual, forms, maps, etc. |
| Design direction | `design_style`, `brand_colors`, `reference_sites` and notes. |
| Delivery context | assets, `budget_range`, `target_launch_date`, `additional_notes`, domain/hosting status. |

- An existing brief is loaded for the current user.
- Draft edits auto-save with a debounce and persist as `draft`; drafts are deliberately allowed before all final-required fields exist.
- Final submission validates key business/goals/pages/features fields before setting `status: submitted`.
- The portal listens for client-specific `project_briefs` updates so admin stage changes appear without full reloads.

#### Assets

- Clients can upload voluntary assets to private `portal-files`, including category and optional description.
- Categories cover brand/logo, imagery, documents, archives, and other.
- Project-file records are surfaced for download/manage under the client’s RLS access.
- The Asset Hub supports secure, in-app previews for PNG, JPG/JPEG, WebP, SVG, and PDF files. Image previews use a centered dashboard lightbox; PDFs use the same secure modal viewer. Other formats open through a short-lived signed URL.
- Client and Admin Asset Hubs offer `Download All (.zip)`. The browser fetches short-lived signed URLs, packages blobs with `jszip`, and saves a `[business-name]-assets.zip` archive through `file-saver`. The control is disabled with no files and displays archive progress while running.
- The Brand Identity Hub reads `project_briefs.brand_colors` as a JSONB array or compatible string array, validates HEX values, and renders clickable color tokens. Selecting a swatch copies its HEX value with immediate `Copied!` feedback; no palette is shown when no valid tokens exist.
- Asset browsing is organized into shared smart categories: `All Files`, `Brand & Identity` (`brand`, `logo`, `identity`, `font`), `Content & Media` (`content`, `image`, `imagery`, `media`, `document`), and `Deliverables` (`deliverable`, `final`, `invoice`, `proposal`). Search, empty states, item counts, and ZIP export all operate on the currently visible category/search result.
- File-request responses can include a file, an optional note, or both; a client can explain that an asset does not exist rather than being blocked.
- Admin review can accept/save a response into project assets or dismiss it.

#### Messages

- Project support chat reads chronological `messages`, attachment metadata, unread state, and Realtime updates.
- Enter sends and Shift+Enter inserts a line.
- Design requirement: a bounded chat card with internally scrolling history and pinned header/composer; message accumulation must not grow the entire page.
- Opening Messages marks incoming messages and message notifications as read for the client.

#### Approvals and payments

- `/portal?tab=approvals` is a live client sign-off workspace. Pending deliverables can be approved after confirmation or sent back with inline revision feedback; completed cards expose status badges and decision timestamps.
- Deliverable types include `link`, `figma`, `staging`, and `document`; secure preview links open in a new tab when supplied.
- The Admin project detail includes an **Approvals & Deliverables** section. Team members create a deliverable review with title, description, type, and optional URL, and can see live status plus exact client revision feedback.
- `project_briefs.payment_status` supports manual e-Transfer review states. No automatic financial settlement exists.

#### Profile & Settings

- Editable: `full_name`, `company_name`, `job_title`, `phone`, `company_website`, `timezone`, `preferred_contact`.
- Email is identity-managed/read-only; a DB trigger blocks a non-admin from changing own email/role.
- Password update uses Supabase `auth.updateUser`; Google-identity users can add email/password sign-in.

### Admin Command Center (`/admin`)

#### Action Center

- Triage/KPI view for briefs awaiting review, manual payment states, unread client messages, and accounts registered without a brief after a follow-up interval.
- Quick actions route toward Messages, file request work, Payments, and proposal/project work.
- Pipeline summarizes brief submitted, proposal sent, in progress, ready for review, and live/completed counts.
- **Command Palette:** `Cmd+K` (macOS) / `Ctrl+K` (Windows/Linux) opens an admin-only, keyboard-accessible command palette. It provides direct navigation to Action Center, Clients, Projects, Messages, and Payments; searches real client names/emails and opens their project detail; and switches the local dashboard light/dark theme. Arrow keys select, Enter executes, and Escape/backdrop dismisses. The same search control is exposed in the desktop header; it is intentionally hidden on compact screens.

#### Clients directory

- Queries `profiles` with nested `project_briefs`, ordered by registration.
- Excludes `admin` and `super_admin` roles from clients and metrics.
- Supports client-name/email search and filters: all, registered/no brief, brief submitted, in development, completed.
- A selected client yields project/profile detail, requirement context, assets, file-request review, chat shortcut, stage controls, proposal controls, payment controls, and destructive deletion.
- The full client/project inspector contains the same **Onboarding Readiness** checklist as the client overview. Admins can toggle readiness directly; changes are persisted to the project brief and immediately become visible in the client workspace.
- The inspector also includes **Live Project Timeline** management: the team can post a concise progress message with a category, review the client-visible stream, or remove an incorrect update. Mutations update the shared brief immediately.
- Deletion invokes `/api/admin/delete-client`: it verifies the caller, rejects deletion of agency admin accounts, removes known storage/data, then deletes the Auth user. It is irreversible and requires explicit confirmation.

#### Projects

- Groups briefs by submitted, reviewing/proposal, in progress/client review, and completed.
- Project selection opens the same detailed client/project context rather than a cramped split card.
- Updating brief status triggers client notifications and portal realtime roadmap updates.

#### Messages

- Admin inbox has client conversation list/search, unread markers, active thread, attachments, composer, and direct links to project/client context.
- Opening a thread marks recipient-side unread messages/notifications read.

#### Payments

- Shows briefs in payment-review related states and supports approve/reject status changes.
- The admin must independently verify the e-Transfer outside the app before approval.

#### Admin actions

- Review requirements and update stages.
- Request missing files/information.
- Accept or dismiss submitted requested assets.
- Open direct chat and exchange attachments.
- Set proposal amount, delivery estimate, and scope summary.
- Review manual payment states.
- Permanently delete a client after confirmation.

---

## 6. Design System Parity & Global Styling Consistency

### Shared dashboard visual target

Portal and Admin must share one operational design system, strictly separate from marketing.

| Category | Light mode | Dark mode |
| --- | --- | --- |
| Canvas | `slate-50`/neutral pale canvas | obsidian/slate-950 (`#090d16` / `#0B101B`) |
| Elevated surface | white, `border-slate-200/90`, subtle shadow | `slate-900`, `border-slate-800`, restrained shadow |
| Main copy | `text-slate-900` | `text-slate-100`/white |
| Supporting copy | `text-slate-600` | `text-slate-400` |
| Micro-label | crisp `text-sky-700`/slate | `text-sky-400`/slate |
| Primary action | readable blue/cyan surface | readable blue/cyan surface |
| Destructive action | red contrast with clear disabled state | red contrast with clear disabled state |

### Component parity requirements

- **Sidebar:** expanded about `w-64`, collapsed about `w-20`; seam-mounted toggle cannot overlap logo. Collapsed icons are centered and show accessible hover/focus tooltips outside the rail.
- **Header:** stable height, theme control, notification bell, and role-aware account dropdown.
- **Notification dropdown:** Portal/Admin must use an opaque shared popover. In dark mode body and `Clear all` footer both use `#0B101B`; in light mode both use coordinated white/slate. No mismatched hard-coded footer color.
- **Messages:** matching Portal/Admin chat surface, readable solid-blue outgoing bubbles, neutral incoming bubbles, internal scroll, pinned composer.
- **Modals:** `fixed inset-0` viewport overlay, high z-index, independent centering, scroll lock, and enough input/action spacing.
- **Mobile:** sidebar becomes drawer; directories drill down; tables/cards reflow; pipelines may horizontally scroll rather than compressing unreadably.

### Fragmentation found in this audit

1. `PortalExperience.jsx` imports V4 plus several specialized refinement modules.
2. Style ownership is divided among CSS modules, `globals.css` `mi-*` selectors, and inline JSX style objects.
3. Old CSS files and `DataPortals` remain in the repository, raising the risk of editing an inactive style source.
4. Some `!important` rules exist for overlay/popover conflicts. They may create Dashboard parity drift and must stay tightly namespaced.

### Future design-system discipline

- Extend active shared `Shell` and V4 dashboard tokens before introducing a new local look.
- Prefer named dashboard token classes over raw hard-coded JSX colors.
- Keep light/dark variants together and inspect Portal plus Admin after every shared change.
- Do not add blind global CSS to repair one component; edit its actual JSX/CSS module.
- Treat sidebar, surface card, modal, popover, badge, button, and chat bubble as shared primitives—not copy/pasted variants.

---

## 7. Database Schemas, Storage & Data Flow

### Migrations and order

`supabase/` contains safe/rerunnable SQL scripts and repair patches, not a migration runner. Confirm live database state before assuming a migration is applied.

Logical order:

1. `schema.sql` — app roles, profiles, legacy projects/invoices.
2. `portal_v2.sql` where present in historic deployment setup.
3. `portal_v3.sql` — rich briefs, files, storage, notifications/outbox.
4. `fix_rls_recursion.sql` — non-recursive admin RLS repair.
5. `portal_v4_realtime_fix.sql` — auth/profile sync/backfill and realtime repair.
6. `portal_v5_features.sql` — messages, file requests, storage, triggers/realtime.
7. Extensions: `profile_account_settings.sql`, `project_asset_hub.sql`, `file_request_client_responses.sql`, `file_request_admin_review.sql`, `notifications_v6.sql`, `notification_label_cleanup.sql`, `approvals_v1.sql`.

Later RLS repairs intentionally remove/recreate policies, not customer rows. Never run an older migration blindly against production.

### Tables and access model

| Table | Purpose and relationships | RLS/access intent |
| --- | --- | --- |
| `profiles` | One row per `auth.users` (`id` FK); identity, role, account profile fields. | Owner read/update own; admin read/update all. |
| `projects` | Legacy project: `client_id → profiles`, title/email/status/stage/progress. | Owner read; admin manage. |
| `project_briefs` | Rich primary intake: `client_id → profiles`, requirement/design/commercial/lifecycle data. | Owner manages own; admin manages all. |
| `project_files` | `brief_id → project_briefs`, `client_id → profiles`; filename/path/type/size/category/description/uploader. | Owner manages own records; admin manages all. |
| `approvals` | Client review request: `project_id → project_briefs`, `client_id → profiles`; title, deliverable type/URL, status, feedback, and decision timestamp. | Client reads own and may submit decision/feedback only; admins have full access. |
| `messages` | `project_id → project_briefs`; sender/recipient → `profiles`; content, JSON attachments, read/timestamp. | Participants and admins under policy. |
| `file_requests` | Client/project asset request, creator, title/description, client response, decision. | Client responds to own; admin creates/reviews. |
| `notifications` | Recipient/sender, title/body/message/link/type/read/timestamp; compatibility columns may exist. | Recipient own state; admin creation/management. |
| `invoices` | Legacy invoice linked to `projects`. | Client read own project invoices; admin manage. |
| `email_outbox` | Email queue/audit foundation, recipient/template/payload/status. | Admin management. It does not deliver SMTP itself. |

### `project_briefs` field catalogue

- Business: `business_name`, `industry`, `current_website`, `business_description`.
- Scope: JSONB `main_goals`, `site_type`, JSONB `page_structure`, `custom_pages`, `required_features`.
- Design: `design_style`, JSONB `brand_colors`, JSONB `reference_sites`. `brand_colors` may be a JSONB HEX array (for example `["#0066FF", "#0A101D", "#FFFFFF"]`) or a compatible serialized/string array; the dashboard normalizes valid HEX values into copyable Brand Identity Hub tokens.
- Infrastructure: `domain_status` and `hosting_status` (`have_*`, `need_*`, `not_sure`).
- Commercial/delivery: `budget_range`, `target_launch_date`, `additional_notes`, proposal amount/summary/delivery days, `payment_status`.
- Onboarding: JSONB `onboarding_checklist`, normalized in the dashboard to four stable records: `brand_assets`, `copywriting`, `domain_dns`, and `color_palette`. Each record has `id`, client-facing `label`, and `status` (`pending` or `ready`). A null or malformed value falls back safely to the default pending checklist.
- Timeline: JSONB `timeline_updates`, normalized to a newest-first array of `{ id, message, category, created_at }`. Supported categories are `Design`, `Development`, `Milestone`, and `Note`; a null or malformed value safely renders as an empty timeline.
- Lifecycle status: `draft`, `submitted`, `reviewing`, `proposal_sent`, `in_progress`, `client_review`, `completed`.

### Profiles, roles, and extended fields

- Role enum: `client`, `admin`, `super_admin`.
- `miladmo68@gmail.com` is seeded/mapped to `super_admin`.
- `info@milink.ca` is seeded/mapped to `admin`.
- Other users default to `client`.
- Extended settings: `company_name`, `job_title`, `phone`, `company_website`, `timezone` (default `America/Toronto`), and `preferred_contact` (`email`, `portal`, `whatsapp`).

### Storage buckets

| Bucket | Visibility | Usage/path convention |
| --- | --- | --- |
| `project-assets` | Private | Earlier project assets. First storage path segment is client UUID; admin can read/manage. |
| `portal-files` | Private | Current portal uploads, chat attachments, requested files, voluntary assets. First path segment is client UUID. |

Keep canonical bucket/path plus metadata in `project_files`; private assets should use authenticated or signed access, not accidental public URLs.

### Trigger/data-flow map

1. `auth.users` insert → `handle_new_user()` upserts `profiles`; later scripts backfill earlier users.
2. Brief becomes `submitted` → admin profiles receive notifications.
3. Brief status changes → client gets a status notification.
4. New `messages` row → recipient gets notification labelled `New message`.
5. New `file_requests` row → client alert; completed response → admin alert.
6. UI/trusted job calls `/api/send-email` for SMTP dispatch. `email_outbox` tracks/foundational state but is not a DB-native mail worker.

### Realtime channels

- Client-specific `project_briefs` updates.
- Onboarding readiness mutations update `project_briefs.onboarding_checklist`; the existing client brief subscription and Admin CRM project-brief subscription synchronize the checklist without a page reload.
- Timeline post/remove mutations update `project_briefs.timeline_updates`; these updates use the same client brief and admin CRM subscriptions for live synchronization without a full reload.
- Admin CRM refresh on `profiles` and `project_briefs` change.
- User notification shell listens to `notifications` and incoming `messages` for bell/unread state.
- Messages components subscribe to conversation changes; file-request/file flows depend on relevant publication setup.
- Both the Client and Admin Asset Hubs subscribe to `project_files` changes scoped by `brief_id`, so uploads and removals update without refresh.
- Client Approval cards and the Admin Deliverables manager subscribe to `approvals` changes scoped by `project_id`, keeping new reviews, decisions, and revision feedback synchronized in real time.

Migrations add `profiles`, `project_briefs`, `project_files`, `messages`, `file_requests`, `notifications`, and `approvals` to `supabase_realtime` duplicate-safely. Confirm actual publication membership in Supabase.

### Approval review workflow

`supabase/approvals_v1.sql` adds `public.approvals` for client-facing reviews of deliverables such as links, Figma files, staging sites, and documents. Each row belongs to one `project_briefs` project and one client profile. The workflow state is `pending`, `approved`, or `changes_requested`.

- Clients can read only rows matching their `client_id` and can submit only a decision plus `client_feedback`.
- Admins have full create/read/update/delete access through the existing non-recursive `public.is_admin()` security-definer function.
- A `before update` guard prevents non-admin clients from changing ownership, project references, deliverable details, titles, descriptions, or creation timestamps. It sets `decided_at` when the client records a decision.
- `approvals` is added to the Supabase Realtime publication and is actively consumed by the Client Portal Approval tab and Admin Deliverables manager for immediate review-state synchronization.

### RLS safety boundary

The former critical defect was recursion from a `profiles` policy that queried `profiles` to determine admin authority. `supabase/fix_rls_recursion.sql` fixes it with `SECURITY DEFINER`, `STABLE` `public.is_admin()` and updates compatibility `is_milink_admin()`.

Never reintroduce direct `profiles` role lookups inside a `profiles` RLS policy. Keep service-role credentials server-side only.

---

## 8. Authentication & Multi-Environment Configuration

### Email/password flow

- `SecureAccess` calls `supabase.auth.signUp` using `emailRedirectTo` at the dynamic current-origin `/auth/callback`.
- With email confirmation enabled and no session returned, it displays verification-required UX instead of opening the workspace.
- Email/password sign-in uses `signInWithPassword`; unconfirmed-email errors offer verification resend.
- Forgot password uses `resetPasswordForEmail` with `${currentOrigin}/reset-password`.
- Reset flow exchanges any recovery code/session then calls `auth.updateUser({ password })`.

### Google OAuth and password linking

- OAuth uses browser `window.location.origin` and sends the **query-free** callback `${origin}/auth/callback` inside `options.redirectTo`.
- A pure callback avoids literal Supabase Redirect URL mismatch/fallback to the project Site URL.
- Both `http://localhost:3000/auth/callback` and `https://milink.ca/auth/callback` must be configured in Supabase Auth URLs.
- Google-identity users may set a password from account settings, linking password access without replacing Google identity.

### Server callback

`src/app/auth/callback/route.js`:

1. Reads `code` and optional internal `next`.
2. Exchanges code with an `@supabase/ssr` server client and cookies.
3. Reads profile role and uses recognized admin email fallback.
4. Redirects admin/super-admin to `/admin`; defaults other users to `/portal`; allows only safe internal `next` override.
5. Resolves origin from forwarded host/proto so localhost remains local and production remains production.
6. Uses `/portal?error=auth_failed` on invalid/missing exchange.

The frozen root landing page forwards a stray `?code=` to the same-origin callback as a narrowly scoped auth continuity safeguard—not authorization to restyle marketing.

### Environment rules

| Environment | Required origin |
| --- | --- |
| Local development | `http://localhost:3000` |
| Production | `https://milink.ca` |

- Never hard-code production origin in browser OAuth code.
- Browser redirects prefer `window.location.origin`.
- Callback redirects resolve forwarded host/proto, not only deployment-internal `request.url`.
- `NEXT_PUBLIC_SITE_URL` is fallback/canonical email URL source; local development should set it appropriately when testing emails.

### RBAC

| Role | Portal access | Admin access | Enforcement |
| --- | --- | --- | --- |
| `client` | Own profile, brief, files, requests, messages, notifications | None | Owner RLS. |
| `admin` | Agency operational view where applicable | Full CRM/project/file/message/payment operations | `public.is_admin()` RLS. |
| `super_admin` | Same operational access | Full operational access / primary admin identity | `public.is_admin()` plus server deletion safeguards. |

Known email handling in frontend is UI convenience only. Sensitive actions must remain protected by RLS or server-side authorization.

### Transactional email design

- `/api/send-email` runs on Node.js/Nodemailer using unified SMTP settings.
- Client notifications use **MiLink Team** branding and avoid exposing personal admin identity or raw private message previews.
- Detailed project/client/message metadata is reserved for admin alerts.
- Email delivery includes HTML plus plain text, full URLs, reply-to, normal-priority/reference headers, logo, business address, and copyright/security footer.
- `/api/contact` sends marketing inquiries to `TO_EMAIL`; it remains under the marketing freeze except expressly authorized delivery/security work.

---

## Working Rules for Future Changes

1. Read this document first and identify the exact dashboard-only ownership boundary.
2. Do not touch frozen marketing modules without explicit authorization.
3. Preserve `/admin`, `/portal`, and the active shared `PortalExperience` shell.
4. Inspect desktop/mobile, light/dark, populated/empty/loading/error states, and z-index/scroll behavior.
5. For DB changes, add a safe/re-runnable SQL patch under `supabase/`; preserve data and avoid recursive RLS.
6. Keep secrets only in environment configuration.
7. Run `npm run build` after executable code changes. For documentation-only work, validate the Markdown and referenced paths.
