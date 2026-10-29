create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  grade_level text,
  locale text not null default 'en-GH',
  learning_preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'parent', 'admin')),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  created_at timestamptz not null default now()
);

create table public.school_memberships (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'parent', 'school_admin')),
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  created_at timestamptz not null default now(),
  unique (school_id, user_id, role)
);

create table public.guardian_links (
  id uuid primary key default gen_random_uuid(),
  guardian_user_id uuid not null references auth.users(id) on delete cascade,
  student_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now(),
  unique (guardian_user_id, student_user_id),
  check (guardian_user_id <> student_user_id)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  slug text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (subject_id, slug)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text not null default '',
  body_markdown text not null default '',
  estimated_minutes integer not null default 10 check (estimated_minutes > 0),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, slug)
);

create table public.learning_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_type text not null check (activity_type in ('lesson_started', 'lesson_completed', 'quiz_started', 'quiz_completed', 'exam_completed')),
  reference_id uuid,
  details jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.lesson_bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_key text not null,
  awarded_at timestamptz not null default now(),
  details jsonb not null default '{}'::jsonb,
  unique (user_id, badge_key)
);

create index school_memberships_user_idx on public.school_memberships(user_id, status);
create index guardian_links_student_idx on public.guardian_links(student_user_id, status);
create index topics_subject_order_idx on public.topics(subject_id, sort_order);
create index lessons_topic_order_idx on public.lessons(topic_id, sort_order);
create index learning_activity_user_time_idx on public.learning_activity(user_id, occurred_at desc);
create index lesson_bookmarks_user_idx on public.lesson_bookmarks(user_id);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.has_platform_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1 from public.user_roles ur
    where ur.user_id = (select auth.uid())
      and ur.role = required_role
      and ur.status = 'active'
  );
$$;

revoke all on function private.has_platform_role(text) from public, anon, authenticated;
grant execute on function private.has_platform_role(text) to anon, authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text;
  requested_status text;
begin
  requested_role := lower(coalesce(new.raw_user_meta_data ->> 'requested_role', 'student'));
  if requested_role not in ('student', 'teacher', 'parent') then
    requested_role := 'student';
  end if;

  requested_status := case when requested_role = 'student' then 'active' else 'pending' end;

  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.user_roles (user_id, role, status)
  values (new.id, requested_role, requested_status);

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.schools enable row level security;
alter table public.school_memberships enable row level security;
alter table public.guardian_links enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;
alter table public.learning_activity enable row level security;
alter table public.lesson_bookmarks enable row level security;
alter table public.user_achievements enable row level security;

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.user_roles to authenticated;
grant select, insert, update, delete on public.schools to authenticated;
grant select, insert, update, delete on public.school_memberships to authenticated;
grant select, insert, update, delete on public.guardian_links to authenticated;
grant select, insert, update, delete on public.subjects to anon, authenticated;
grant select, insert, update, delete on public.topics to anon, authenticated;
grant select, insert, update, delete on public.lessons to anon, authenticated;
grant select, insert on public.learning_activity to authenticated;
grant select, insert, delete on public.lesson_bookmarks to authenticated;
grant select, insert on public.user_achievements to authenticated;

create policy "Profiles are visible to their owner or admin"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id or (select private.has_platform_role('admin')));

create policy "Users update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users and admins can view role assignments"
  on public.user_roles for select to authenticated
  using ((select auth.uid()) = user_id or (select private.has_platform_role('admin')));

create policy "Only admins can add role assignments"
  on public.user_roles for insert to authenticated
  with check ((select private.has_platform_role('admin')));

create policy "Only admins can change role assignments"
  on public.user_roles for update to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "School members can see their school"
  on public.schools for select to authenticated
  using (
    (select private.has_platform_role('admin'))
    or exists (
      select 1 from public.school_memberships sm
      where sm.school_id = public.schools.id
        and sm.user_id = (select auth.uid())
        and sm.status = 'active'
    )
  );

create policy "Admins manage schools"
  on public.schools for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Users see their own school memberships"
  on public.school_memberships for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_platform_role('admin')));

create policy "Admins manage school memberships"
  on public.school_memberships for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Linked guardians and students can see their link"
  on public.guardian_links for select to authenticated
  using (
    guardian_user_id = (select auth.uid())
    or student_user_id = (select auth.uid())
    or (select private.has_platform_role('admin'))
  );

create policy "Admins manage guardian links"
  on public.guardian_links for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Published subjects are readable"
  on public.subjects for select to anon, authenticated
  using (is_published or (select private.has_platform_role('admin')));

create policy "Admins manage subjects"
  on public.subjects for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Published topics are readable"
  on public.topics for select to anon, authenticated
  using (
    (is_published and exists (
      select 1 from public.subjects s
      where s.id = public.topics.subject_id and s.is_published
    ))
    or (select private.has_platform_role('admin'))
  );

create policy "Admins manage topics"
  on public.topics for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Published lessons are readable"
  on public.lessons for select to anon, authenticated
  using (
    (
      is_published
      and exists (
        select 1 from public.topics t
        join public.subjects s on s.id = t.subject_id
        where t.id = public.lessons.topic_id and t.is_published and s.is_published
      )
    )
      or (select private.has_platform_role('admin'))
  );

create policy "Admins manage lessons"
  on public.lessons for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Users read their own learning activity"
  on public.learning_activity for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_platform_role('admin')));

create policy "Users add their own learning activity"
  on public.learning_activity for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users manage their own bookmarks"
  on public.lesson_bookmarks for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Users read their own achievements"
  on public.user_achievements for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_platform_role('admin')));

create policy "Admins award achievements"
  on public.user_achievements for insert to authenticated
  with check ((select private.has_platform_role('admin')));
