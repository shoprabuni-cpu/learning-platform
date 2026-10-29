import Link from "next/link";
import { signUpAction, signInWithGoogleAction } from "@/app/auth/actions";

const messages: Record<string, string> = {
  details: "Check your name, email, and password. Passwords must be at least 8 characters and match.",
  role: "Choose student, teacher, or parent.",
  signup: "We could not create the account. Check the details or try another email.",
  setup: "Connect Supabase in .env.local to enable registration.",
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  const message = query.error ? messages[query.error] : undefined;

  return (
    <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <section className="flex flex-col justify-between bg-brand-green p-7 text-white sm:p-10 lg:p-14">
        <Link href="/" className="flex items-center gap-3 text-sm font-bold"><span className="grid size-10 place-items-center rounded-2xl bg-brand-gold font-black text-ink">L</span>Learning Platform</Link>
        <div className="max-w-xl py-16"><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold">A fresh start</p><h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Make room for what you can learn.</h1><p className="mt-5 max-w-md leading-7 text-white/75">Create your account and find lessons, practice, and support for your learning journey.</p></div>
        <p className="text-xs text-white/60">Built for learners, families, and educators.</p>
      </section>
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="text-sm font-semibold text-muted hover:text-brand-green">← Home</Link>
          <h2 className="mt-8 text-3xl font-semibold tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-muted">Choose how you’ll use Learning Platform.</p>
          {message && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-red">{message}</p>}
          <form action={signInWithGoogleAction} className="mt-6"><button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-white px-4 py-3.5 text-sm font-semibold transition hover:border-brand-green/40 hover:bg-paper"><span className="grid size-5 place-items-center rounded-full border border-line text-xs font-bold">G</span> Continue with Google</button></form>
          <div className="my-5 flex items-center gap-4 text-xs text-muted"><span className="h-px flex-1 bg-line" />or sign up with email<span className="h-px flex-1 bg-line" /></div>
          <form action={signUpAction} className="space-y-3.5">
            <label className="block text-sm font-semibold">Full name<input name="full_name" autoComplete="name" required className="mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
            <label className="block text-sm font-semibold">I am a
              <select name="role" defaultValue="student" className="mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10"><option value="student">Student</option><option value="teacher">Teacher</option><option value="parent">Parent or guardian</option></select>
            </label>
            <label className="block text-sm font-semibold">Email address<input name="email" type="email" autoComplete="email" required className="mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
            <label className="block text-sm font-semibold">Password<input name="password" type="password" minLength={8} autoComplete="new-password" required className="mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /><span className="mt-1 block text-xs font-normal text-muted">Use at least 8 characters.</span></label>
            <label className="block text-sm font-semibold">Confirm password<input name="confirm_password" type="password" minLength={8} autoComplete="new-password" required className="mt-1.5 w-full rounded-2xl border border-line bg-white px-4 py-3 font-normal outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/10" /></label>
            <button className="mt-2 w-full rounded-2xl bg-brand-green px-4 py-4 text-sm font-bold text-white transition hover:bg-brand-green-dark">Create account</button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-bold text-brand-green hover:underline">Log in</Link></p>
        </div>
      </section>
    </main>
  );
}
