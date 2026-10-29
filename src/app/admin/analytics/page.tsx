import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

function dateInAccra(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return <article className="rounded-3xl border border-line bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p></article>;
}

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000).toISOString();
  const [profiles, students, pendingRoles, lessons, questions, attempts, upcomingExams, activity] = await Promise.all([
    supabase.from("profiles").select("user_id", { count: "exact", head: true }),
    supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "student").eq("status", "active"),
    supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("lessons").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("practice_questions").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
    supabase.from("exam_calendar").select("id", { count: "exact", head: true }).eq("is_published", true).gte("scheduled_at", now.toISOString()),
    supabase.from("learning_activity").select("user_id,activity_type,occurred_at").gte("occurred_at", fourteenDaysAgo).order("occurred_at", { ascending: false }).limit(500),
  ]);

  const metrics = [profiles, students, pendingRoles, lessons, questions, attempts, upcomingExams];
  const loadFailed = metrics.some((result) => result.error) || activity.error;
  const metricValue = (result: { count: number | null; error: unknown }) => result.error ? "—" : result.count ?? 0;
  const events = activity.data ?? [];
  const activityByDay = new Map<string, number>();
  const activeLearners = new Set<string>();
  for (const event of events) {
    const day = dateInAccra(new Date(event.occurred_at));
    activityByDay.set(day, (activityByDay.get(day) ?? 0) + 1);
    activeLearners.add(event.user_id);
  }
  const today = dateInAccra(now);
  const start = new Date(`${today}T00:00:00.000Z`).getTime();
  const days = Array.from({ length: 14 }, (_, index) => new Date(start - (13 - index) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const maxEvents = Math.max(1, ...days.map((day) => activityByDay.get(day) ?? 0));
  const dateLabel = (day: string) => new Intl.DateTimeFormat("en-GH", { timeZone: "Africa/Accra", month: "short", day: "numeric" }).format(new Date(`${day}T12:00:00.000Z`));

  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="text-sm font-semibold text-muted hover:text-brand-green">← Admin workspace</Link>
    <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-green">Reporting</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Learning analytics</h1><p className="mt-2 text-sm leading-6 text-muted">A live overview of accounts, published learning content, exam dates, and recorded activity.</p></div>
    {loadFailed && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">Some metrics could not be loaded. Values shown as dashes are unavailable.</p>}
    <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard label="Profiles" value={metricValue(profiles)} />
      <MetricCard label="Active students" value={metricValue(students)} />
      <MetricCard label="Pending role requests" value={metricValue(pendingRoles)} />
      <MetricCard label="Quiz attempts" value={metricValue(attempts)} />
      <MetricCard label="Published lessons" value={metricValue(lessons)} />
      <MetricCard label="Published questions" value={metricValue(questions)} />
      <MetricCard label="Upcoming exams" value={metricValue(upcomingExams)} />
      <MetricCard label="Accounts active in recent events" value={activity.error ? "—" : activeLearners.size} />
    </section>

    <section className="mt-6 rounded-3xl border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-semibold">Recorded learning activity</h2><p className="mt-1 text-sm text-muted">Daily events over the last 14 days, using Ghana time.</p></div><p className="text-xs text-muted">Up to 500 recent events</p></div>
      {activity.error ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">Activity records are unavailable.</p> : <div className="mt-6 space-y-3">
        {days.map((day) => {
          const count = activityByDay.get(day) ?? 0;
          const width = `${(count / maxEvents) * 100}%`;
          return <div key={day} className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-3 text-xs"><span className="text-muted">{dateLabel(day)}</span><div className="h-3 overflow-hidden rounded-full bg-paper"><div className="h-full rounded-full bg-brand-green" style={{ width }} /></div><span className="text-right font-semibold tabular-nums">{count}</span></div>;
        })}
        {!events.length && <p className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">No activity has been recorded in this period.</p>}
      </div>}
      <p className="mt-5 text-xs leading-5 text-muted">Learner activity is computed from the most recent 500 events returned for this period; high-volume periods may be capped.</p>
    </section>
  </div></main>;
}
