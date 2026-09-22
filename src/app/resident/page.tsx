'use client';

import Link from 'next/link';
import { Bell, ChevronRight, CircleAlert, FileText, MapPin, Phone, ShieldCheck } from 'lucide-react';

const reports = [
  { id: 'BC-2026-000124', title: 'Vehicular Accident', meta: 'National Highway · 10:42 AM', status: 'Responding', tone: 'bg-orange-50 text-orange-700 border-orange-100' },
  { id: 'BC-2026-000119', title: 'Flooded Road', meta: 'Zone 2 · Yesterday', status: 'Verified', tone: 'bg-[#e8f3ff] text-blue-700 border-blue-100' },
];

const quickLinks = [
  ['Reports', '/resident/reports/BC-2026-000124', 'My submitted incidents', FileText],
  ['Updates', '/notifications', 'Barangay announcements', Bell],
  ['Contacts', '#contacts', 'Emergency numbers', Phone],
  ['Services', '#services', 'Barangay services', ShieldCheck],
] as const;

export default function ResidentPage() {
  return (
    <main className="min-h-screen bg-[#061b19] pb-24 text-white sm:pb-8 bc-page-enter">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-[#0a2924]/90 px-4 py-3 shadow-xl shadow-black/10 backdrop-blur">
          <Link href="/" className="flex items-center gap-3" aria-label="BConnect home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d9b68] to-[#0b7bd4] text-xs font-black">BC</span>
            <div><p className="text-[17px] font-black">BConnect</p><p className="text-xs font-medium text-[#91b8ad]">Barangay San Isidro</p></div>
          </Link>
          <button aria-label="Notifications" className="relative rounded-xl p-2.5 text-[#b9d7ce] transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"><Bell className="h-5 w-5" aria-hidden="true" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#31d477] ring-2 ring-[#0a2924]" /></button>
        </header>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-emerald-300/10 bg-gradient-to-br from-[#075346] via-[#07372f] to-[#0b66c3] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="max-w-2xl"><p className="text-sm font-semibold text-[#9ee9c1]">Good morning, Juan</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Your barangay, connected.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#c1ddd5]">Report an incident in seconds. BConnect organizes the details so your barangay team can respond with clarity.</p><Link href="/resident/report" className="bc-green-action mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-black shadow-lg shadow-black/20 sm:w-auto"><CircleAlert className="h-5 w-5" aria-hidden="true" /> REPORT AN INCIDENT</Link></div>
          <div className="mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3"><div className="rounded-2xl border border-white/10 bg-black/15 p-3"><p className="text-lg font-black">12</p><p className="text-[10px] text-[#9fc1b7]">Reports</p></div><div className="rounded-2xl border border-white/10 bg-black/15 p-3"><p className="text-lg font-black text-[#31d477]">3</p><p className="text-[10px] text-[#9fc1b7]">In progress</p></div><div className="rounded-2xl border border-white/10 bg-black/15 p-3"><p className="text-lg font-black text-[#7ec8ff]">8</p><p className="text-[10px] text-[#9fc1b7]">Resolved</p></div></div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Quick actions">
          {quickLinks.map(([title, href, desc, Icon]) => <Link key={title} href={href} className="group rounded-[1.35rem] border border-white/10 bg-[#0b2924] p-4 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-emerald-300/20 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#123d35] text-[#31d477]"><Icon className="h-4 w-4" aria-hidden="true"/></div><p className="mt-3 text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-[#8fb3a9]">{desc}</p><ChevronRight className="mt-3 h-4 w-4 text-[#31d477] transition group-hover:translate-x-1" aria-hidden="true"/></Link>)}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0b2924] p-5 shadow-lg shadow-black/10"><div className="flex items-center justify-between gap-4"><div><h2 className="font-black">Barangay status</h2><p className="mt-1 text-xs text-[#8fb3a9]">Current community advisory</p></div><span className="rounded-full bg-[#d9f8e7] px-3 py-1 text-xs font-black text-[#13734d]">Normal</span></div><p className="mt-5 text-sm leading-6 text-[#b5d0c8]">No critical alerts at this time. Stay informed through official BConnect announcements.</p></div>
          <div className="rounded-[1.5rem] border border-red-300/15 bg-[#351c20] p-5"><p className="text-xs font-black uppercase tracking-[.14em] text-[#ff9c9c]">Emergency</p><p className="mt-2 text-sm font-bold leading-6 text-white">For life-threatening emergencies, call 911 immediately.</p><a href="tel:911" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#c62828] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#a91f1f]"><Phone className="h-4 w-4" aria-hidden="true"/>Call 911</a></div>
        </section>

        <section className="mt-7 pb-4"><div className="flex items-end justify-between gap-4"><div><h2 className="text-lg font-black">My recent reports</h2><p className="mt-1 text-xs text-[#8fb3a9]">Track the latest incidents you submitted.</p></div><Link href="/resident/reports/BC-2026-000124" className="text-xs font-black text-[#31d477] hover:underline">View all</Link></div><div className="mt-3 grid gap-3 sm:grid-cols-2">{reports.map((report) => <Link key={report.id} href={`/resident/reports/${report.id}`} className="rounded-[1.35rem] border border-white/10 bg-[#0b2924] p-4 transition hover:border-emerald-300/20 hover:bg-[#0e332c] focus:outline-none focus:ring-4 focus:ring-emerald-300/20"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black">{report.title}</p><p className="mt-1 text-xs text-[#7fa99e]">{report.id}</p></div><span className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${report.tone}`}>{report.status}</span></div><p className="mt-3 text-xs text-[#9fc1b7]">{report.meta}</p></Link>)}</div></section>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#071f1d]/95 px-4 py-2 backdrop-blur sm:hidden" aria-label="Primary navigation"><div className="mx-auto grid max-w-md grid-cols-4 text-center text-[11px] font-semibold text-[#7fa99e]"><Link href="/resident" className="rounded-lg py-2 text-[#31d477]">Home</Link><Link href="/resident/reports/BC-2026-000124" className="rounded-lg py-2">Reports</Link><Link href="/notifications" className="rounded-lg py-2">Updates</Link><Link href="#services" className="rounded-lg py-2">More</Link></div></nav>
    </main>
  );
}
