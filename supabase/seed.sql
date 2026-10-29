insert into public.subjects (name, slug, description, sort_order, is_published)
values ('Mathematics', 'mathematics', 'Build confidence with number, patterns, and problem solving.', 1, true)
on conflict (slug) do update set is_published = true;

insert into public.topics (subject_id, name, slug, description, sort_order, is_published)
select s.id, 'Fractions', 'fractions', 'Understand equivalent fractions and how to compare them.', 1, true
from public.subjects s where s.slug = 'mathematics'
on conflict (subject_id, slug) do update set is_published = true;

insert into public.lessons (topic_id, title, slug, summary, body_markdown, estimated_minutes, sort_order, is_published)
select t.id, 'Equivalent fractions', 'equivalent-fractions',
  'Learn how different fractions can represent the same amount.',
  $$## Fractions can have different names

A fraction shows part of a whole. If we multiply both the numerator and denominator by the same number, the value stays the same. For example, **1/2 = 2/4**.

Try drawing two equal rectangles: shade one half in the first, then two quarters in the second. The shaded areas match.$$,
  8, 1, true
from public.topics t join public.subjects s on s.id = t.subject_id
where s.slug = 'mathematics' and t.slug = 'fractions'
on conflict (topic_id, slug) do update set is_published = true;

insert into public.practice_questions (slug, topic_id, prompt, options, explanation, difficulty, is_published)
select 'equivalent-fractions-starter', t.id,
  'Which fraction is equivalent to one half?',
  '[{"key":"a","text":"2/4"},{"key":"b","text":"2/3"},{"key":"c","text":"3/5"},{"key":"d","text":"4/5"}]'::jsonb,
  'Multiply both the numerator and denominator of 1/2 by 2. That gives 2/4, which has the same value.',
  'introductory', true
from public.topics t join public.subjects s on s.id = t.subject_id
where s.slug = 'mathematics' and t.slug = 'fractions'
on conflict (slug) do update set is_published = true;

insert into public.practice_answer_keys (question_id, correct_option_key)
select id, 'a' from public.practice_questions where slug = 'equivalent-fractions-starter'
on conflict (question_id) do update set correct_option_key = excluded.correct_option_key;

insert into public.daily_challenges (challenge_date, question_id, is_published)
select (now() at time zone 'Africa/Accra')::date, id, true
from public.practice_questions where slug = 'equivalent-fractions-starter'
on conflict (challenge_date) do update set question_id = excluded.question_id, is_published = true;

insert into public.exam_calendar (slug, title, subject_id, scheduled_at, is_published)
select 'starter-mathematics-revision', 'Mathematics revision session', id,
  (((now() at time zone 'Africa/Accra')::date + 7) + time '09:00') at time zone 'Africa/Accra',
  true
from public.subjects where slug = 'mathematics'
on conflict (slug) do update set subject_id = excluded.subject_id, scheduled_at = excluded.scheduled_at, is_published = true;
