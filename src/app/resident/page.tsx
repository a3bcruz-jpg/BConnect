'use client';

import Link from 'next/link';

const reports = [
  { id: 'BC-2026-000124', title: 'Vehicular Accident', meta: 'National Highway · 10:42 AM', status: 'Responding', tone: 'bg-orange-50 text-orange-700 border-orange-100' },
  { id: 'BC-2026-000119', title: 'Flooded Road', meta: 'Zone 2 · Yesterday', status: 'Verified', tone: 'bg-blue-50 text-blue-700 border-blue-100' },
];

function BrandMark() {
  return <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4ff] text-sm font-black tracking-tight text-[#0b66c3] ring-1 ring-[#dce6f0]" aria-hidden="true">BC</div>;
}

const quickLinks = [
  ['Reports', '/resident/reports/BC-2026-000124', 'My submitted incidents'],
  ['Updates', '/notifications', 'Barangay announcements'],
  ['Contacts', '#contacts', 'Emergency numbers'],
  ['Services', '#services', 'Barangay services'],
];

export default function ResidentPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] pb-24 text-[#10233f] sm:pb-8 bc-page-enter">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-2xl border border-[#dce6f0] bg-white bc-panel px-4 py-3 shadow-[0_8px_24px_rgba(16,35,63,0.04)]">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-[17px] font-extrabold tracking-tight">BConnect</p>
              <p className="text-xs font-medium text-[#718096]">Barangay San Isidro</p>
            </div>
          </div>
          <button aria-label="Notifications" className="relative rounded-xl p-2.5 text-[#53657a] transition hover:bg-[#f5f8fc] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/10">
            <span className="text-lg" aria-hidden="true">●</span><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        <section className="mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#075aa9] via-[#0b66c3] to-[#0b7b83] p-6 text-white shadow-[0_18px_45px_rgba(7,90,169,0.18)] sm:p-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-100">Good morning, Juan</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Your barangay, connected.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50">Report an urgent incident in seconds. BConnect helps organize the details so your barangay team can respond faster.</p>
            <Link href="/resident/report" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-white bc-panel px-5 py-4 text-sm font-extrabold text-[#075aa9] shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/40 sm:w-auto">
              <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600" aria-hidden="true">!</span>
              REPORT AN INCIDENT
            </Link>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Quick actions">
          {quickLinks.map(([title, href, desc]) => (
            <Link key={title} href={href} className="group rounded-2xl border border-[#dce6f0] bg-white bc-panel p-4 shadow-[0_6px_18px_rgba(16,35,63,0.03)] transition hover:-translate-y-0.5 hover:border-[#b9d7f5] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/10">
              <p className="text-sm font-extrabold text-[#10233f]">{title}</p>
              <p className="mt-1 text-xs leading-5 text-[#718096]">{desc}</p>
              <span className="mt-3 block text-xs font-bold text-[#0b66c3] opacity-0 transition group-hover:opacity-100">Open →</span>
            </Link>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl border border-[#dce6f0] bg-white bc-panel shadow-[0_8px_24px_rgba(16,35,63,0.04)]">
            <div className="flex items-center justify-between border-b border-[#edf2f7] px-5 py-4">
              <div><h2 className="font-extrabold">Barangay status</h2><p className="mt-1 text-xs text-[#718096]">Current community advisory</p></div>
              <span className="rounded-full bg-[#e8f7f0] px-3 py-1 text-xs font-extrabold text-[#13734d]">Normal</span>
            </div>
            <div className="px-5 py-5"><p className="text-sm leading-6 text-[#53657a]">No critical alerts at this time. Stay informed through official BConnect announcements.</p></div>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-red-700">Emergency</p>
            <p className="mt-2 text-sm font-bold leading-6 text-red-950">For life-threatening emergencies, call 911 immediately.</p>
            <a href="tel:911" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200">Call 911</a>
          </div>
        </section>

        <section className="mt-7 pb-4">
          <div className="flex items-end justify-between gap-4"><div><h2 className="text-lg font-extrabold">My recent reports</h2><p className="mt-1 text-xs text-[#718096]">Track the latest incidents you submitted.</p></div><Link href="/resident/reports/BC-2026-000124" className="shrink-0 text-xs font-extrabold text-[#0b66c3] hover:underline">View all</Link></div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {reports.map((report) => <Link key={report.id} href={`/resident/reports/${report.id}`} className="rounded-2xl border border-[#dce6f0] bg-white bc-panel p-4 shadow-[0_6px_18px_rgba(16,35,63,0.03)] transition hover:border-[#b9d7f5] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/10">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold">{report.title}</p><p className="mt-1 text-xs text-[#718096]">{report.id}</p></div><span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${report.tone}`}>{report.status}</span></div>
              <p className="mt-3 text-xs text-[#53657a]">{report.meta}</p>
            </Link>)}
          </div>
        </section>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#dce6f0] bg-white/95 px-4 py-2 backdrop-blur sm:hidden" aria-label="Primary navigation"><div className="mx-auto grid max-w-md grid-cols-4 text-center text-[11px] font-semibold text-[#718096]"><Link href="/resident" className="rounded-lg py-2 text-[#0b66c3]">Home</Link><Link href="/resident/reports/BC-2026-000124" className="rounded-lg py-2">Reports</Link><Link href="/notifications" className="rounded-lg py-2">Updates</Link><Link href="#services" className="rounded-lg py-2">More</Link></div></nav>
    </main>
  );
}
