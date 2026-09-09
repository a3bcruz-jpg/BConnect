import Link from 'next/link';

const incidents = [
  { id: 'BC-2026-000124', type: 'Vehicular Accident', location: 'National Highway', priority: 'HIGH', status: 'For Verification', age: '2 min ago' },
  { id: 'BC-2026-000123', type: 'Possible House Fire', location: 'Purok 3', priority: 'CRITICAL', status: 'Unverified', age: '4 min ago' },
  { id: 'BC-2026-000119', type: 'Flooded Road', location: 'Zone 2', priority: 'MEDIUM', status: 'Verified', age: '18 min ago' },
  { id: 'BC-2026-000117', type: 'Fallen Tree', location: 'Purok 5', priority: 'LOW', status: 'Resolved', age: '41 min ago' },
];

const priorityClass: Record<string, string> = {
  CRITICAL: 'bg-red-50 text-red-700 ring-red-100',
  HIGH: 'bg-orange-50 text-orange-700 ring-orange-100',
  MEDIUM: 'bg-amber-50 text-amber-700 ring-amber-100',
  LOW: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
};

export default function OfficialDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">BConnect Operations</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Barangay San Roque</h1>
          </div>
          <Link href="/" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm">Public site</Link>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['27', 'Reports today'],
            ['2', 'Critical'],
            ['6', 'High'],
            ['5', 'Unverified'],
            ['3', 'Responding'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-semibold">Incident queue</h2>
                <p className="mt-1 text-xs text-slate-500">Review and coordinate active reports.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Demo data</span>
            </div>
            <div className="divide-y divide-slate-100">
              {incidents.map((incident) => (
                <Link key={incident.id} href={`/official/incidents/${incident.id}`} className="block px-5 py-5 transition hover:bg-slate-50">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{incident.type}</p>
                      <p className="mt-1 text-xs text-slate-500">{incident.id} · {incident.location} · {incident.age}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${priorityClass[incident.priority]}`}>{incident.priority}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{incident.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">AI operations note</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">AI recommendations are decision support. Authorized officials verify incidents, set final priority, and control escalation.</p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold">Responder status</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between"><span>Team 01</span><span className="font-semibold text-emerald-700">Available</span></div>
                <div className="flex items-center justify-between"><span>Team 02</span><span className="font-semibold text-orange-700">Responding</span></div>
                <div className="flex items-center justify-between"><span>BDRRMC</span><span className="font-semibold text-emerald-700">Available</span></div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
