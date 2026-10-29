import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const areas = [
    { title: "User management", description: "Review role requests and manage account access.", href: "/admin/users", color: "bg-brand-green" },
    { title: "Curriculum content", description: "Create subjects, topics, and lesson drafts.", href: "/admin/content", color: "bg-[#a36a00]" },
    { title: "Questions and exams", description: "Build the practice bank, schedule daily challenges, and publish exam dates.", href: "/admin/assessments", color: "bg-brand-red" },
    { title: "Analytics", description: "Review learner activity and core platform metrics.", href: "/admin/analytics", color: "bg-ink" },
    { title: "Content moderation", description: "Review publication status and submitted content.", href: "/admin/moderation", color: "bg-brand-red" },
  ];

  return <main className="min-h-screen px-6 py-12"><div className="mx-auto max-w-6xl">
    <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-brand-green">← Student area</Link>
    <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-brand-green">Administration</p>
    <h1 className="mt-3 text-4xl font-semibold tracking-tight">Content workspace</h1>
    <p className="mt-3 max-w-2xl leading-7 text-muted">Review accounts, curriculum, assessments, and platform activity.</p>
    <div className="mt-9 grid gap-4 sm:grid-cols-2">
      {areas.map((area) => <Link key={area.title} href={area.href} className="group rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
        <span className={"grid size-11 place-items-center rounded-2xl text-lg font-bold text-white " + area.color} aria-hidden="true">↗</span>
        <h2 className="mt-5 text-lg font-semibold">{area.title}</h2><p className="mt-2 text-sm leading-6 text-muted">{area.description}</p>
      </Link>)}
    </div>
  </div></main>;
}
