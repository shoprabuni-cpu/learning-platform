import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import {
  createExamAction,
  createPracticeQuestionAction,
  scheduleDailyChallengeAction,
  setDailyChallengePublishedAction,
  setExamPublishedAction,
  setQuestionPublishedAction,
} from "./actions";

export const dynamic = "force-dynamic";

type Query = { error?: string; created?: string; updated?: string };
const fieldClass = "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-green";
const buttonClass = "rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark disabled:opacity-40";

function todayInAccra() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function formatAccraDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Accra",
  }).format(new Date(value));
}

export default async function AdminAssessmentsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [subjectsResult, topicsResult, questionsResult, challengesResult, examsResult, schoolsResult] = await Promise.all([
    supabase.from("subjects").select("id,name,is_published").order("name").limit(100),
    supabase.from("topics").select("id,name,subject_id,is_published").order("name").limit(200),
    supabase.from("practice_questions").select("id,slug,topic_id,prompt,difficulty,is_published").order("slug").limit(100),
    supabase.from("daily_challenges").select("id,challenge_date,question_id,is_published").order("challenge_date", { ascending: false }).limit(31),
    supabase.from("exam_calendar").select("id,title,subject_id,school_id,scheduled_at,is_published").gte("scheduled_at", since).order("scheduled_at").limit(50),
    supabase.from("schools").select("id,name").order("name").limit(100),
  ]);
  const questionIds = questionsResult.data?.map((question) => question.id) ?? [];
  const answerKeysResult = questionIds.length
    ? await supabase.from("practice_answer_keys").select("question_id,correct_option_key").in("question_id", questionIds)
    : { data: [], error: null };

  const failed = [subjectsResult, topicsResult, questionsResult, answerKeysResult, challengesResult, examsResult, schoolsResult]
    .some((result) => result.error);
  const subjects = subjectsResult.data ?? [];
  const topics = topicsResult.data ?? [];
  const questions = questionsResult.data ?? [];
  const answerKeys = answerKeysResult.data ?? [];
  const challenges = challengesResult.data ?? [];
  const exams = examsResult.data ?? [];
  const schools = schoolsResult.data ?? [];
  const subjectsById = new Map(subjects.map((subject) => [subject.id, subject]));
  const topicsById = new Map(topics.map((topic) => [topic.id, topic]));
  const questionsById = new Map(questions.map((question) => [question.id, question]));
  const answerKeysByQuestionId = new Map(answerKeys.map((answerKey) => [answerKey.question_id, answerKey]));
  const schoolsById = new Map(schools.map((school) => [school.id, school]));
  const subjectName = (id: string | null) => id ? subjectsById.get(id)?.name ?? "Unknown subject" : "All subjects";
  const topicName = (id: string) => {
    const topic = topicsById.get(id);
    return topic ? `${subjectName(topic.subject_id)} · ${topic.name}` : "Unknown topic";
  };
  const questionLabel = (id: string) => questionsById.get(id)?.prompt ?? "Question unavailable";
  const schoolName = (id: string | null) => id ? schoolsById.get(id)?.name ?? "Unknown school" : "All learners";
  const correctOption = (id: string) => answerKeysByQuestionId.get(id)?.correct_option_key.toUpperCase() ?? "—";

  const errorMessages: Record<string, string> = {
    question: "Enter a question, four options, a correct answer, and a valid topic.",
    challenge: "Choose a valid date, question, and publication status.",
    exam: "Enter an exam title and a valid Ghana time and date.",
    chain: "Publish the question, topic, and subject before publishing a daily challenge.",
    attempts: "This challenge already has learner attempts, so its question cannot be replaced.",
    "answer-key": "Add a correct answer before publishing this question.",
    input: "That change was not valid.",
    save: "The change could not be saved. Check for a duplicate name or slug.",
  };
  const errorText = failed ? "Some assessment records could not be loaded. Refresh the page and check the Supabase connection." : query.error ? errorMessages[query.error] ?? "The change could not be completed." : undefined;
  const createdText: Record<string, string> = { question: "Question saved as a draft.", challenge: "Daily challenge saved.", exam: "Exam saved as a draft." };
  const updatedText: Record<string, string> = { question: "Question publication status updated.", challenge: "Daily challenge publication status updated.", exam: "Exam publication status updated." };

  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="text-sm font-semibold text-muted hover:text-brand-green">← Admin workspace</Link>
    <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-green">Practice and assessment</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Questions, daily challenges, and exams</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Create multiple-choice practice questions, schedule Ghana-time challenges, and manage the exam calendar.</p></div>
    {errorText && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">{errorText}</p>}
    {query.created && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">{createdText[query.created] ?? "Record created."}</p>}
    {query.updated && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">{updatedText[query.updated] ?? "Record updated."}</p>}

    <section className="mt-8 rounded-3xl border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold">Question bank</h2><p className="mt-1 text-sm text-muted">Multiple-choice questions are saved as drafts until published.</p></div><span className="text-xs text-muted">Showing up to 100</span></div>
      <form action={createPracticeQuestionAction} className="mt-5 grid gap-4 rounded-2xl bg-paper p-4 sm:p-5 lg:grid-cols-2">
        <label className="block text-sm font-semibold lg:col-span-2">Question prompt<textarea name="prompt" required maxLength={1000} rows={3} className={`${fieldClass} mt-1.5`} placeholder="Write a clear question" /></label>
        <label className="block text-sm font-semibold">Topic<select name="topic_id" required defaultValue="" className={`${fieldClass} mt-1.5`}><option value="" disabled>Select a topic</option>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topicName(topic.id)}</option>)}</select></label>
        <label className="block text-sm font-semibold">Difficulty<select name="difficulty" defaultValue="core" className={`${fieldClass} mt-1.5`}><option value="introductory">Introductory</option><option value="core">Core</option><option value="advanced">Advanced</option></select></label>
        {(["a", "b", "c", "d"] as const).map((option) => <label key={option} className="block text-sm font-semibold">Option {option.toUpperCase()}<input name={`option_${option}`} required maxLength={250} className={`${fieldClass} mt-1.5`} /></label>)}
        <label className="block text-sm font-semibold">Correct option<select name="correct_option_key" defaultValue="a" className={`${fieldClass} mt-1.5`}>{(["a", "b", "c", "d"] as const).map((option) => <option key={option} value={option}>Option {option.toUpperCase()}</option>)}</select></label>
        <label className="block text-sm font-semibold">Explanation<textarea name="explanation" maxLength={2000} rows={3} className={`${fieldClass} mt-1.5`} placeholder="Explain the reasoning" /></label>
        <div className="lg:col-span-2"><button disabled={!topics.length} className={buttonClass}>Save question draft</button></div>
      </form>
      <div className="mt-5 space-y-3">
        {questions.map((question) => <article key={question.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line p-4">
          <div className="min-w-0 flex-1"><p className="font-semibold">{question.prompt}</p><p className="mt-1 text-xs text-muted">{topicName(question.topic_id)} · {question.difficulty} · Correct answer: {correctOption(question.id)} · {question.is_published ? "Published" : "Draft"}</p></div>
          <form action={setQuestionPublishedAction}><input type="hidden" name="id" value={question.id} /><input type="hidden" name="published" value={question.is_published ? "false" : "true"} /><button className="rounded-xl border border-line px-3 py-2 text-xs font-semibold">{question.is_published ? "Unpublish" : "Publish"}</button></form>
        </article>)}
        {!questions.length && <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">No practice questions yet.</p>}
      </div>
    </section>

    <section className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-line bg-white p-5 sm:p-7">
        <h2 className="text-xl font-semibold">Daily challenge schedule</h2><p className="mt-1 text-sm leading-6 text-muted">Challenge dates use Ghana time. Learners can access a published challenge when its question, topic, and subject are all published.</p>
        <form action={scheduleDailyChallengeAction} className="mt-5 space-y-3 rounded-2xl bg-paper p-4">
          <label className="block text-sm font-semibold">Challenge date<input type="date" name="challenge_date" required defaultValue={todayInAccra()} className={`${fieldClass} mt-1.5`} /></label>
          <label className="block text-sm font-semibold">Question<select name="question_id" required defaultValue="" className={`${fieldClass} mt-1.5`}><option value="" disabled>Select a question</option>{questions.map((question) => <option key={question.id} value={question.id}>{topicName(question.topic_id)} · {question.prompt}</option>)}</select></label>
          <label className="block text-sm font-semibold">Status<select name="published" defaultValue="false" className={`${fieldClass} mt-1.5`}><option value="false">Draft</option><option value="true">Publish now</option></select></label>
          <button disabled={!questions.length} className={buttonClass}>Save challenge</button>
        </form>
        <div className="mt-4 space-y-3">
          {challenges.map((challenge) => <article key={challenge.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-4">
            <div className="min-w-0 flex-1"><p className="font-semibold">{challenge.challenge_date}</p><p className="mt-1 truncate text-xs text-muted">{questionLabel(challenge.question_id)} · {challenge.is_published ? "Published" : "Draft"}</p></div>
            <form action={setDailyChallengePublishedAction}><input type="hidden" name="id" value={challenge.id} /><input type="hidden" name="published" value={challenge.is_published ? "false" : "true"} /><button className="rounded-xl border border-line px-3 py-2 text-xs font-semibold">{challenge.is_published ? "Unpublish" : "Publish"}</button></form>
          </article>)}
          {!challenges.length && <p className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">No daily challenges scheduled.</p>}
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-white p-5 sm:p-7">
        <h2 className="text-xl font-semibold">Exam calendar</h2><p className="mt-1 text-sm leading-6 text-muted">Schedule an exam for all learners or assign it to a school. Times are interpreted as Ghana time (GMT).</p>
        <form action={createExamAction} className="mt-5 space-y-3 rounded-2xl bg-paper p-4">
          <label className="block text-sm font-semibold">Exam title<input name="title" required maxLength={160} className={`${fieldClass} mt-1.5`} placeholder="e.g. Mathematics revision session" /></label>
          <label className="block text-sm font-semibold">Subject<select name="subject_id" defaultValue="" className={`${fieldClass} mt-1.5`}><option value="">All subjects</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">School<select name="school_id" defaultValue="" className={`${fieldClass} mt-1.5`}><option value="">All learners</option>{schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">Date and time<input type="datetime-local" name="scheduled_at" required className={`${fieldClass} mt-1.5`} /></label>
          <button className={buttonClass}>Save exam draft</button>
        </form>
        <div className="mt-4 space-y-3">
          {exams.map((exam) => <article key={exam.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-4">
            <div className="min-w-0 flex-1"><p className="font-semibold">{exam.title}</p><p className="mt-1 text-xs text-muted">{formatAccraDateTime(exam.scheduled_at)} · {subjectName(exam.subject_id)} · {schoolName(exam.school_id)} · {exam.is_published ? "Published" : "Draft"}</p></div>
            <form action={setExamPublishedAction}><input type="hidden" name="id" value={exam.id} /><input type="hidden" name="published" value={exam.is_published ? "false" : "true"} /><button className="rounded-xl border border-line px-3 py-2 text-xs font-semibold">{exam.is_published ? "Unpublish" : "Publish"}</button></form>
          </article>)}
          {!exams.length && <p className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">No exams in the recent or upcoming calendar.</p>}
        </div>
      </div>
    </section>
  </div></main>;
}
