import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
export const dynamic = "force-dynamic";
export default async function AdminAnalyticsPage() {
  await requireAdmin();
  return <main className="min-h-screen px-6 py-12"><div className="mx-auto max-w-4xl">
    <Link href="/admin" className="text-sm font-semibold text-muted hover:text-brand-green">← Admin workspace</Link>
    <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-brand-green">Reporting</p><h1 className="mt-2 text-3xl font-semibold">Analytics</h1>
    <p className="mt-4 max-w-xl leading-7 text-muted">Analytics will become useful once quiz attempts and lesson activity are being recorded. The data foundation is tracked in Phase 1.</p>
  </div></main>;
}
