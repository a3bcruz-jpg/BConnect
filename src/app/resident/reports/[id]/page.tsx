import Link from 'next/link';

export default async function ResidentReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const steps = [
    ['Report submitted', '10:32 AM', true],
    ['Report received', '10:32 AM', true],
    ['Official verification', '10:34 AM', true],
    ['Responder assigned', 'Pending', false],
    ['Responding', 'Pending', false],
    ['Resolved', 'Pending', false],
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/resident" className="text-sm font-medium text-slate-600 hover:text-slate-950">← Back to reports</Link>
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Report</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">Vehicular Accident</h1>
              <p className="mt-1 font-mono text-xs text-slate-500">{id}</p>
            </div>
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-100">HIGH</span>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Current status</p>
            <p className="mt-2 text-lg font-semibold">Verified — waiting for responder assignment</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">The barangay has verified your report. You will receive an update when the response status changes.</p>
          </div>

          <div className="mt-8">
            <h2 className="text-base font-semibold">Timeline</h2>
            <ol className="mt-5 space-y-5">
              {steps.map(([label, time, complete], index) => (
                <li key={label} className="flex gap-4">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {complete ? '✓' : index + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${complete ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
                    <p className="mt-1 text-xs text-slate-500">{time}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-sm font-semibold">Safety reminder</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">BConnect is a reporting and coordination tool. For an immediate life-threatening emergency, call 911.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
