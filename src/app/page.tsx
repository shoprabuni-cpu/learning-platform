import Link from "next/link";

const features = [
  { number: "01", title: "Learn at your pace", text: "Clear lessons, practical examples, and study resources built around your curriculum." },
  { number: "02", title: "Practice with purpose", text: "Short quizzes help you spot what you know and where to focus next." },
  { number: "03", title: "See your progress", text: "A steady view of your effort, achievements, and next steps keeps learning moving." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Learning Platform home">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand-green text-sm font-black text-white">L</span>
          <span className="text-base font-bold tracking-tight">Learning Platform</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="hidden rounded-full px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white sm:inline-flex">Log in</Link>
          <Link href="/register" className="rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark">Get started <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-20">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-green">
            <span className="size-2 rounded-full bg-brand-gold" />Built for the way you learn
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-ink sm:text-6xl lg:text-7xl">
            Small steps today. <span className="text-brand-green">Big confidence</span> tomorrow.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted">Lessons, practice, and progress in one welcoming place—made for learners, families, teachers, and schools in Ghana.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/register" className="rounded-full bg-brand-green px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-14px_rgba(0,107,63,.7)] transition hover:-translate-y-0.5 hover:bg-brand-green-dark">Start learning <span aria-hidden="true">→</span></Link>
            <Link href="/login" className="rounded-full border border-line bg-white px-6 py-4 text-sm font-bold transition hover:border-brand-green/35">I already have an account</Link>
          </div>
          <div className="mt-12 flex items-center gap-4 border-t border-line pt-6">
            <div className="flex -space-x-2" aria-hidden="true">
              <span className="grid size-9 place-items-center rounded-full border-2 border-paper bg-[#e6c2a5] text-xs font-bold">S</span>
              <span className="grid size-9 place-items-center rounded-full border-2 border-paper bg-[#d9b48e] text-xs font-bold">T</span>
              <span className="grid size-9 place-items-center rounded-full border-2 border-paper bg-[#9a694f] text-xs font-bold text-white">P</span>
            </div>
            <p className="text-sm text-muted"><span className="font-semibold text-ink">For every part of the journey.</span><br />Students, families, and educators.</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-12 -top-10 size-44 rounded-full bg-brand-gold/25 blur-3xl" />
          <div className="absolute -bottom-10 -left-12 size-48 rounded-full bg-brand-green/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white bg-white p-4 shadow-[0_32px_100px_-48px_rgba(23,34,28,.35)] sm:p-6">
            <div className="flex items-center justify-between border-b border-line px-2 pb-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Your learning space</p><p className="mt-1 text-lg font-bold">A little progress adds up.</p></div>
              <span className="grid size-10 place-items-center rounded-full bg-[#fff7d7] text-xl" aria-hidden="true">✦</span>
            </div>
            <div className="mt-5 rounded-3xl bg-brand-green p-6 text-white sm:p-8">
              <div className="flex items-start justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Today’s focus</p><h2 className="mt-3 max-w-xs text-2xl font-semibold leading-tight">Make sense of fractions</h2><p className="mt-2 text-sm text-white/75">Mathematics · 12 min lesson</p></div>
                <span className="grid size-11 place-items-center rounded-2xl bg-brand-gold text-xl text-ink" aria-hidden="true">÷</span>
              </div>
              <div className="mt-8 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[68%] rounded-full bg-brand-gold" /></div><span className="text-xs font-semibold text-white/80">68%</span></div>
              <div className="mt-6 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-bold text-brand-green">Continue lesson <span className="ml-2" aria-hidden="true">→</span></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-line bg-paper p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Study streak</span><span aria-hidden="true">🔥</span></div><p className="mt-4 text-3xl font-semibold tracking-tight">5 <span className="text-sm font-medium text-muted">days</span></p><p className="mt-1 text-xs text-muted">You’re building a good habit.</p></div>
              <div className="rounded-3xl border border-line bg-paper p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold">Next up</span><span aria-hidden="true">✎</span></div><p className="mt-4 text-base font-bold">Daily quiz</p><p className="mt-1 text-xs text-muted">5 questions · about 4 min</p></div>
            </div>
            <p className="px-2 pt-4 text-center text-[11px] text-muted">A preview of the student dashboard</p>
          </div>
          <div className="absolute -left-5 top-1/3 hidden rounded-2xl border border-line bg-white px-4 py-3 shadow-lg sm:block"><p className="text-[10px] font-bold uppercase tracking-wider text-muted">This week</p><p className="mt-1 text-sm font-bold text-brand-green">You showed up 4 times</p></div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-3 lg:px-10 lg:py-16">
          {features.map((feature) => <article key={feature.number}><p className="text-xs font-bold tracking-[0.18em] text-brand-red">{feature.number}</p><h2 className="mt-4 text-xl font-semibold tracking-tight">{feature.title}</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted">{feature.text}</p></article>)}
        </div>
      </section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>© {new Date().getFullYear()} Learning Platform</p><p>Made for steady progress and stronger learning.</p>
      </footer>
    </main>
  );
}
