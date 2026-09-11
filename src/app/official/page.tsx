'use client';

import Link from 'next/link';

const incidents = [
  { id: 'BC-2026-000124', type: 'Vehicular Accident', location: 'National Highway', priority: 'HIGH', status: 'For Verification', age: '2 min ago' },
  { id: 'BC-2026-000123', type: 'Possible House Fire', location: 'Purok 3', priority: 'CRITICAL', status: 'Unverified', age: '4 min ago' },
  { id: 'BC-2026-000119', type: 'Flooded Road', location: 'Zone 2', priority: 'MEDIUM', status: 'Verified', age: '18 min ago' },
  { id: 'BC-2026-000117', type: 'Fallen Tree', location: 'Purok 5', priority: 'LOW', status: 'Resolved', age: '41 min ago' },
];

const priorityClass: Record<string, string> = { CRITICAL: 'bg-red-50 text-red-700 border-red-100', HIGH: 'bg-orange-50 text-orange-700 border-orange-100', MEDIUM: 'bg-amber-50 text-amber-700 border-amber-100', LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100' };

export default function OfficialDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#10233f]">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dce6f0] bg-white px-5 py-4 shadow-sm">
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">BConnect Operations</p><h1 className="mt-1 text-xl font-extrabold tracking-tight">Barangay San Isidro</h1></div>
          <div className="flex items-center gap-2"><span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:inline-flex">● System online</span><Link href="/resident" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Resident view</Link></div>
        </header>

        <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[['28','Active incidents','text-[#0b66c3]'],['3','Critical','text-red-600'],['7','High','text-orange-600'],['12','Medium','text-amber-600'],['6','Low','text-emerald-600']].map(([value,label,tone]) => <div key={label} className="rounded-2xl border border-[#dce6f0] bg-white p-4 shadow-sm"><p className={`text-2xl font-extrabold ${tone}`}>{value}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>)}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-[#dce6f0] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h2 className="font-extrabold">Incident queue</h2><p className="mt-1 text-xs text-slate-500">Review the incidents that need attention first.</p></div><div className="flex gap-2"><button className="rounded-lg bg-[#0b66c3] px-3 py-2 text-xs font-bold text-white">All</button><button className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Needs action</button></div></div>
            <div className="divide-y divide-slate-100">{incidents.map((incident) => <Link key={incident.id} href={`/official/incidents/${incident.id}`} className="block px-5 py-4 transition hover:bg-[#f8fbff]"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${incident.priority === 'CRITICAL' ? 'bg-red-500' : incident.priority === 'HIGH' ? 'bg-orange-500' : incident.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} /><p className="truncate text-sm font-bold">{incident.type}</p></div><p className="mt-1 text-xs text-slate-500">{incident.id} · {incident.location} · {incident.age}</p></div><div className="flex shrink-0 items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${priorityClass[incident.priority]}`}>{incident.priority}</span><span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 sm:inline-flex">{incident.status}</span></div></div></Link>)}</div>
          </section>

          <aside className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-[#dce6f0] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-extrabold">Live map</h2><p className="mt-1 text-xs text-slate-500">Incident locations today</p></div><span className="text-xs font-bold text-[#0b66c3]">Map view</span></div><div className="relative h-56 bg-[#edf4f8]"><div className="absolute inset-5 rounded-2xl border border-white bg-[#e5eff3]"><div className="absolute left-[23%] top-[30%] h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-100" /><div className="absolute left-[63%] top-[52%] h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-100" /><div className="absolute left-[42%] top-[72%] h-3 w-3 rounded-full bg-amber-500 ring-4 ring-amber-100" /><div className="absolute right-[18%] top-[22%] h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" /></div></div></section>
            <section className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-[#0b66c3]">AI operations note</p><p className="mt-2 text-sm leading-6 text-slate-600">AI recommendations support decisions. Authorized officials verify reports, set final priority, and control escalation.</p></section>
            <section className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm"><h2 className="font-extrabold">Responder status</h2><div className="mt-4 space-y-3 text-sm">{[['Team 01','Available','text-emerald-700'],['Team 02','Responding','text-orange-700'],['BDRRMC','Available','text-emerald-700']].map(([name,status,tone]) => <div key={name} className="flex items-center justify-between"><span className="font-medium">{name}</span><span className={`font-bold ${tone}`}>{status}</span></div>)}</div></section>
          </aside>
        </div>
      </div>
    </main>
  );
}
