# Production Connection Checklist

## Required services

- Supabase: Auth (email + Google), Postgres and private Storage buckets.
- Resend: transactional mail from a verified `milink.ca` domain.
- Vercel: deployment and environment variables.

## Environment variables

Create these in local `.env.local` and in the hosting provider. Do not commit them.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
MAIL_FROM="MIlink <info@milink.ca>"
```

## Authentication and access

1. Enable email/password and Google in Supabase Auth.
2. Add the production callback URL: `https://milink.ca/auth/callback`.
3. On user creation, create a `profiles` record with role `client`.
4. Bootstrap `miladmo68@gmail.com` as `super_admin`; bootstrap `info@milink.ca` as `admin` if it needs an independent sign-in.
5. Every admin route must verify the authenticated profile role on the server before returning data.

## Core data model

```text
profiles(id, email, full_name, role, created_at)
organizations(id, owner_id, name)
organization_members(organization_id, profile_id, role)
projects(id, organization_id, title, status, progress, brief_json, created_at)
project_tasks(id, project_id, title, status, visible_to_client, due_at)
project_messages(id, project_id, sender_id, body, created_at)
project_files(id, project_id, uploaded_by, path, visibility, kind)
project_approvals(id, project_id, title, status, requested_at, decided_at)
invoices(id, project_id, reference, amount_cents, currency, status, due_at)
payment_submissions(id, invoice_id, method, receipt_path, status, reviewed_by, reviewed_at)
activity_events(id, project_id, actor_id, event_type, metadata_json, created_at)
admin_invites(id, email, role, invited_by, status, expires_at)
```

## Minimum RLS rules

- Clients can select projects only where they belong to the project's organization.
- Clients can read/write messages only for their own organization’s projects.
- Clients can upload only under a path beginning with their own organization and project ID.
- `visible_to_client = false` tasks and admin notes never return to client queries.
- Admins can access all records; only `super_admin` can change admin roles.
- The service-role key is server-only; it must never be exposed to the browser.

## Email events

- `welcome` after verified sign-up
- `project_received` after a brief is submitted
- `admin_new_lead` to admins
- `action_required` when an admin creates a client-visible task
- `message_received` for a new project message
- `approval_requested`
- `payment_received_for_review` to admins
- `payment_approved` or `payment_clarification_requested` to client

## Verification checklist

1. Sign up with email and Google; verify the right role is returned.
2. Confirm a client cannot request another client’s project, file, invoice or receipt URL.
3. Upload a receipt and verify it is private, records `pending_review`, and sends the correct email.
4. Approve it as admin and verify invoice, audit event, client notification and UI state.
5. Test rejected/expired invite links and role removal.
6. Confirm `miladmo68@gmail.com` is the only bootstrap super admin and admin changes are audited.
