import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
export const dynamic = "force-dynamic";
export default async function AdminModerationPage() {
  await requireAdmin();
  return <main className="min-h-screen px-6 py-12"><div className="mx-auto max-w-4xl">
    <Link href="/admin" className="text-sm font-semibold text-muted hover:text-brand-green">← Admin workspace</Link>
    <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-brand-green">Review queue</p><h1 className="mt-2 text-3xl font-semibold">Content moderation</h1>
    <p className="mt-4 max-w-xl leading-7 text-muted">Curriculum publication is controlled from the content workspace. A full moderation queue for teacher and student submissions is planned for a later Phase 1 slice.</p>
    <Link href="/admin/content" className="mt-6 inline-flex rounded-full bg-brand-green px-5 py-3 text-sm font-bold text-white hover:bg-brand-green-dark">Review curriculum drafts</Link>
  </div></main>;
}
