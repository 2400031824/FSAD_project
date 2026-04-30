import { Link } from "wouter";
import { ArrowUpRight, BarChart3, BrainCircuit, CalendarCheck, Network, ShieldCheck, Sparkles } from "lucide-react";

const tickerItems = [
  "AI-powered matching",
  "Real-time interaction",
  "Smart talent graph",
  "Precision analytics",
  "Drive automation",
  "Offer tracking",
];

const features = [
  {
    icon: BrainCircuit,
    title: "Neural Match Engine",
    desc: "Skill, branch, CGPA, project, and recruiter signals get scored into a live placement fit map.",
  },
  {
    icon: Network,
    title: "Interaction Layer",
    desc: "Students, placement officers, and recruiters move through one shared workflow without status confusion.",
  },
  {
    icon: BarChart3,
    title: "Pipeline Analytics",
    desc: "Every drive, interview, shortlist, and offer is visible before bottlenecks become placement-day chaos.",
  },
  {
    icon: ShieldCheck,
    title: "Role Control",
    desc: "Students and employers get different views, while placement teams keep command over the full system.",
  },
  {
    icon: CalendarCheck,
    title: "Drive Scheduling",
    desc: "Interview slots, company visits, and deadlines stay organized inside the campus placement console.",
  },
  {
    icon: Sparkles,
    title: "Resume Intelligence",
    desc: "Student resumes turn into structured profile data that recruiters can actually search and compare.",
  },
];

const steps = ["Ingest", "Rank", "Interact", "Place"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080808] text-[#f0ede8]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#080808]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <Link href="/" className="text-base font-extrabold tracking-tight">
            PL<span className="text-[#c8f04a]">A</span>CEMENTMASTER
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#platform" className="font-mono-ui text-[0.7rem] uppercase tracking-[0.16em] text-[#f0ede8]/45 hover:text-[#f0ede8]">
              Platform
            </a>
            <a href="#flow" className="font-mono-ui text-[0.7rem] uppercase tracking-[0.16em] text-[#f0ede8]/45 hover:text-[#f0ede8]">
              How it works
            </a>
            <a href="#results" className="font-mono-ui text-[0.7rem] uppercase tracking-[0.16em] text-[#f0ede8]/45 hover:text-[#f0ede8]">
              Results
            </a>
          </div>
          <Link href="/auth" className="pis-button inline-flex items-center gap-2 px-4 py-2 hover:opacity-85">
            Get access <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-5 pb-16 pt-32 md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(200,240,74,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(200,240,74,0.035)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black,transparent)]" />
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="pis-kicker mb-7 flex items-center gap-3 before:h-px before:w-8 before:bg-[#c8f04a]">
            Placement Interaction System v2.0
          </div>
          <h1 className="max-w-5xl text-[clamp(3.5rem,9vw,8rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
            CONNECT.
            <br />
            <span className="text-transparent [-webkit-text-stroke:1px_rgba(240,237,232,0.35)]">PLACE.</span>
            <br />
            <span className="text-[#c8f04a]">LAUNCH.</span>
          </h1>
          <p className="mt-10 max-w-xl font-mono-ui text-sm leading-8 text-[#f0ede8]/45">
            A campus placement system that maps students to opportunity with precision. Real-time interaction, clean role-based workflows, and full placement visibility.
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link href="/auth?role=student" className="pis-button inline-flex justify-center px-8 py-4 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(200,240,74,0.25)]">
              I am a student
            </Link>
            <Link href="/auth?role=employer" className="inline-flex justify-center border border-white/[0.08] px-8 py-4 font-mono-ui text-xs uppercase tracking-[0.14em] text-[#f0ede8] hover:border-white/25">
              I am an employer
            </Link>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-white/[0.08] bg-[#141414] py-4">
        <div className="flex w-max animate-[ticker_22s_linear_infinite] gap-14 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`} className="font-mono-ui text-[0.7rem] uppercase tracking-[0.15em] text-[#f0ede8]/45 before:mr-4 before:text-[#c8f04a] before:content-['◆']">
              {item}
            </span>
          ))}
        </div>
      </div>

      <section id="results" className="grid border-b border-white/[0.08] md:grid-cols-3">
        {[
          ["94%", "Profile match accuracy"],
          ["3.2x", "Faster placement cycles"],
          ["12K+", "Student interactions tracked"],
        ].map(([value, label]) => (
          <div key={label} className="border-b border-r border-white/[0.08] px-8 py-14 transition-colors hover:bg-[#141414] md:border-b-0">
            <div className="text-5xl font-extrabold tracking-[-0.04em] text-[#c8f04a] md:text-6xl">{value}</div>
            <div className="mt-3 font-mono-ui text-xs uppercase tracking-[0.12em] text-[#f0ede8]/45">{label}</div>
          </div>
        ))}
      </section>

      <section id="platform" className="px-5 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="pis-kicker mb-4">Core capabilities</div>
          <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.03em] md:text-6xl">
            Everything built for precision placement.
          </h2>
          <div className="mt-16 grid border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-[#080808] p-8 transition-colors hover:bg-[#141414]">
                  <div className="font-mono-ui text-[0.65rem] tracking-[0.15em] text-[#f0ede8]/35">0{index + 1}</div>
                  <Icon className="mt-7 h-7 w-7 text-[#c8f04a]" />
                  <h3 className="mt-5 text-xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="mt-4 font-mono-ui text-xs leading-7 text-[#f0ede8]/45">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="flow" className="border-t border-white/[0.08] px-5 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="pis-kicker mb-4">How it works</div>
          <h2 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.03em] md:text-6xl">
            Four steps from signal to placement.
          </h2>
          <div className="mt-16 grid border border-white/[0.08] md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="relative border-b border-r border-white/[0.08] p-8 last:border-r-0 md:border-b-0">
                <div className="font-mono-ui text-[0.65rem] uppercase tracking-[0.2em] text-[#c8f04a]">Step 0{index + 1}</div>
                <h3 className="mt-6 text-2xl font-bold">{step}</h3>
                <p className="mt-3 font-mono-ui text-xs leading-7 text-[#f0ede8]/45">
                  {index === 0 && "Profiles, roles, resumes, and drive data enter one structured console."}
                  {index === 1 && "Candidates get ranked by eligibility, skills, role fit, and recruiter criteria."}
                  {index === 2 && "Interviews, feedback, and applications move through live status loops."}
                  {index === 3 && "Offers, selections, and onboarding close inside the same placement record."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.08] px-5 py-24 text-center md:px-10">
        <h2 className="text-[clamp(2.8rem,7vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.04em]">
          READY TO
          <br />
          <span className="text-transparent [-webkit-text-stroke:1px_rgba(240,237,232,0.32)]">CHANGE THE</span>
          <br />
          GAME?
        </h2>
        <p className="mx-auto mt-8 max-w-md font-mono-ui text-sm leading-7 text-[#f0ede8]/45">
          Enter the placement console and run the full campus cycle from one sharp interface.
        </p>
        <Link href="/auth" className="pis-button mt-10 inline-flex px-8 py-4 hover:opacity-85">
          Get started
        </Link>
      </section>

      <footer className="flex flex-col gap-4 border-t border-white/[0.08] px-5 py-8 font-mono-ui text-[0.68rem] text-[#f0ede8]/40 md:flex-row md:items-center md:justify-between md:px-10">
        <span>2026 PlacementMaster. Campus placement console.</span>
        <span>Privacy / Terms / Contact</span>
      </footer>
    </div>
  );
}
