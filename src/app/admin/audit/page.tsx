'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, Clock3, Filter, ShieldCheck, UserRound } from 'lucide-react';

type AuditEvent = {
  id: string;
  created_at: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  actor?: { id: string; full_name: string; role: string } | null;
};

const filters = ['All', 'Incidents', 'Users', 'Access', 'System'];

export default function AuditPage() {
  const [filter, setFilter] = useState('All');
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/audit')
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? 'Unable to load audit events.');
        setEvents(body.events ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load audit events.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return events;
    return events.filter((event) => {
      if (filter === 'Incidents') return event.resource_type === 'incident';
      if (filter === 'Users' || filter === 'Access') return event.resource_type === 'profile' || event.action.toLowerCase().includes('role');
      return event.resource_type === 'system' || event.actor?.role === 'Automation';
    });
  }, [filter, events]);

  const reviewCount = events.filter((event) => event.action.toLowerCase().includes('review') || event.action.toLowerCase().includes('flag')).length;

  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-bold text-[#7ec8ff]">← Administration</Link>
        <header className="mt-4 rounded-3xl border border-white/10 bg-[#0b2924] p-6 shadow-xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#31d477]">Governance & accountability</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Audit & Compliance</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a9c9c0]">Review who changed what, when it happened, and which operational record was affected.</p>
            </div>
            <div className="rounded-2xl border border-[#31d477]/20 bg-[#31d477]/10 px-4 py-3"><p className="text-xs font-bold uppercase tracking-wider text-[#62e49b]">Audit posture</p><p className="mt-1 text-sm font-extrabold">Append-only design</p></div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { label: 'Events loaded', value: events.length, Icon: Activity },
              { label: 'Available', value: events.length - reviewCount, Icon: CheckCircle2 },
              { label: 'Needs review', value: reviewCount, Icon: Clock3 },
              { label: 'Protected', value: 'RLS', Icon: ShieldCheck },
            ].map(({ label, value, Icon }) => <div key={label} className="rounded-2xl border border-white/10 bg-[#071f1d] p-4"><Icon className="h-5 w-5 text-[#7ec8ff]" /><p className="mt-3 text-2xl font-extrabold">{value}</p><p className="mt-1 text-xs text-[#a9c9c0]">{label}</p></div>)}
          </div>
        </header>

        <section className="mt-5 rounded-3xl border border-white/10 bg-[#0b2924] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><h2 className="font-extrabold">Activity ledger</h2><p className="mt-1 text-xs text-[#a9c9c0]">Latest accountability events from Supabase.</p></div>
            <div className="flex flex-wrap items-center gap-2"><Filter className="h-4 w-4 text-[#7ec8ff]" />{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === item ? 'bg-[#31d477] text-[#04251c]' : 'border border-white/10 bg-[#071f1d] text-[#a9c9c0]'}`}>{item}</button>)}</div>
          </div>

          {loading && <div className="mt-5 rounded-2xl bg-[#071f1d] p-6 text-sm text-[#a9c9c0]">Loading audit events...</div>}
          {error && <div className="mt-5 rounded-2xl border border-[#ff8c8c]/20 bg-[#401b1b] p-6 text-sm text-[#ffc1c1]">{error}</div>}
          {!loading && !error && <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-left">
              <thead className="bg-[#071f1d]"><tr className="text-xs uppercase tracking-wider text-[#71958c]"><th className="px-4 py-3">Time</th><th className="px-4 py-3">Actor</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th></tr></thead>
              <tbody>{filtered.map((event) => <tr key={event.id} className="border-t border-white/10 text-sm">
                <td className="whitespace-nowrap px-4 py-4 text-[#a9c9c0]">{new Date(event.created_at).toLocaleString()}</td>
                <td className="px-4 py-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#0e3a30]"><UserRound className="h-4 w-4 text-[#7ec8ff]" /></span><div><p className="font-bold">{event.actor?.full_name ?? 'System'}</p><p className="text-xs text-[#71958c]">{event.actor?.role ?? 'system'}</p></div></div></td>
                <td className="px-4 py-4 font-semibold">{event.action}</td>
                <td className="px-4 py-4 text-[#a9c9c0]">{event.resource_type}{event.resource_id ? ` · ${event.resource_id.slice(0, 8)}` : ''}</td>
              </tr>)}</tbody>
            </table>
            {!filtered.length && <p className="p-6 text-sm text-[#a9c9c0]">No audit events match this filter.</p>}
          </div>}

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#071f1d] p-5">
            <p className="text-sm font-extrabold">Production controls</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ['Actor attribution', 'Every sensitive action records the authenticated actor.'],
                ['Immutable history', 'Audit records should not be editable by normal admins.'],
                ['RLS protection', 'Access is scoped to authorized administrators and organization boundaries.'],
              ].map(([title, text]) => <div key={title} className="rounded-xl border border-white/10 bg-[#0b2924] p-4"><p className="text-xs font-bold text-[#7ec8ff]">{title}</p><p className="mt-1 text-xs leading-5 text-[#a9c9c0]">{text}</p></div>)}
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#71958c]">Production audit records are loaded from the append-only Supabase audit table.</p>
        </section>
      </div>
    </main>
  );
}
