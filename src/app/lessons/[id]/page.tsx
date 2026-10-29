import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { completeLessonAction } from "@/app/lessons/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function InlineText({ value }: { value: string }) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);
  return <>{parts.map((part, index) => part.startsWith("**") && part.endsWith("**")
    ? <strong key={index}>{part.slice(2, -2)}</strong>
    : <span key={index}>{part}</span>)}</>;
}

function LessonBody({ markdown }: { markdown: string }) {
  const blocks = markdown.trim().split(/\n\s*\n/).filter(Boolean);
  return <div className="lesson-copy space-y-5">
    {blocks.map((block, index) => {
      const heading = block.match(/^(#{1,3})\s+(.+)$/);
      if (heading) return <h2 key={index} className="text-2xl font-semibold tracking-tight">{heading[2]}</h2>;
      const lines = block.split("\n");
      if (lines.every((line) => line.trim().startsWith("- "))) {
        return <ul key={index} className="list-disc space-y-2 pl-6 leading-7 text-ink">{lines.map((line, itemIndex) => <li key={itemIndex}><InlineText value={line.trim().slice(2)} /></li>)}</ul>;
      }
      return <p key={index} className="leading-8 text-ink">{lines.map((line, lineIndex) => <span key={lineIndex}>{lineIndex > 0 && <br />}<InlineText value={line} /></span>)}</p>;
    })}
  </div>;
}

export default async function LessonPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ completed?: string; error?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login?error=setup");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lesson } = await supabase.from("lessons")
    .select("id,title,summary,body_markdown,estimated_minutes,topic_id")
    .eq("id", id).eq("is_published", true).maybeSingle();
  if (!lesson) notFound();

  const [{ data: topic }, { data: completion }] = await Promise.all([
    supabase.from("topics").select("name,subject_id").eq("id", lesson.topic_id).maybeSingle(),
    supabase.from("learning_activity").select("id").eq("user_id", user.id).eq("activity_type", "lesson_completed").eq("reference_id", id).limit(1).maybeSingle(),
  ]);
  const { data: subject } = topic
    ? await supabase.from("subjects").select("name").eq("id", topic.subject_id).maybeSingle()
    : { data: null };

  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-3xl">
    <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-brand-green">← Dashboard</Link>
    <header className="mt-8 border-b border-line pb-7">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-green">{subject?.name ?? "Learning"}{topic?.name ? " · " + topic.name : ""}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{lesson.title}</h1>
      {lesson.summary && <p className="mt-3 text-lg leading-7 text-muted">{lesson.summary}</p>}
      <p className="mt-4 text-xs font-semibold text-muted">{lesson.estimated_minutes} minute lesson</p>
    </header>
    {query.completed && <p className="mt-6 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">Lesson completed. Nice work.</p>}
    {query.error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">We couldn’t save completion. Please try again.</p>}
    <article className="py-9"><LessonBody markdown={lesson.body_markdown || "Your lesson content will appear here."} /></article>
    {completion ? <p className="rounded-2xl bg-paper p-4 text-sm font-semibold text-brand-green">You’ve completed this lesson.</p> :
      <form action={completeLessonAction} className="border-t border-line pt-6"><input type="hidden" name="lesson_id" value={lesson.id} /><button className="rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-green-dark">Mark as complete</button></form>}
  </div></main>;
}
