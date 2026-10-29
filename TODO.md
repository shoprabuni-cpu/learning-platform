# Product roadmap

> Current status: Phase 1 is underway. The app shell, auth flows, profile and role review, curriculum CMS, lesson tracking, daily quiz, dashboard, and admin assessment tools are implemented. The hosted Supabase project has the schema and starter data. Google OAuth, production email, analytics, moderation, and deployment still need work.

## Progress log
- [x] Created the Next.js and Tailwind shell with Ghana-inspired design tokens.
- [x] Added email and Google auth actions, verification/reset routes, protected route session refresh, and role-safe signup trigger.
- [x] Added profile preferences, admin role review, and subject/topic/lesson draft and publish screens.
- [x] Added lesson completion tracking, dashboard queries, Ghana-time streak calculation, daily quiz scoring RPC, and upcoming exam calendar.
- [x] Added an admin analytics overview and a curriculum draft moderation queue.
- [x] Connected the hosted Supabase project, applied both migrations, loaded starter content, and configured the local publishable-key environment file.
- [x] Generated Supabase database types and pinned dependency versions.
- [x] Added admin authoring and publication for practice questions, daily challenges, and exam dates.
- [ ] Configure Google OAuth and production email delivery.
- [ ] Add an admin audit trail.
- [ ] Confirm the full user flows in a Node-enabled local runtime and prepare deployment.

## Phase 1 — Core platform
- [x] Next.js App Router, TypeScript, Tailwind CSS, responsive shell, Ghana-inspired tokens.
- [x] Hosted Supabase schema, migrations, generated database types, and starter seed data.
- [x] Student, teacher, and parent registration code; email verification; password reset; sign-out; protected routes.
- [x] Student profiles, learning preferences, and role review; guardian links and achievement records are modeled.
- [x] Role assignment workflow and row-level security.
- [x] Dashboard: recent lessons, daily quiz, study streak, weak topics, recommendations, upcoming exams.
- [x] Admin CMS for users, subjects, topics, lessons, questions, daily challenges, and exams.
- [x] Admin analytics and curriculum moderation queue.
- [ ] Admin audit trail.
- [x] Seed subject, topic, lesson, daily quiz, and upcoming revision session.
- [ ] Configure Google OAuth, production email delivery, local Supabase, and deployment.

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


