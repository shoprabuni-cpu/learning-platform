import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfileAction } from "@/app/profile/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const query = await searchParams;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login?error=setup");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles")
    .select("full_name,grade_level,learning_preferences")
    .eq("user_id", user.id)
    .maybeSingle();
  const preferences = (profile?.learning_preferences ?? {}) as Record<string, string>;

  const errorText = query.error === "name" ? "Enter a name between 2 and 100 characters."
    : query.error === "preference" ? "Choose a study-time preference."
    : query.error ? "Your changes could not be saved. Please try again."
    : undefined;

  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-2xl">
    <Link href="/dashboard" className="text-sm font-semibold text-muted hover:text-brand-green">← Dashboard</Link>
    <p className="mt-8 text-xs font-bold uppercase tracking-[.18em] text-brand-green">Your account</p>
    <h1 className="mt-2 text-3xl font-semibold tracking-tight">Learning profile</h1>
    <p className="mt-2 text-sm leading-6 text-muted">These details help shape your learning experience.</p>
    {query.saved && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">Profile saved.</p>}
    {errorText && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">{errorText}</p>}
    <form action={updateProfileAction} className="mt-7 space-y-5 rounded-3xl border border-line bg-white p-6 sm:p-8">
      <label className="block text-sm font-semibold">Full name<input name="full_name" required minLength={2} maxLength={100} defaultValue={profile?.full_name ?? ""} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
      <label className="block text-sm font-semibold">Email address<input value={user.email ?? ""} disabled className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3 font-normal text-muted" /><span className="mt-1 block text-xs font-normal text-muted">Email changes are managed through account security settings.</span></label>
      <label className="block text-sm font-semibold">Current grade or level<input name="grade_level" maxLength={40} placeholder="e.g. JHS 2" defaultValue={profile?.grade_level ?? ""} className="mt-2 w-full rounded-2xl border border-line px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
      <label className="block text-sm font-semibold">When do you prefer to study?
        <select name="study_time" defaultValue={preferences.preferred_study_time ?? "flexible"} className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10">
          <option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="flexible">No preference</option>
        </select>
      </label>
      <button className="rounded-2xl bg-brand-green px-5 py-3.5 text-sm font-bold text-white hover:bg-brand-green-dark">Save profile</button>
    </form>
  </div></main>;
}
