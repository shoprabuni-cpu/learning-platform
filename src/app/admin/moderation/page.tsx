import Link from "next/link";
import { setContentPublishedAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

type Query = { error?: string; updated?: string };

export default async function AdminModerationPage({ searchParams }: { searchParams: Promise<Query> }) {
  const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]);
  const [subjectsResult, topicsResult, lessonsResult] = await Promise.all([
    supabase.from("subjects").select("id,name,description,is_published").order("created_at", { ascending: false }).limit(100),
    supabase.from("topics").select("id,name,description,subject_id,is_published").order("created_at", { ascending: false }).limit(200),
    supabase.from("lessons").select("id,title,summary,topic_id").eq("is_published", false).order("created_at", { ascending: false }).limit(100),
  ]);
  const failed = subjectsResult.error || topicsResult.error || lessonsResult.error;
  const subjects = (subjectsResult.data ?? []).filter((subject) => !subject.is_published);
  const topics = (topicsResult.data ?? []).filter((topic) => !topic.is_published);
  const subjectsById = new Map((subjectsResult.data ?? []).map((subject) => [subject.id, subject]));
  const topicsById = new Map((topicsResult.data ?? []).map((topic) => [topic.id, topic]));
  const lessons = lessonsResult.data ?? [];
  const loadFailed = Boolean(failed);
  const topicLabel = (subjectId: string) => subjectsById.get(subjectId)?.name ?? "Unknown subject";
  const lessonLabel = (topicId: string) => {
    const topic = topicsById.get(topicId);
    return topic ? `${subjectsById.get(topic.subject_id)?.name ?? "Unknown subject"} · ${topic.name}` : "Unknown topic";
  };

  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-5xl">
    <Link href="/admin" className="text-sm font-semibold text-muted hover:text-brand-green">← Admin workspace</Link>
    <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-green">Review queue</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Content moderation</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Review curriculum drafts before learners can see them. Question, challenge, and exam publication is managed in the assessment workspace.</p></div>
    {loadFailed && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">Some draft records could not be loaded.</p>}
    {query.error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">The publication change could not be saved.</p>}
    {query.updated && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">Draft published.</p>}

    <div className="mt-7 grid gap-5 lg:grid-cols-3">
      <section className="rounded-3xl border border-line bg-white p-5">
        <h2 className="font-semibold">Subject drafts <span className="ml-1 text-xs text-muted">{subjects.length}</span></h2>
        <div className="mt-4 space-y-3">
          {subjects.map((subject) => <article key={subject.id} className="rounded-2xl bg-paper p-4"><p className="font-semibold">{subject.name}</p><p className="mt-1 text-xs leading-5 text-muted">{subject.description || "No description"}</p><form action={setContentPublishedAction} className="mt-3"><input type="hidden" name="kind" value="subject" /><input type="hidden" name="id" value={subject.id} /><input type="hidden" name="published" value="true" /><input type="hidden" name="origin" value="moderation" /><button className="rounded-xl bg-brand-green px-3 py-2 text-xs font-bold text-white">Publish subject</button></form></article>)}
          {!subjects.length && <p className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">No subject drafts.</p>}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-5">
        <h2 className="font-semibold">Topic drafts <span className="ml-1 text-xs text-muted">{topics.length}</span></h2>
        <div className="mt-4 space-y-3">
          {topics.map((topic) => <article key={topic.id} className="rounded-2xl bg-paper p-4"><p className="text-xs text-muted">{topicLabel(topic.subject_id)}</p><p className="mt-1 font-semibold">{topic.name}</p><p className="mt-1 text-xs leading-5 text-muted">{topic.description || "No description"}</p><form action={setContentPublishedAction} className="mt-3"><input type="hidden" name="kind" value="topic" /><input type="hidden" name="id" value={topic.id} /><input type="hidden" name="published" value="true" /><input type="hidden" name="origin" value="moderation" /><button className="rounded-xl bg-brand-green px-3 py-2 text-xs font-bold text-white">Publish topic</button></form></article>)}
          {!topics.length && <p className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">No topic drafts.</p>}
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-white p-5">
        <h2 className="font-semibold">Lesson drafts <span className="ml-1 text-xs text-muted">{lessons.length}</span></h2>
        <div className="mt-4 space-y-3">
          {lessons.map((lesson) => <article key={lesson.id} className="rounded-2xl bg-paper p-4"><p className="text-xs text-muted">{lessonLabel(lesson.topic_id)}</p><p className="mt-1 font-semibold">{lesson.title}</p><p className="mt-1 text-xs leading-5 text-muted">{lesson.summary || "No summary"}</p><form action={setContentPublishedAction} className="mt-3"><input type="hidden" name="kind" value="lesson" /><input type="hidden" name="id" value={lesson.id} /><input type="hidden" name="published" value="true" /><input type="hidden" name="origin" value="moderation" /><button className="rounded-xl bg-brand-green px-3 py-2 text-xs font-bold text-white">Publish lesson</button></form></article>)}
          {!lessons.length && <p className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">No lesson drafts.</p>}
        </div>
      </section>
    </div>
    <Link href="/admin/assessments" className="mt-6 inline-flex rounded-full border border-line bg-white px-5 py-3 text-sm font-bold text-ink hover:border-brand-green">Review assessment drafts</Link>
  </div></main>;
}
