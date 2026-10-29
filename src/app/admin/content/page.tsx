import Link from "next/link";
import {
  createLessonAction,
  createSubjectAction,
  createTopicAction,
  setContentPublishedAction,
} from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

type Subject = { id: string; name: string; description: string; is_published: boolean };
type Topic = { id: string; name: string; description: string; subject_id: string; is_published: boolean };
type Lesson = { id: string; title: string; summary: string; topic_id: string; estimated_minutes: number; is_published: boolean };

export default async function AdminContentPage({ searchParams }: { searchParams: Promise<{ error?: string; created?: string; updated?: string }> }) {
  const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]);
  const [{ data: subjects, error: subjectsError }, { data: topics, error: topicsError }, { data: lessons, error: lessonsError }] = await Promise.all([
    supabase.from("subjects").select("id,name,description,is_published").order("sort_order").order("name"),
    supabase.from("topics").select("id,name,description,subject_id,is_published").order("sort_order").order("name"),
    supabase.from("lessons").select("id,title,summary,topic_id,estimated_minutes,is_published").order("created_at", { ascending: false }),
  ]);

  const errorText = subjectsError || topicsError || lessonsError
    ? "Content tables are unavailable. Apply the Supabase migration first."
    : query.error === "save" ? "That content change could not be saved. Check that names are unique."
    : query.error ? "Please complete the required fields and try again."
    : undefined;
  const subjectRows = (subjects ?? []) as Subject[];
  const topicRows = (topics ?? []) as Topic[];
  const lessonRows = (lessons ?? []) as Lesson[];
  const subjectName = (id: string) => subjectRows.find((item) => item.id === id)?.name ?? "Unknown subject";
  const topicName = (id: string) => topicRows.find((item) => item.id === id)?.name ?? "Unknown topic";

  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="text-sm font-semibold text-muted hover:text-brand-green">← Admin workspace</Link>
    <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-green">Curriculum</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Subjects, topics, and lessons</h1><p className="mt-2 text-sm text-muted">New records are drafts until an admin publishes them.</p></div>
    {errorText && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">{errorText}</p>}
    {query.created && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">Created {query.created} draft.</p>}
    {query.updated && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">Publication status updated.</p>}

    <section className="mt-7 grid gap-5 lg:grid-cols-3">
      <form action={createSubjectAction} className="space-y-3 rounded-3xl border border-line bg-white p-5">
        <h2 className="font-semibold">Add subject</h2>
        <input name="name" required maxLength={100} placeholder="e.g. Mathematics" className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-green" />
        <textarea name="description" rows={3} maxLength={500} placeholder="Short description" className="w-full resize-y rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-green" />
        <button className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-green-dark">Create draft</button>
      </form>
      <form action={createTopicAction} className="space-y-3 rounded-3xl border border-line bg-white p-5">
        <h2 className="font-semibold">Add topic</h2>
        <select name="subject_id" required defaultValue="" className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"><option value="" disabled>Select a subject</option>{subjectRows.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select>
        <input name="name" required maxLength={100} placeholder="Topic name" className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-green" />
        <textarea name="description" rows={3} maxLength={500} placeholder="Short description" className="w-full resize-y rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-green" />
        <button disabled={!subjectRows.length} className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">Create draft</button>
      </form>
      <form action={createLessonAction} className="space-y-3 rounded-3xl border border-line bg-white p-5">
        <h2 className="font-semibold">Add lesson</h2>
        <select name="topic_id" required defaultValue="" className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"><option value="" disabled>Select a topic</option>{topicRows.map((topic) => <option key={topic.id} value={topic.id}>{subjectName(topic.subject_id)} · {topic.name}</option>)}</select>
        <input name="title" required maxLength={160} placeholder="Lesson title" className="w-full rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-green" />
        <input name="estimated_minutes" type="number" min={1} max={240} defaultValue={10} required aria-label="Estimated minutes" className="w-full rounded-xl border border-line px-3 py-2.5 text-sm" />
        <textarea name="summary" rows={2} maxLength={500} placeholder="Short summary" className="w-full resize-y rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-green" />
        <textarea name="body_markdown" rows={4} placeholder="Lesson content in Markdown" className="w-full resize-y rounded-xl border border-line px-3 py-2.5 text-sm outline-none focus:border-brand-green" />
        <button disabled={!topicRows.length} className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40">Create draft</button>
      </form>
    </section>

    <section className="mt-10 rounded-3xl border border-line bg-white p-5 sm:p-7">
      <h2 className="text-lg font-semibold">Content library</h2>
      <div className="mt-5 space-y-3">
        {subjectRows.map((subject) => <div key={subject.id} className="rounded-2xl bg-paper p-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{subject.name}</p><p className="text-xs text-muted">Subject · {subject.is_published ? "Published" : "Draft"}</p></div><form action={setContentPublishedAction}><input type="hidden" name="kind" value="subject" /><input type="hidden" name="id" value={subject.id} /><input type="hidden" name="published" value={subject.is_published ? "false" : "true"} /><button className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold">{subject.is_published ? "Unpublish" : "Publish"}</button></form></div>
          {topicRows.filter((topic) => topic.subject_id === subject.id).map((topic) => <div key={topic.id} className="ml-3 mt-3 border-l-2 border-brand-gold pl-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold">{topic.name}</p><p className="text-xs text-muted">Topic · {topic.is_published ? "Published" : "Draft"}</p></div><form action={setContentPublishedAction}><input type="hidden" name="kind" value="topic" /><input type="hidden" name="id" value={topic.id} /><input type="hidden" name="published" value={topic.is_published ? "false" : "true"} /><button className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold">{topic.is_published ? "Unpublish" : "Publish"}</button></form></div>
            {lessonRows.filter((lesson) => lesson.topic_id === topic.id).map((lesson) => <div key={lesson.id} className="ml-3 mt-3 flex flex-wrap items-center justify-between gap-3 border-l-2 border-brand-green/30 pl-4">
              <div><p className="text-sm">{lesson.title}</p><p className="text-xs text-muted">{lesson.estimated_minutes} min · {lesson.is_published ? "Published" : "Draft"}</p></div><form action={setContentPublishedAction}><input type="hidden" name="kind" value="lesson" /><input type="hidden" name="id" value={lesson.id} /><input type="hidden" name="published" value={lesson.is_published ? "false" : "true"} /><button className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold">{lesson.is_published ? "Unpublish" : "Publish"}</button></form>
            </div>)}
          </div>)}
        </div>)}
        {!subjectRows.length && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No subjects yet. Create the first subject above.</p>}
      </div>
    </section>
    <p className="mt-4 text-xs leading-5 text-muted">Publishing a lesson requires both its topic and subject to be published.</p>
  </div></main>;
}
