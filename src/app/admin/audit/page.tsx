'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Activity, CheckCircle2, Clock3, Filter, ShieldCheck, UserRound } from 'lucide-react';

type AuditEvent = {
  time: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  result: 'Success' | 'Review';
};

const events: AuditEvent[] = [
  { time: '09:42 AM', actor: 'Maria Santos', role: 'Official', action: 'Verified incident', target: 'INC-2026-0918', result: 'Success' },
  { time: '09:36 AM', actor: 'Ana Garcia', role: 'Barangay Admin', action: 'Updated user role', target: 'Pedro Reyes → Responder', result: 'Success' },
  { time: '09:28 AM', actor: 'Juan Dela Cruz', role: 'Resident', action: 'Submitted incident', target: 'INC-2026-0917', result: 'Success' },
  { time: '09:14 AM', actor: 'Pedro Reyes', role: 'Responder', action: 'Accepted assignment', target: 'INC-2026-0916', result: 'Success' },
  { time: '08:51 AM', actor: 'System', role: 'Automation', action: 'Flagged record for review', target: 'INC-2026-0915', result: 'Review' },
  { time: '08:33 AM', actor: 'Maria Santos', role: 'Official', action: 'Changed incident priority', target: 'INC-2026-0914', result: 'Success' },
];

const filters = ['All', 'Incidents', 'Users', 'Access', 'System'];

export default function AuditPage() {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return events;
    return events.filter((event) => {
      if (filter === 'Incidents') return event.action.toLowerCase().includes('incident') || event.target.startsWith('INC-');
      if (filter === 'Users') return event.action.toLowerCase().includes('user');
      if (filter === 'Access') return event.action.toLowerCase().includes('role') || event.action.toLowerCase().includes('assignment');
      return event.role === 'Automation';
    });
  }, [filter]);

  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-bold text-[#7ec8ff]">← Administration</Link>

        <header className="mt-4 rounded-3xl border border-white/10 bg-[#0b2924] p-6 shadow-xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#31d477]">Governance & accountability</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Audit & Compliance</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a9c9c0]">
                Review who changed what, when it happened, and which operational record was affected.
              </p>
            </div>
            <div className="rounded-2xl border border-[#31d477]/20 bg-[#31d477]/10 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#62e49b]">Audit posture</p>
              <p className="mt-1 text-sm font-extrabold">Append-only design</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { label: 'Events today', value: '128', Icon: Activity },
              { label: 'Successful', value: '124', Icon: CheckCircle2 },
              { label: 'Needs review', value: '4', Icon: Clock3 },
              { label: 'Protected', value: '100%', Icon: ShieldCheck },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#071f1d] p-4">
                <Icon className="h-5 w-5 text-[#7ec8ff]" />
                <p className="mt-3 text-2xl font-extrabold">{value}</p>
                <p className="mt-1 text-xs text-[#a9c9c0]">{label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-5 rounded-3xl border border-white/10 bg-[#0b2924] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold">Activity ledger</h2>
              <p className="mt-1 text-xs text-[#a9c9c0]">Latest accountability events for the selected scope.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-[#7ec8ff]" />
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === item ? 'bg-[#31d477] text-[#04251c]' : 'border border-white/10 bg-[#071f1d] text-[#a9c9c0] hover:bg-[#0e322c]'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-left">
              <thead className="bg-[#071f1d]">
                <tr className="text-xs uppercase tracking-wider text-[#71958c]">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.time + event.actor} className="border-t border-white/10 text-sm">
                    <td className="whitespace-nowrap px-4 py-4 text-[#a9c9c0]">{event.time}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0e3a30]"><UserRound className="h-4 w-4 text-[#7ec8ff]" /></span>
                        <div>
                          <p className="font-bold">{event.actor}</p>
                          <p className="text-xs text-[#71958c]">{event.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold">{event.action}</td>
                    <td className="px-4 py-4 text-[#a9c9c0]">{event.target}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${event.result === 'Success' ? 'bg-[#31d477]/15 text-[#62e49b]' : 'bg-[#7ec8ff]/15 text-[#8dccff]'}`}>
                        {event.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-[#071f1d] p-5">
            <p className="text-sm font-extrabold">Production controls</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                ['Actor attribution', 'Every sensitive action records the authenticated actor.'],
                ['Immutable history', 'Audit records should not be editable by normal admins.'],
                ['RLS protection', 'Access should be scoped to authorized LGU or system administrators.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-[#0b2924] p-4">
                  <p className="text-xs font-bold text-[#7ec8ff]">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#a9c9c0]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-[#71958c]">
            Preview data only. Production audit records should come from an append-only Supabase audit table with server-side authorization and retention controls.
          </p>
        </section>
      </div>
    </main>
  );
}
