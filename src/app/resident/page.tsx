import Link from 'next/link';

const reports = [
  { id: 'BC-2026-000124', title: 'Vehicular Accident', meta: 'High · Responding', status: 'Responding' },
  { id: 'BC-2026-000119', title: 'Flooded Road', meta: 'Medium · Verified', status: 'Verified' },
];

export default function ResidentPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">BConnect</p>
            <p className="text-xs text-slate-500">Barangay San Roque</p>
          </div>
          <button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm">
            Notifications
          </button>
        </header>

        <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-medium text-slate-300">Good morning</p>
          <h1 className="mt-1 text-2xl font-semibold">Your barangay, connected.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Report urgent incidents quickly. BConnect will help organize the information for your barangay team.
          </p>
          <Link
            href="/resident/report"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Report an incident
          </Link>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Emergency</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">For immediate life-threatening situations, contact 911.</p>
            <button className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800">
              Emergency contacts
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Barangay update</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">Heavy rainfall advisory. Stay alert in flood-prone areas.</p>
            <button className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800">
              View updates
            </button>
          </div>
        </section>

        <section className="mt-8 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">My reports</h2>
            <span className="text-xs text-slate-500">Demo data</span>
          </div>
          <div className="mt-3 space-y-3">
            {reports.map((report) => (
              <Link key={report.id} href={`/resident/reports/${report.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{report.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{report.id}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{report.status}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{report.meta}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
