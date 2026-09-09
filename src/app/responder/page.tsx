import Link from 'next/link';

const assignments = [
  {
    id: 'BC-2026-000124',
    type: 'Vehicular Accident',
    location: 'National Road, Zone 2',
    priority: 'High',
    status: 'Assigned',
    reported: '4 min ago',
  },
  {
    id: 'BC-2026-000121',
    type: 'Flooded Road',
    location: 'Riverside Street',
    priority: 'Medium',
    status: 'En route',
    reported: '18 min ago',
  },
];

const priorityStyles: Record<string, string> = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-slate-100 text-slate-700',
};

export default function ResponderPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">BConnect</p>
            <p className="text-xs text-slate-500">Responder workspace</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            On duty
          </div>
        </header>

        <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-sm text-slate-400">Assigned to you</p>
          <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold">2 active incidents</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Review the latest verified information, acknowledge assignments, and keep the barangay team updated.
              </p>
            </div>
            <Link href="/official" className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-slate-100">
              Official dashboard
            </Link>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Active assignments</h2>
            <span className="text-xs text-slate-500">Demo data</span>
          </div>

          <div className="mt-3 space-y-3">
            {assignments.map((incident) => (
              <article key={incident.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{incident.type}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[incident.priority]}`}>
                        {incident.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-slate-500">{incident.id} · {incident.reported}</p>
                    <p className="mt-3 text-sm text-slate-700">{incident.location}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{incident.status}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white">Acknowledge</button>
                  <button className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700">Update status</button>
                  <button className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700">View incident</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="mt-8 pb-8 text-xs leading-5 text-slate-500">
          BConnect is a coordination aid. Responders and authorized officials retain responsibility for operational decisions and emergency dispatch.
        </p>
      </div>
    </main>
  );
}
