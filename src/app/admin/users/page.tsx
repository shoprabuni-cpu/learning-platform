import Link from "next/link";
import { setRoleStatusAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ error?: string; updated?: string }> }) {
  const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]);
  const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] = await Promise.all([
    supabase.from("profiles").select("user_id,full_name,created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("user_roles").select("user_id,role,status,created_at").order("created_at", { ascending: false }),
  ]);

  const errorText = profilesError || rolesError
    ? "Could not load user records. Confirm the Supabase migration has been applied."
    : query.error === "save" ? "That role change could not be saved."
    : query.error === "input" ? "The role request was not valid."
    : undefined;

  return <main className="min-h-screen px-6 py-10"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="text-sm font-semibold text-muted hover:text-brand-green">← Admin workspace</Link>
    <div className="mt-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-green">Administration</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">User management</h1></div><p className="text-sm text-muted">Showing up to 100 profiles</p></div>
    {errorText && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">{errorText}</p>}
    {query.updated && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">Role status updated.</p>}
    <div className="mt-7 overflow-hidden rounded-3xl border border-line bg-white">
      <div className="grid grid-cols-[1.1fr_1.3fr_1.4fr] gap-4 border-b border-line bg-paper px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted"><span>Account</span><span>Requested access</span><span>Review</span></div>
      {!profiles?.length && <p className="p-8 text-center text-sm text-muted">No profiles found yet.</p>}
      {profiles?.map((profile: { user_id: string; full_name: string; created_at: string }) => {
        const userRoles = roles?.filter((role: { user_id: string }) => role.user_id === profile.user_id) ?? [];
        return <div key={profile.user_id} className="grid gap-4 border-b border-line px-5 py-5 last:border-0 sm:grid-cols-[1.1fr_1.3fr_1.4fr] sm:items-center">
          <div><p className="font-semibold">{profile.full_name || "Unnamed account"}</p><p className="mt-1 font-mono text-[11px] text-muted">{profile.user_id.slice(0, 8)}…</p></div>
          <div className="space-y-2">{userRoles.length ? userRoles.map((role: { user_id: string; role: string; status: string }) => <div key={role.role} className="flex items-center gap-2 text-sm"><span className="capitalize">{role.role.replace("_", " ")}</span><span className={"rounded-full px-2.5 py-1 text-[11px] font-semibold " + (role.status === "active" ? "bg-green-50 text-brand-green" : role.status === "pending" ? "bg-[#fff7d7] text-[#765600]" : "bg-red-50 text-brand-red")}>{role.status}</span></div>) : <span className="text-sm text-muted">No role assigned</span>}</div>
          <div className="space-y-2">{userRoles.filter((role: { role: string }) => role.role !== "admin").map((role: { user_id: string; role: string; status: string }) => <form key={role.role} action={setRoleStatusAction} className="flex items-center gap-2">
            <input type="hidden" name="user_id" value={profile.user_id} /><input type="hidden" name="role" value={role.role} />
            <select name="status" defaultValue={role.status} aria-label={"Access status for " + role.role} className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2 text-xs">
              <option value="pending">Pending</option><option value="active">Active</option><option value="suspended">Suspended</option>
            </select>
            <button className="rounded-xl bg-brand-green px-3 py-2 text-xs font-bold text-white hover:bg-brand-green-dark">Save</button>
          </form>)}</div>
        </div>;
      })}
    </div>
    <p className="mt-4 text-xs leading-5 text-muted">Email addresses are intentionally not exposed by the public profile schema. Account identities remain managed by Supabase Auth.</p>
  </div></main>;
}
