import Link from "next/link";

export default function CheckEmailPage() {
  return <main className="grid min-h-screen place-items-center px-6"><section className="w-full max-w-lg rounded-[2rem] border border-line bg-white p-8 text-center shadow-sm sm:p-12">
    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#fff7d7] text-2xl" aria-hidden="true">✉</span>
    <p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-brand-green">One more step</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Check your email</h1>
    <p className="mt-4 leading-7 text-muted">We sent a verification link to your inbox. Open it to confirm your email and finish creating your account.</p>
    <Link href="/login" className="mt-8 inline-flex rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-green-dark">Back to log in</Link>
  </section></main>;
}
