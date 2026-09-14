import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Siren } from 'lucide-react';

const features = [
  {
    icon: Siren,
    title: 'Report in seconds',
    description: 'Residents can submit a clear incident report with the details responders need.',
  },
  {
    icon: ShieldCheck,
    title: 'AI-assisted intake',
    description: 'AI helps structure reports and surface missing details while keeping decisions with authorized people.',
  },
  {
    icon: MapPin,
    title: 'Coordinated response',
    description: 'Authorized barangay teams can verify incidents, assign responders, and track progress to resolution.',
  },
];

const workflow = ['Report', 'Verify', 'Assign', 'Respond', 'Resolve'];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-8 lg:px-8 lg:pb-24">
          <header className="flex items-center justify-between gap-6">
            <Link href="/" aria-label="BConnect home" className="flex items-center gap-3">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] text-lg font-black text-white shadow-sm">B</span>
              <span>
                <span className="block text-lg font-extrabold tracking-tight">BConnect</span>
                <span className="block text-[11px] font-medium text-[var(--text-secondary)]">Connect. Report. Respond.</span>
              </span>
            </Link>
            <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]">
              Sign in
            </Link>
          </header>

          <div className="grid gap-14 pt-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:pt-24">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--brand-dark)]">
                BARANGAY INCIDENT COORDINATION
              </div>
              <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">Connect. Report. Respond.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
                A structured incident reporting and coordination platform that helps residents connect with authorized barangay response teams.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-dark)]">
                  Get started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">For life-threatening emergencies, contact your local emergency services directly.</p>
            </div>

            <div className="rounded-[20px] border border-[var(--border)] bg-[var(--background)] p-5 shadow-sm sm:p-6">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Incident workflow</p>
                    <p className="mt-1 text-lg font-bold">From report to resolution</p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-[var(--success)]" aria-hidden="true" />
                </div>
                <div className="mt-6 space-y-3">
                  {workflow.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-bold text-[var(--brand-dark)]">{index + 1}</span>
                      <span className="text-sm font-semibold">{step}</span>
                      {index < workflow.length - 1 && <span className="ml-auto text-xs text-[var(--text-muted)]">Next</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Built for coordinated response</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Simple for residents. Structured for response teams.</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]"><Icon className="h-5 w-5" aria-hidden="true" /></div>
              <h3 className="mt-5 text-base font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
