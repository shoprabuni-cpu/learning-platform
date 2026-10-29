# Product roadmap

> Phase 1 code is in progress. The landing/auth shell, profile editor, admin role review, curriculum drafts and publication, lesson reader, daily quiz scoring, and live dashboard queries are implemented. The build passes. Supabase migrations and seed data still need to be applied to a configured project.

## Progress log
- [x] Created the Next.js and Tailwind shell with Ghana-inspired design tokens.
- [x] Added email and Google auth actions, verification/reset routes, protected route session refresh, and role-safe signup trigger.
- [x] Added profile preferences, admin role review, and subject/topic/lesson draft and publish screens.
- [x] Added lesson completion tracking, dashboard queries, Ghana-time streak calculation, daily quiz scoring RPC, and upcoming exam calendar.
- [ ] Configure a Supabase project, apply migrations, load seed content, and set environment variables.
- [ ] Configure Google OAuth and production email delivery.
- [ ] Add live content, quiz, and exam management to the admin CMS; finish analytics and moderation.
> Status: Phase 1 has started. The app shell, Ghana-inspired Tailwind tokens, auth screens/actions, protected route foundation, Supabase migration, and asset prompt are drafted. Installation, Supabase configuration, and runtime verification are still pending.

## Phase 1 — Core platform
- [ ] Next.js App Router, TypeScript, Tailwind CSS, responsive shell, Ghana-inspired tokens.
- [ ] Supabase local and hosted environments, migrations, generated database types.
- [ ] Student, teacher, and parent registration; Google OAuth; email verification; password reset; sign-out; protected routes.
- [ ] Student profiles, learning preferences, role review, guardian links, achievement records.
- [ ] Role assignment workflow, row-level security, admin audit trail.
- [ ] Dashboard: recent lessons, daily quiz, study streak, weak topics, recommendations, upcoming exams.
- [ ] Admin CMS: users, subjects, topics, lessons, analytics, moderation.
- [ ] Seed one subject, topic, lesson, and minimal daily quiz for a real dashboard vertical slice.
- [ ] Configure email delivery, OAuth, and deployment.

## Phase 2 — Learning platform
- [ ] Rich-text lessons with images, video, math formulas, interactive examples.
- [ ] Curriculum, subjects, topics, search, bookmarks, completion tracking.
- [ ] PDF notes and downloadable worksheets.
- [ ] Select video hosting based on bandwidth, traffic, and cost.

## Phase 3 — Practice platform
- [ ] Question bank for multiple choice, true/false, fill-in, matching, short answer, math input.
- [ ] Topic and mixed quizzes, daily challenge, timed and randomized sessions.
- [ ] BECE/WASSCE past questions with subject, year, and difficulty filters.
- [ ] Explanations, attempt history, topic performance.

## Phase 4 — Assessment platform
- [ ] Mock exams, WAEC/BECE simulations, school tests.
- [ ] Timed delivery, autosave, marking, explanations, results, weak-topic analysis.
- [ ] Performance history, course certificates, excellence awards.

## Phase 5 — AI intelligence
- [ ] Server-side provider-neutral AI integration with permission-scoped context.
- [ ] Learning Prescription, AI Tutor hints and step-by-step examples.
- [ ] Weekly/monthly Insights, subject trends, Growth Index, mastery progression.
- [ ] Success Predictor after enough validated assessment history; voice later.

## Phase 6 — Teacher platform
- [ ] Teacher verification, classes, notes, quizzes, exams, assignments.
- [ ] Marking, feedback, performance monitoring, reports.

## Phase 7 — Parent portal
- [ ] Verified guardian-student links, progress, attendance, performance, notifications.
- [ ] Teacher communication.

## Phase 8 — School portal
- [ ] Manage students, teachers, memberships, timetables, results.
- [ ] School-wide analytics and reports.

## Cross-cutting
- [ ] Mobile-first layouts and low-bandwidth behavior.
- [ ] Accessibility, keyboard navigation, contrast, reduced motion.
- [ ] Privacy, consent, retention, and deletion flows appropriate for school-age learners.
- [ ] Monitoring, backups, and production email configuration.


