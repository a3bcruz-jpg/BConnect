'use client';

import Link from 'next/link';

const reports = [
  { id: 'BC-2026-000124', title: 'Vehicular Accident', meta: 'National Highway · 10:42 AM', status: 'Responding', tone: 'bg-orange-50 text-orange-700 border-orange-100' },
  { id: 'BC-2026-000119', title: 'Flooded Road', meta: 'Zone 2 · Yesterday', status: 'Verified', tone: 'bg-blue-50 text-blue-700 border-blue-100' },
];

function BrandMark() {
  return <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b66c3] to-[#15936a] text-lg font-black text-white shadow-sm">B</div>;
}

export default function ResidentPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] pb-24 text-[#10233f] sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-2xl border border-[#dce6f0] bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-[17px] font-extrabold tracking-tight">BConnect</p>
              <p className="text-xs text-slate-500">Barangay San Isidro</p>
            </div>
          </div>
          <button aria-label="Notifications" className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-50">
            <span className="text-lg">●</span><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        <section className="mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#075aa9] via-[#0b66c3] to-[#0b7b83] p-6 text-white shadow-lg sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-100">Good morning, Juan</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Your barangay, connected.</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50">Report an urgent incident in seconds. BConnect helps organize the details so your barangay team can respond faster.</p>
            <Link href="/resident/report" className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-4 text-sm font-extrabold text-[#075aa9] shadow-sm transition hover:bg-blue-50 sm:w-auto">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">!</span>
              REPORT AN INCIDENT
            </Link>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Reports', '/resident/reports/BC-2026-000124', 'My submitted incidents'],
            ['Updates', '/notifications', 'Barangay announcements'],
            ['Contacts', '#contacts', 'Emergency numbers'],
            ['Services', '#services', 'Barangay services'],
          ].map(([title, href, desc]) => (
            <Link key={title} href={href} className="rounded-2xl border border-[#dce6f0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
              <p className="text-sm font-bold text-[#10233f]">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
            </Link>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl border border-[#dce6f0] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div><h2 className="font-bold">Barangay status</h2><p className="mt-0.5 text-xs text-slate-500">Current community advisory</p></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Normal</span>
            </div>
            <div className="px-5 py-4"><p className="text-sm text-slate-600">No critical alerts at this time. Stay informed through official BConnect announcements.</p></div>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">Emergency</p>
            <p className="mt-1 text-sm font-semibold text-red-950">For life-threatening emergencies, call 911 immediately.</p>
            <a href="tel:911" className="mt-3 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700">Call 911</a>
          </div>
        </section>

        <section className="mt-7 pb-4">
          <div className="flex items-end justify-between"><div><h2 className="text-lg font-bold">My recent reports</h2><p className="mt-1 text-xs text-slate-500">Track the latest incidents you submitted.</p></div><Link href="/resident/reports/BC-2026-000124" className="text-xs font-bold text-[#0b66c3]">View all</Link></div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {reports.map((report) => <Link key={report.id} href={`/resident/reports/${report.id}`} className="rounded-2xl border border-[#dce6f0] bg-white p-4 shadow-sm hover:border-blue-200">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">{report.title}</p><p className="mt-1 text-xs text-slate-500">{report.id}</p></div><span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${report.tone}`}>{report.status}</span></div>
              <p className="mt-3 text-xs text-slate-500">{report.meta}</p>
            </Link>)}
          </div>
        </section>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dce6f0] bg-white/95 px-4 py-2 backdrop-blur sm:hidden"><div className="mx-auto grid max-w-md grid-cols-4 text-center text-[11px] font-semibold text-slate-500"><Link href="/resident" className="py-2 text-[#0b66c3]">Home</Link><Link href="/resident/reports/BC-2026-000124" className="py-2">Reports</Link><Link href="/notifications" className="py-2">Updates</Link><Link href="#services" className="py-2">More</Link></div></nav>
    </main>
  );
}
