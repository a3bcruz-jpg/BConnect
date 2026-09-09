import Link from 'next/link';

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/official" className="text-sm font-medium text-slate-600 hover:text-slate-950">← Back to dashboard</Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Incident {id}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Vehicular Accident</h1>
                <p className="mt-2 text-sm text-slate-500">National Highway · near Public Market · reported 10:32 AM</p>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">HIGH</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI recommendation</p>
                <p className="mt-2 text-sm font-semibold">HIGH</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">Possible injury and roadway obstruction were reported.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Missing information</p>
                <p className="mt-2 text-sm font-semibold">Number of injured people</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">The report can still be verified while clarification is requested.</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-base font-semibold">Resident report</h2>
              <blockquote className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                “May aksidente sa highway malapit sa palengke. Mukhang may isang tao na injured.”
              </blockquote>
            </div>

            <div className="mt-8">
              <h2 className="text-base font-semibold">Location</h2>
              <div className="mt-3 rounded-xl bg-slate-900 p-5 text-sm text-white">
                <p className="font-semibold">National Highway</p>
                <p className="mt-1 text-slate-300">Near Public Market</p>
                <p className="mt-4 font-mono text-xs text-slate-400">GPS: 16.0432, 120.5937</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-base font-semibold">Incident timeline</h2>
              <ol className="mt-4 space-y-4 border-l border-slate-200 pl-5 text-sm">
                <li><p className="font-semibold">10:32 AM · Report submitted</p><p className="mt-1 text-slate-500">Resident report received.</p></li>
                <li><p className="font-semibold">10:33 AM · AI analyzed</p><p className="mt-1 text-slate-500">Accident classification and priority recommendation created.</p></li>
                <li><p className="font-semibold">10:34 AM · Pending verification</p><p className="mt-1 text-slate-500">Waiting for authorized official review.</p></li>
              </ol>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold">Official actions</h2>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Verify incident</button>
              <button className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Request more information</button>
              <button className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Mark as duplicate</button>
              <button className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800">Assign responder</button>
              <button className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">Escalation options</button>
            </div>
            <div className="mt-6 rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Responder</p>
              <p className="mt-2 text-sm font-semibold">Unassigned</p>
              <p className="mt-1 text-xs text-slate-500">Assignment is controlled by an authorized official.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
