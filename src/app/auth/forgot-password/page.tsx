import Link from "next/link";
import { requestPasswordResetAction } from "@/app/auth/actions";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ sent?: string; error?: string }> }) {
  const query = await searchParams;
  return <main className="grid min-h-screen place-items-center px-6 py-12"><section className="w-full max-w-md rounded-[2rem] border border-line bg-white p-8 shadow-sm sm:p-10">
    <Link href="/login" className="text-sm font-semibold text-muted hover:text-brand-green">← Back to log in</Link>
    <h1 className="mt-8 text-3xl font-semibold tracking-tight">Reset your password</h1><p className="mt-3 text-sm leading-6 text-muted">Enter the email address on your account. If it matches an account, we’ll send a reset link.</p>
    {query.sent && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">If an account uses that email, a password reset link is on its way.</p>}
    {query.error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">Enter a valid email address and try again.</p>}
    <form action={requestPasswordResetAction} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Email address<input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3.5 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label><button className="w-full rounded-2xl bg-brand-green px-4 py-4 text-sm font-bold text-white hover:bg-brand-green-dark">Send reset link</button></form>
  </section></main>;
}
