import Link from 'next/link';

const features = [
  {
    title: 'Report in seconds',
    description: 'Residents can describe an incident by text or voice, add a location, and submit a clear report.',
  },
  {
    title: 'AI-assisted intake',
    description: 'BConnect helps structure the report, identify missing details, and recommend an incident priority.',
  },
  {
    title: 'Coordinated response',
    description: 'Authorized barangay staff can verify reports, assign responders, and track progress to resolution.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
            BConnect · Barangay Incident Coordination
          </div>

          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Connect. Report. Respond.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            BConnect helps residents report urgent incidents and gives authorized barangay teams a clear, structured workflow for verification, coordination, response, and resolution.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign in to BConnect
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
