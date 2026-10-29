# Learning Platform

A Ghana-focused learning platform built phase by phase with Next.js, TypeScript, Tailwind CSS, and Supabase.

## First run

1. Install Node.js 20.9 or newer.
2. Copy .env.example to .env.local.
3. Add the Supabase project URL and publishable key to .env.local.
4. Run npm install.
5. Run npm run dev and open http://localhost:3000.

For local Supabase development, install Docker Desktop, then run npm run db:start. Supabase Studio and the local email inbox are available at the ports in supabase/config.toml.

## Authentication setup

Email signup is enabled in local configuration. Add the production site URL and /auth/callback redirect URL in Supabase Auth settings. Configure Google OAuth credentials in Supabase Auth before enabling its provider.

Student accounts activate at signup. Teacher and parent role requests start pending. The auth trigger only accepts student, teacher, or parent as self-selected roles; users cannot self-assign admin.

To bootstrap the first admin after creating that account, run this once in the Supabase SQL editor, replacing the email:

    insert into public.user_roles (user_id, role, status)
    select id, 'admin', 'active' from auth.users where email = 'admin@example.com'
    on conflict (user_id, role) do update set status = 'active';

Never put a Supabase service-role key in browser code or a NEXT_PUBLIC_ variable.

## Current scope

The current Phase 1 slice includes the public entry page, Supabase auth flows, profile preferences, role review, curriculum draft/publish screens, a lesson reader, daily quiz scoring, upcoming exam calendar, protected dashboard, core schema, and project roadmap. Live use still requires Supabase configuration and applying the migrations. The remaining backlog is in TODO.md.

