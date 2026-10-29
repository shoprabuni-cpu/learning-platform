import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { submitDailyQuizAction } from "@/app/dashboard/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Activity = { activity_type: string; reference_id: string | null; occurred_at: string };
type Attempt = { question_id: string; is_correct: boolean; selected_option_key?: string; daily_challenge_id?: string };
type Option = { key: string; text: string };
type Topic = { id: string; name: string; subject_id: string };
type Question = { id: string; prompt: string; options: Option[]; explanation: string; topic_id: string };
type Lesson = { id: string; title: string; summary: string; topic_id: string; estimated_minutes: number };
type Exam = { id: string; title: string; scheduled_at: string; subject_id: string | null };

function accraDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (kind: string) => parts.find((item) => item.type === kind)?.value ?? "";
  return part("year") + "-" + part("month") + "-" + part("day");
}

function studyStreak(activities: Activity[]) {
  const activeDays = new Set(
    activities
      .filter((item) => item.activity_type === "lesson_completed" || item.activity_type === "quiz_completed")
      .map((item) => accraDate(new Date(item.occurred_at))),
  );
  const today = accraDate(new Date());
  let cursor = activeDays.has(today) ? today : accraDate(new Date(Date.now() - 86400000));
  let count = 0;
  while (activeDays.has(cursor) && count < 90) {
    count += 1;
    const previous = new Date(cursor + "T12:00:00.000Z");
    previous.setUTCDate(previous.getUTCDate() - 1);
    cursor = accraDate(previous);
  }
  return count;
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ quiz?: string }> }) {
  const query = await searchParams;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login?error=setup");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: activeRoles } = await supabase.from("user_roles")
    .select("role").eq("user_id", user.id).eq("status", "active");
  if (!activeRoles?.length) redirect("/account-pending");

  const today = accraDate(new Date());
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86400000).toISOString();
  const [profileResult, challengeResult, examResult, activityResult, attemptsResult, achievementsResult, topicsResult] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
    supabase.from("daily_challenges").select("id,question_id").eq("challenge_date", today).eq("is_published", true).maybeSingle(),
    supabase.from("exam_calendar").select("id,title,scheduled_at,subject_id").gte("scheduled_at", new Date().toISOString()).order("scheduled_at").limit(4),
    supabase.from("learning_activity").select("activity_type,reference_id,occurred_at").eq("user_id", user.id).gte("occurred_at", ninetyDaysAgo).order("occurred_at", { ascending: false }).limit(200),
    supabase.from("quiz_attempts").select("question_id,is_correct,selected_option_key,daily_challenge_id").eq("user_id", user.id).order("submitted_at", { ascending: false }).limit(100),
    supabase.from("user_achievements").select("id").eq("user_id", user.id),
    supabase.from("topics").select("id,name,subject_id").eq("is_published", true).order("sort_order").limit(100),
  ]);

  const firstName = profileResult.data?.full_name?.trim().split(" ")[0] || user.email?.split("@")[0] || "learner";
  const activities = (activityResult.data ?? []) as Activity[];
  const attempts = (attemptsResult.data ?? []) as Attempt[];
  const exams = (examResult.data ?? []) as Exam[];
  const challenge = challengeResult.data;
  const topicRows = (topicsResult.data ?? []) as Topic[];
  const recentLessonIds = Array.from(new Set(
    activities.filter((item) => (item.activity_type === "lesson_started" || item.activity_type === "lesson_completed") && item.reference_id)
      .map((item) => item.reference_id as string),
  )).slice(0, 5);
  const attemptedQuestionIds = Array.from(new Set(attempts.map((item) => item.question_id)));
  const subjectIds = Array.from(new Set(topicRows.map((item) => item.subject_id)));

  const [recentLessonsResult, questionMetaResult, subjectResult, dailyQuestionResult, dailyAttemptResult] = await Promise.all([
    recentLessonIds.length
      ? supabase.from("lessons").select("id,title,summary,topic_id,estimated_minutes").in("id", recentLessonIds)
      : Promise.resolve({ data: [] as Lesson[] }),
    attemptedQuestionIds.length
      ? supabase.from("practice_questions").select("id,topic_id").in("id", attemptedQuestionIds)
      : Promise.resolve({ data: [] as { id: string; topic_id: string }[] }),
    subjectIds.length
      ? supabase.from("subjects").select("id,name").in("id", subjectIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    challenge
      ? supabase.from("practice_questions").select("id,prompt,options,explanation,topic_id").eq("id", challenge.question_id).maybeSingle()
      : Promise.resolve({ data: null as Question | null }),
    challenge
      ? supabase.from("quiz_attempts").select("is_correct,selected_option_key").eq("user_id", user.id).eq("daily_challenge_id", challenge.id).maybeSingle()
      : Promise.resolve({ data: null as Attempt | null }),
  ]);

  const lessons = (recentLessonsResult.data ?? []) as Lesson[];
  const questionMeta = (questionMetaResult.data ?? []) as { id: string; topic_id: string }[];
  const subjects = (subjectResult.data ?? []) as { id: string; name: string }[];
  const dailyQuestion = dailyQuestionResult.data as Question | null;
  const dailyAttempt = dailyAttemptResult.data as Attempt | null;
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const topicById = new Map(topicRows.map((topic) => [topic.id, topic]));
  const subjectName = (id: string | null) => subjects.find((subject) => subject.id === id)?.name ?? "Learning";
  const questionTopic = new Map(questionMeta.map((item) => [item.id, item.topic_id]));
  const mastery = new Map<string, { total: number; correct: number }>();

  for (const attempt of attempts) {
    const topicId = questionTopic.get(attempt.question_id);
    if (!topicId) continue;
    const current = mastery.get(topicId) ?? { total: 0, correct: 0 };
    current.total += 1;
    if (attempt.is_correct) current.correct += 1;
    mastery.set(topicId, current);
  }

  const weakTopicEntry = Array.from(mastery.entries())
    .filter(([, value]) => value.total >= 1)
    .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)[0];
  const weakTopic = weakTopicEntry ? topicById.get(weakTopicEntry[0]) : undefined;
  const recommendationTopic = weakTopic ?? topicRows[0];
  const recommendationResult = recommendationTopic
    ? await supabase.from("lessons").select("id,title,summary,topic_id,estimated_minutes")
        .eq("topic_id", recommendationTopic.id).eq("is_published", true).order("sort_order").limit(1).maybeSingle()
    : { data: null as Lesson | null };
  const recommendation = recommendationResult.data as Lesson | null;

  const streak = studyStreak(activities);
  const formattedExamDate = (value: string) => new Intl.DateTimeFormat("en-GH", {
    timeZone: "Africa/Accra",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
  const quizOptions = Array.isArray(dailyQuestion?.options) ? dailyQuestion.options as Option[] : [];

  return <main className="min-h-screen">
    <header className="border-b border-line bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-3 font-bold"><span className="grid size-9 place-items-center rounded-xl bg-brand-green text-sm text-white">L</span>Learning Platform</Link>
      <div className="flex items-center gap-3"><Link href="/profile" className="hidden text-sm font-semibold text-muted hover:text-brand-green sm:inline">Learning profile</Link><span className="hidden text-sm text-muted md:inline">{user.email}</span><form action={signOutAction}><button className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:bg-paper">Log out</button></form></div>
    </div></header>
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-green">Student dashboard</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Good to see you, {firstName}.</h1><p className="mt-2 text-muted">A little focused effort today can take you a long way.</p></div><Link href="/profile" className="text-sm font-semibold text-brand-green hover:underline">Update learning profile →</Link></div>

      {query.quiz === "failed" && <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">Your answer could not be submitted. Refresh and try again.</p>}
      {query.quiz === "missing" && <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">Choose an answer before submitting.</p>}

      <section className="mt-9 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-[1.75rem] bg-brand-green p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[.16em] text-white/70">Today’s challenge</p><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">Daily quiz · Ghana time</span></div>
          {dailyQuestion && challenge ? <>
            <h2 className="mt-4 max-w-2xl text-2xl font-semibold">{dailyQuestion.prompt}</h2>
            {dailyAttempt ? <div className="mt-6 rounded-2xl bg-white p-5 text-ink">
              <p className={"font-bold " + (dailyAttempt.is_correct ? "text-brand-green" : "text-brand-red")}>{dailyAttempt.is_correct ? "Correct — well done!" : "Not quite. Keep practising."}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{dailyQuestion.explanation}</p>
            </div> : <form action={submitDailyQuizAction} className="mt-6">
              <input type="hidden" name="challenge_id" value={challenge.id} />
              <fieldset><legend className="sr-only">Choose an answer</legend><div className="grid gap-3 sm:grid-cols-2">
                {quizOptions.map((option) => <label key={option.key} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm font-semibold transition hover:bg-white/20">
                  <input required type="radio" name="option_key" value={option.key} className="size-4 accent-brand-gold" />{option.text}
                </label>)}
              </div></fieldset>
              <button className="mt-5 rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-ink hover:bg-[#ffdc43]">Check answer</button>
            </form>}
          </> : <div className="mt-5 rounded-2xl bg-white/10 p-5"><h2 className="text-xl font-semibold">Your daily quiz is being prepared.</h2><p className="mt-2 text-sm leading-6 text-white/75">A new question will appear here each day. Explore a lesson while you wait.</p></div>}
        </article>
        <article className="flex flex-col justify-between rounded-[1.75rem] border border-line bg-white p-6 sm:p-8">
          <div><p className="text-sm font-semibold text-muted">Study streak</p><p className="mt-4 text-4xl font-semibold tracking-tight">{streak} <span className="text-base font-medium text-muted">{streak === 1 ? "day" : "days"}</span></p><p className="mt-2 text-sm text-muted">{streak ? "You’re building a strong study habit." : "Complete a lesson or quiz to start your streak."}</p></div>
          <div className="mt-6 border-t border-line pt-5"><p className="text-sm font-semibold">Achievements</p><p className="mt-1 text-sm text-muted">{achievementsResult.data?.length ?? 0} badges earned</p></div>
        </article>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-line bg-white p-6 sm:p-7"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Pick up learning</h2><span className="text-xl text-brand-green" aria-hidden="true">↗</span></div>
          {recentLessonIds.map((id) => { const lesson = lessonById.get(id); return lesson ? <Link key={id} href={"/lessons/" + lesson.id} className="mt-4 block rounded-2xl bg-paper p-4 transition hover:bg-[#f1f3ec]"><p className="font-semibold">{lesson.title}</p><p className="mt-1 text-xs text-muted">{topicById.get(lesson.topic_id)?.name ?? "Lesson"} · {lesson.estimated_minutes} min</p></Link> : null; })}
          {!recentLessonIds.some((id) => lessonById.has(id)) && <div className="mt-5 rounded-2xl border border-dashed border-line bg-paper px-4 py-7 text-center"><p className="font-semibold">Your recent lessons will show here</p><p className="mt-1 text-sm text-muted">Complete a lesson to see it in your dashboard.</p></div>}
        </article>
        <article className="rounded-[1.75rem] border border-line bg-white p-6 sm:p-7"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Focus topic</h2><span className="text-xl text-brand-red" aria-hidden="true">✦</span></div>
          {weakTopic ? <><p className="mt-5 text-xl font-semibold">{weakTopic.name}</p><p className="mt-2 text-sm leading-6 text-muted">Recent quiz attempts suggest this topic could use another review.</p></> : <><p className="mt-5 text-sm leading-6 text-muted">After a few quiz attempts, your dashboard will highlight topics to revisit.</p><p className="mt-3 text-xs text-muted">{attempts.length} quiz {attempts.length === 1 ? "attempt" : "attempts"} recorded</p></>}
          {recommendation && <Link href={"/lessons/" + recommendation.id} className="mt-5 block rounded-2xl bg-[#fff7d7] p-4"><p className="text-[11px] font-bold uppercase tracking-wide text-[#765600]">Recommended lesson</p><p className="mt-2 font-semibold">{recommendation.title}</p><p className="mt-1 text-xs text-muted">{recommendationTopic?.name} · {recommendation.estimated_minutes} min</p></Link>}
        </article>
        <article className="rounded-[1.75rem] border border-line bg-white p-6 sm:p-7"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Upcoming exams</h2><span className="text-xl text-brand-green" aria-hidden="true">✎</span></div>
          {exams.length ? <div className="mt-4 space-y-3">{exams.map((exam) => <div key={exam.id} className="rounded-2xl bg-paper p-4"><p className="font-semibold">{exam.title}</p><p className="mt-1 text-sm text-muted">{subjectName(exam.subject_id)} · {formattedExamDate(exam.scheduled_at)}</p></div>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-line bg-paper px-4 py-7 text-center"><p className="font-semibold">No exams scheduled yet</p><p className="mt-1 text-sm text-muted">School and platform exam dates will appear here.</p></div>}
        </article>
      </section>
    </div>
  </main>;
}

