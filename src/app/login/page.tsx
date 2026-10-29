import Link from "next/link";
import { signInAction, signInWithGoogleAction } from "@/app/auth/actions";

const messages: Record<string, string> = {
  missing: "Enter your email and password.",
  invalid: "Those sign-in details could not be verified.",
  google: "Google sign-in could not be started. Please try again.",
  callback: "That sign-in link has expired. Please sign in again.",
  setup: "Connect Supabase in .env.local to enable sign-in.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; updated?: string }> }) {
  const query = await searchParams;
  const message = query.error ? messages[query.error] : undefined;

  return (
    <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <section className="flex flex-col justify-between bg-brand-green p-7 text-white sm:p-10 lg:p-14">
        <Link href="/" className="flex items-center gap-3 text-sm font-bold"><span className="grid size-10 place-items-center rounded-2xl bg-brand-gold font-black text-ink">L</span>Learning Platform</Link>
        <div className="max-w-xl py-16"><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold">Welcome back</p><h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Your next good study session starts here.</h1><p className="mt-5 max-w-md leading-7 text-white/75">Pick up where you left off, take a quick quiz, or make a fresh start today.</p></div>
        <p className="text-xs text-white/60">Steady progress, one lesson at a time.</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm font-semibold text-muted hover:text-brand-green">← Home</Link>
          <h2 className="mt-10 text-3xl font-semibold tracking-tight">Log in</h2>
          <p className="mt-2 text-sm text-muted">Continue your Learning Platform journey.</p>
          {query.updated && <p className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-brand-green">Your password has been updated. You can log in now.</p>}
          {message && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">{message}</p>}
          <form action={signInWithGoogleAction} className="mt-8"><button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-semibold transition hover:border-brand-green/40 hover:bg-paper"><span className="grid size-5 place-items-center rounded-full border border-line text-xs font-bold">G</span> Continue with Google</button></form>
          <div className="my-7 flex items-center gap-4 text-xs text-muted"><span className="h-px flex-1 bg-line" />or use email<span className="h-px flex-1 bg-line" /></div>
          <form action={signInAction} className="space-y-4">
            <label className="block text-sm font-semibold">Email address<input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3.5 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
            <label className="block text-sm font-semibold">Password<input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3.5 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
            <div className="flex justify-end"><Link href="/auth/forgot-password" className="text-sm font-semibold text-brand-green hover:underline">Forgot password?</Link></div>
            <button className="w-full rounded-2xl bg-brand-green px-4 py-4 text-sm font-bold text-white transition hover:bg-brand-green-dark">Log in</button>
          </form>
          <p className="mt-7 text-center text-sm text-muted">New here? <Link href="/register" className="font-bold text-brand-green hover:underline">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
