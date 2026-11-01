import Image from "next/image";
import Link from "next/link";

const learningMoments = [
  {
    image: "/images/lp-editorial-study.png",
    alt: "A student concentrating on schoolwork at a desk.",
    eyebrow: "At your pace",
    title: "Space to focus",
    description: "Take one clear step at a time with lessons you can return to whenever you need.",
  },
  {
    image: "/images/lp-editorial-classroom.png",
    alt: "A teacher helping students work through a mathematics lesson.",
    eyebrow: "With guidance",
    title: "Help along the way",
    description: "Build confidence with explanations and examples that make new ideas easier to follow.",
  },
  {
    image: "/images/lp-editorial-collaboration.png",
    alt: "Students sharing ideas as they study together.",
    eyebrow: "Together",
    title: "Learning is shared",
    description: "Make room for questions, practice, and the small wins that keep learning moving.",
  },
];

const subjects = [
  {
    title: "Mathematics",
    image: "/images/lp-subject-mathematics.png",
    alt: "Mathematics books, a calculator, and a geometry notebook.",
    description: "Build confidence with numbers and problem solving.",
  },
  {
    title: "English Language",
    image: "/images/lp-subject-english.png",
    alt: "Open books, a notebook, and pens for English study.",
    description: "Grow your reading, writing, and communication skills.",
  },
  {
    title: "Science",
    image: "/images/lp-subject-science.png",
    alt: "Science books, a microscope, and a chemistry notebook.",
    description: "Explore living things, matter, and the world around you.",
  },
  {
    title: "Social Studies",
    image: "/images/lp-subject-social-studies.png",
    alt: "A globe, maps, and books for social studies.",
    description: "Understand people, places, history, and community.",
  },
  {
    title: "ICT",
    image: "/images/lp-subject-ict.png",
    alt: "A laptop, tablet, and notebook for ICT learning.",
    description: "Discover digital skills, devices, and how technology works.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Learning Platform home">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand-green text-sm font-black text-white">L</span>
          <span className="text-base font-bold tracking-tight">Learning Platform</span>
        </Link>
        <nav className="flex items-center gap-3" aria-label="Account navigation">
          <Link href="/login" className="hidden rounded-full px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white sm:inline-flex">Log in</Link>
          <Link href="/register" className="rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark">Get started <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-16 pt-7 md:grid-cols-2 lg:gap-12 lg:px-10 lg:pb-24 lg:pt-12">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-green">
            <span className="size-2 rounded-full bg-brand-gold" />Built for the way you learn
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] text-ink sm:text-5xl lg:text-7xl">
            Small steps today. <span className="text-brand-green">Big confidence</span> tomorrow.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted">Lessons, practice, and progress in one welcoming place—made for learners, families, teachers, and schools in Ghana.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/register" className="rounded-full bg-brand-green px-6 py-4 text-sm font-bold text-white shadow-[0_12px_28px_-14px_rgba(0,107,63,.7)] transition hover:-translate-y-0.5 hover:bg-brand-green-dark">Start learning <span aria-hidden="true">→</span></Link>
            <Link href="/login" className="rounded-full border border-line bg-white px-6 py-4 text-sm font-bold transition hover:border-brand-green/35">I already have an account</Link>
          </div>
          <p className="mt-8 border-t border-line pt-5 text-sm text-muted"><span className="font-semibold text-ink">For every part of the journey.</span> Students, families, and educators.</p>
        </div>

        <div className="relative">
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-brand-gold/30 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-8 -left-8 size-44 rounded-full bg-brand-green/15 blur-3xl" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#f4efe0] shadow-[0_32px_100px_-48px_rgba(23,34,28,.45)] md:aspect-square lg:aspect-[6/5]">
            <picture className="absolute inset-0 block">
              <source media="(max-width: 767px)" srcSet="/images/lp-hero-mobile.png" />
              <Image
                src="/images/lp-hero-desktop.png"
                alt="A student and classmates learning in a sunny classroom in Ghana."
                fill
                loading="eager"
                sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) 45vw, 40vw"
                className="object-cover object-[72%_center]"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-green">A little progress adds up</p>
              <p className="mt-1 text-sm font-semibold text-ink sm:text-base">Find your next step, and keep going.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white" aria-labelledby="learning-moments-title">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">A steady way forward</p>
            <h2 id="learning-moments-title" className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Learning fits into real life.</h2>
            <p className="mt-4 text-base leading-7 text-muted">Study on your own, ask for guidance, and share what you discover along the way.</p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {learningMoments.map((moment) => (
              <article key={moment.title} className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f4efe0]">
                  <Image src={moment.image} alt={moment.alt} fill sizes="(max-width: 768px) calc(100vw - 3rem), 33vw" className="object-cover transition duration-500 hover:scale-[1.03]" />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-green">{moment.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">{moment.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{moment.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20" aria-labelledby="subjects-title">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-green">Start with a subject</p>
          <h2 id="subjects-title" className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Explore the subjects.</h2>
          <p className="mt-4 text-base leading-7 text-muted">Choose a subject and build understanding through clear lessons and steady practice.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {subjects.map((subject) => (
            <Link key={subject.title} href="/register" className="group overflow-hidden rounded-[1.5rem] border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#fff8df]">
                <Image src={subject.image} alt={subject.alt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 20vw" className="object-contain p-3 transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold tracking-tight text-ink">{subject.title}</h3>
                <p className="mt-2 min-h-12 text-xs leading-5 text-muted">{subject.description}</p>
                <span className="mt-3 inline-flex text-xs font-bold text-brand-green">Explore subject <span className="ml-1" aria-hidden="true">↗</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-line px-6 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>© {new Date().getFullYear()} Learning Platform</p><p>Made for steady progress and stronger learning.</p>
      </footer>
    </main>
  );
}
