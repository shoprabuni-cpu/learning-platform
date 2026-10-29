create table public.practice_questions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  topic_id uuid not null references public.topics(id) on delete cascade,
  prompt text not null,
  options jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) >= 2),
  explanation text not null default '',
  difficulty text not null default 'core' check (difficulty in ('introductory', 'core', 'advanced')),
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.practice_answer_keys (
  question_id uuid primary key references public.practice_questions(id) on delete cascade,
  correct_option_key text not null
);

create table public.daily_challenges (
  id uuid primary key default gen_random_uuid(),
  challenge_date date not null unique,
  question_id uuid not null references public.practice_questions(id) on delete restrict,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  daily_challenge_id uuid not null references public.daily_challenges(id) on delete cascade,
  question_id uuid not null references public.practice_questions(id) on delete restrict,
  selected_option_key text not null,
  is_correct boolean not null,
  submitted_at timestamptz not null default now(),
  unique (user_id, daily_challenge_id)
);

create table public.exam_calendar (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subject_id uuid references public.subjects(id) on delete set null,
  school_id uuid references public.schools(id) on delete cascade,
  scheduled_at timestamptz not null,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index practice_questions_topic_idx on public.practice_questions(topic_id, is_published);
create index daily_challenges_date_idx on public.daily_challenges(challenge_date, is_published);
create index quiz_attempts_user_time_idx on public.quiz_attempts(user_id, submitted_at desc);
create index exam_calendar_time_idx on public.exam_calendar(scheduled_at, is_published);

alter table public.practice_questions enable row level security;
alter table public.practice_answer_keys enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.exam_calendar enable row level security;

grant select, insert, update, delete on public.practice_questions to authenticated;
grant select, insert, update, delete on public.practice_answer_keys to authenticated;
grant select, insert, update, delete on public.daily_challenges to authenticated;
grant select on public.quiz_attempts to authenticated;
grant select on public.exam_calendar to anon;
grant select, insert, update, delete on public.exam_calendar to authenticated;

create policy "Students and admins can read published questions"
  on public.practice_questions for select to authenticated
  using (
    (is_published and exists (
      select 1 from public.topics t
      join public.subjects s on s.id = t.subject_id
      where t.id = public.practice_questions.topic_id and t.is_published and s.is_published
    ))
    or (select private.has_platform_role('admin'))
  );

create policy "Admins manage questions"
  on public.practice_questions for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Only admins can read answer keys"
  on public.practice_answer_keys for select to authenticated
  using ((select private.has_platform_role('admin')));

create policy "Only admins manage answer keys"
  on public.practice_answer_keys for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Students read today's published challenge"
  on public.daily_challenges for select to authenticated
  using (
    is_published
    and challenge_date = (now() at time zone 'Africa/Accra')::date
      and (select private.has_platform_role('student'))
  );

create policy "Admins manage daily challenges"
  on public.daily_challenges for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create policy "Learners read their own attempts"
  on public.quiz_attempts for select to authenticated
  using (user_id = (select auth.uid()) or (select private.has_platform_role('admin')));

create policy "Published upcoming exams are visible"
  on public.exam_calendar for select to anon, authenticated
  using (
    (
      is_published
      and scheduled_at >= now()
      and (
        school_id is null
        or exists (
          select 1 from public.school_memberships sm
          where sm.school_id = public.exam_calendar.school_id
            and sm.user_id = (select auth.uid())
            and sm.status = 'active'
        )
      )
    )
      or (select private.has_platform_role('admin'))
  );

create policy "Admins manage exam calendar"
  on public.exam_calendar for all to authenticated
  using ((select private.has_platform_role('admin')))
  with check ((select private.has_platform_role('admin')));

create or replace function public.submit_daily_quiz_answer(
  p_challenge_id uuid,
  p_selected_option_key text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_question_id uuid;
  v_options jsonb;
  v_explanation text;
  v_correct_key text;
  v_is_correct boolean;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'Sign in is required.';
  end if;

  if not exists (
    select 1 from public.user_roles ur
    where ur.user_id = v_user_id and ur.role = 'student' and ur.status = 'active'
  ) then
    raise exception using errcode = '42501', message = 'An active student account is required.';
  end if;

  select q.id, q.options, q.explanation, ak.correct_option_key
    into v_question_id, v_options, v_explanation, v_correct_key
  from public.daily_challenges dc
  join public.practice_questions q on q.id = dc.question_id
  join public.practice_answer_keys ak on ak.question_id = q.id
  join public.topics t on t.id = q.topic_id
  join public.subjects s on s.id = t.subject_id
  where dc.id = p_challenge_id
    and dc.challenge_date = (now() at time zone 'Africa/Accra')::date
    and dc.is_published and q.is_published and t.is_published and s.is_published;

  if not found then
    raise exception using errcode = 'P0002', message = 'No active daily challenge was found.';
  end if;

  if not exists (
    select 1 from jsonb_array_elements(v_options) option_row
    where option_row ->> 'key' = p_selected_option_key
  ) then
    raise exception using errcode = '22023', message = 'That answer is not one of the available options.';
  end if;

  v_is_correct := p_selected_option_key = v_correct_key;

  begin
    insert into public.quiz_attempts (user_id, daily_challenge_id, question_id, selected_option_key, is_correct)
    values (v_user_id, p_challenge_id, v_question_id, p_selected_option_key, v_is_correct);
  exception when unique_violation then
    raise exception using errcode = '23505', message = 'You have already completed today’s challenge.';
  end;

  insert into public.learning_activity (user_id, activity_type, reference_id, details)
  values (
    v_user_id,
    'quiz_completed',
    p_challenge_id,
    jsonb_build_object('correct', v_is_correct, 'question_id', v_question_id)
  );

  return jsonb_build_object('correct', v_is_correct, 'explanation', v_explanation);
end;
$$;

revoke all on function public.submit_daily_quiz_answer(uuid, text) from public, anon;
grant execute on function public.submit_daily_quiz_answer(uuid, text) to authenticated;

