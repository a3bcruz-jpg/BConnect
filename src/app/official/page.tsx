'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Incident = {
  id: string;
  reference_number: string;
  category: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  location_text?: string | null;
  priority?: string | null;
  ai_priority?: string | null;
  status: string;
  created_at: string;
};

const categoryLabels: Record<string, string> = { fire: 'Fire', medical: 'Medical', accident: 'Accident', crime_safety: 'Crime / Safety', flood: 'Flood', landslide: 'Landslide', earthquake: 'Earthquake', missing_person: 'Missing Person', road_hazard: 'Road Hazard', infrastructure_damage: 'Infrastructure Damage', electrical_hazard: 'Electrical Hazard', environmental: 'Environmental', other: 'Other' };
const priorityClass: Record<string, string> = { critical: 'bg-red-50 text-red-700 border-red-100', high: 'bg-orange-50 text-orange-700 border-orange-100', medium: 'bg-amber-50 text-amber-700 border-amber-100', low: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
const activeStatuses = ['submitted', 'ai_processing', 'pending_verification', 'verified', 'assigned', 'accepted', 'responding', 'on_site'];

function formatAge(value: string) { const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000)); if (minutes < 1) return 'just now'; if (minutes < 60) return `${minutes} min ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} hr ago`; return `${Math.floor(hours / 24)} d ago`; }
function statusLabel(value: string) { return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()); }

export default function OfficialDashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filter, setFilter] = useState<'all' | 'needs'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadIncidents() {
    const response = await fetch('/api/incidents', { cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error ?? 'Unable to load incidents.');
    setIncidents(payload.incidents ?? []);
  }

  useEffect(() => {
    let active = true;
    loadIncidents().catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load incidents.'); }).finally(() => { if (active) setLoading(false); });
    const timer = window.setInterval(() => { loadIncidents().catch(() => undefined); }, 30000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const visible = useMemo(() => incidents.filter((incident) => filter === 'all' || ['submitted', 'ai_processing', 'pending_verification'].includes(incident.status)), [incidents, filter]);
  const counts = useMemo(() => ({
    active: incidents.filter((i) => activeStatuses.includes(i.status)).length,
    critical: incidents.filter((i) => (i.priority ?? i.ai_priority) === 'critical').length,
    high: incidents.filter((i) => (i.priority ?? i.ai_priority) === 'high').length,
    medium: incidents.filter((i) => (i.priority ?? i.ai_priority) === 'medium').length,
    low: incidents.filter((i) => (i.priority ?? i.ai_priority) === 'low').length,
  }), [incidents]);

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#10233f]">
      <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#dce6f0] bg-white px-5 py-4 shadow-sm"><div><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">BConnect Operations</p><h1 className="mt-1 text-xl font-extrabold tracking-tight">Barangay Operations</h1></div><div className="flex items-center gap-2"><span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:inline-flex">● Live</span><button onClick={() => loadIncidents().catch((e) => setError(e instanceof Error ? e.message : 'Refresh failed.'))} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Refresh</button><Link href="/resident" className="rounded-xl bg-[#0b66c3] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#075aa9]">Resident view</Link></div></header>

        <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">{[['active','Active incidents','text-[#0b66c3]'],['critical','Critical','text-red-600'],['high','High','text-orange-600'],['medium','Medium','text-amber-600'],['low','Low','text-emerald-600']].map(([key,label,tone]) => <div key={label} className="rounded-2xl border border-[#dce6f0] bg-white p-4 shadow-sm"><p className={`text-2xl font-extrabold ${tone}`}>{counts[key as keyof typeof counts]}</p><p className="mt-1 text-xs font-semibold text-slate-500">{label}</p></div>)}</section>

        {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-2xl border border-[#dce6f0] bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h2 className="font-extrabold">Incident queue</h2><p className="mt-1 text-xs text-slate-500">Live data from the incident service. Auto-refreshes every 30 seconds.</p></div><div className="flex gap-2"><button onClick={() => setFilter('all')} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === 'all' ? 'bg-[#0b66c3] text-white' : 'border border-slate-200 text-slate-600'}`}>All</button><button onClick={() => setFilter('needs')} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === 'needs' ? 'bg-[#0b66c3] text-white' : 'border border-slate-200 text-slate-600'}`}>Needs action</button></div></div>
            {loading ? <div className="space-y-3 p-5"><div className="h-20 animate-pulse rounded-2xl bg-slate-100" /><div className="h-20 animate-pulse rounded-2xl bg-slate-100" /><div className="h-20 animate-pulse rounded-2xl bg-slate-100" /></div> : visible.length === 0 ? <div className="p-10 text-center"><p className="font-bold">No incidents to show</p><p className="mt-1 text-sm text-slate-500">New reports will appear here when they are available.</p></div> : <div className="divide-y divide-slate-100">{visible.map((incident) => { const priority = incident.priority ?? incident.ai_priority ?? 'low'; return <Link key={incident.id} href={`/official/incidents/${incident.id}`} className="block px-5 py-4 transition hover:bg-[#f8fbff]"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${priority === 'critical' ? 'bg-red-500' : priority === 'high' ? 'bg-orange-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} /><p className="truncate text-sm font-bold">{categoryLabels[incident.category] ?? statusLabel(incident.category)}</p></div><p className="mt-1 truncate text-xs text-slate-500">{incident.reference_number} · {incident.location_text || 'Location not provided'} · {formatAge(incident.created_at)}</p></div><div className="flex shrink-0 items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${priorityClass[priority] ?? priorityClass.low}`}>{priority.toUpperCase()}</span><span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 sm:inline-flex">{statusLabel(incident.status)}</span></div></div></Link>; })}</div>}
          </section>

          <aside className="space-y-5"><section className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-extrabold">Location overview</h2><p className="mt-1 text-xs text-slate-500">Coordinates reported with incidents</p></div><span className="text-xs font-bold text-[#0b66c3]">{incidents.filter((i) => i.latitude != null && i.longitude != null).length} located</span></div><div className="mt-4 space-y-2">{incidents.filter((i) => i.latitude != null && i.longitude != null).slice(0, 5).map((incident) => <Link key={incident.id} href={`/official/incidents/${incident.id}`} className="block rounded-xl bg-slate-50 p-3 hover:bg-blue-50"><div className="flex justify-between gap-3"><p className="truncate text-xs font-bold">{incident.reference_number}</p><span className="font-mono text-[10px] text-slate-500">{Number(incident.latitude).toFixed(4)}, {Number(incident.longitude).toFixed(4)}</span></div></Link>)}{incidents.filter((i) => i.latitude != null && i.longitude != null).length === 0 && <p className="text-sm text-slate-500">No GPS locations available yet.</p>}</div></section><section className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-[#0b66c3]">AI operations note</p><p className="mt-2 text-sm leading-6 text-slate-600">AI recommendations support decisions. Authorized officials verify reports, set final priority, and control escalation.</p></section><section className="rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm"><h2 className="font-extrabold">System state</h2><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><span>Incident service</span><span className="font-bold text-emerald-700">Connected</span></div><div className="flex justify-between"><span>Auto refresh</span><span className="font-bold text-emerald-700">30 seconds</span></div><div className="flex justify-between"><span>Loaded reports</span><span className="font-bold">{incidents.length}</span></div></div></section></aside>
        </div>
      </div>
    </main>
  );
}
