import Link from "next/link";
import { updatePasswordAction } from "@/app/auth/actions";

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  return <main className="grid min-h-screen place-items-center px-6 py-12"><section className="w-full max-w-md rounded-[2rem] border border-line bg-white p-8 shadow-sm sm:p-10">
    <Link href="/login" className="text-sm font-semibold text-muted hover:text-brand-green">← Back to log in</Link>
    <h1 className="mt-8 text-3xl font-semibold tracking-tight">Choose a new password</h1><p className="mt-3 text-sm leading-6 text-muted">Use at least 8 characters for your new password.</p>
    {query.error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">The passwords may not match, or the reset link may have expired. Request a new link and try again.</p>}
    <form action={updatePasswordAction} className="mt-7 space-y-4">
      <label className="block text-sm font-semibold">New password<input name="password" type="password" minLength={8} autoComplete="new-password" required className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3.5 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
      <label className="block text-sm font-semibold">Confirm new password<input name="confirm_password" type="password" minLength={8} autoComplete="new-password" required className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3.5 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
      <button className="w-full rounded-2xl bg-brand-green px-4 py-4 text-sm font-bold text-white hover:bg-brand-green-dark">Update password</button>
    </form>
  </section></main>;
}
