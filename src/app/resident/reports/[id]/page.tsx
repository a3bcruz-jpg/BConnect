'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Incident = {
  id: string;
  reference_number: string;
  category: string;
  description: string;
  location_text?: string | null;
  landmark?: string | null;
  priority?: string | null;
  ai_priority?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  verified_at?: string | null;
  assigned_at?: string | null;
  responding_at?: string | null;
  on_site_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
};

type Update = { id: string; previous_status: string | null; new_status: string; note: string | null; created_at: string };

const stages = [
  ['submitted', 'Report submitted'], ['pending_verification', 'Official verification'], ['verified', 'Verified'],
  ['assigned', 'Responder assigned'], ['accepted', 'Responder accepted'], ['responding', 'Responding'], ['on_site', 'Responder on site'],
  ['resolved', 'Resolved'], ['closed', 'Closed'],
] as const;

const labels: Record<string, string> = {
  submitted: 'Submitted', pending_verification: 'For verification', verified: 'Verified', assigned: 'Responder assigned',
  accepted: 'Accepted', responding: 'Responding', on_site: 'On site', resolved: 'Resolved', closed: 'Closed',
  rejected: 'Rejected', duplicate: 'Duplicate', cancelled: 'Cancelled', ai_processing: 'AI processing', queued_offline: 'Queued offline',
};

const categoryLabels: Record<string, string> = {
  fire: 'Fire', medical: 'Medical', accident: 'Accident', crime_safety: 'Crime / Safety', flood: 'Flood', landslide: 'Landslide',
  earthquake: 'Earthquake', missing_person: 'Missing Person', road_hazard: 'Road Hazard', infrastructure_damage: 'Infrastructure Damage',
  electrical_hazard: 'Electrical Hazard', environmental: 'Environmental', other: 'Other',
};

function formatDate(value?: string | null) {
  if (!value) return 'Pending';
  return new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function ResidentReportPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    params.then(({ id: routeId }) => {
      if (!active) return;
      setId(routeId);
      fetch(`/api/incidents/${encodeURIComponent(routeId)}`)
        .then(async (response) => {
          const payload = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(payload.error ?? 'Unable to load this report.');
          return payload;
        })
        .then((payload) => { if (active) { setIncident(payload.incident); setUpdates(payload.updates ?? []); } })
        .catch((loadError) => { if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load this report.'); })
        .finally(() => { if (active) setLoading(false); });
    });
    return () => { active = false; };
  }, [params]);

  const currentStage = useMemo(() => stages.findIndex(([status]) => status === incident?.status), [incident?.status]);
  const isTerminal = ['rejected', 'duplicate', 'cancelled'].includes(incident?.status ?? '');

  if (loading) return <main className="min-h-screen bg-[#f5f8fc] px-4 py-8 sm:px-6"><div className="mx-auto max-w-2xl rounded-3xl border border-[#dce6f0] bg-white p-7 shadow-sm"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /><div className="mt-4 h-8 w-64 animate-pulse rounded bg-slate-200" /><div className="mt-8 space-y-3"><div className="h-16 rounded-2xl bg-slate-100" /><div className="h-16 rounded-2xl bg-slate-100" /></div></div></main>;

  if (error || !incident) return <main className="min-h-screen bg-[#f5f8fc] px-4 py-8 sm:px-6"><div className="mx-auto max-w-2xl"><Link href="/resident" className="text-sm font-bold text-slate-600">← Back to home</Link><div className="mt-6 rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><p className="text-sm font-bold text-red-700">Unable to load report</p><p className="mt-2 text-sm leading-6 text-slate-600">{error || `No report was found for ${id}.`}</p></div></div></main>;

  return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-6 sm:px-6"><div className="mx-auto max-w-2xl">
      <Link href="/resident" className="text-sm font-bold text-slate-600 hover:text-[#0b66c3]">← Back to home</Link>
      <section className="mt-6 rounded-3xl border border-[#dce6f0] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Incident report</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight">{categoryLabels[incident.category] ?? incident.category}</h1><p className="mt-1 font-mono text-xs text-slate-500">{incident.reference_number}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0b66c3]">{labels[incident.status] ?? incident.status}</span></div>
        <div className="mt-7 rounded-2xl bg-[#f5f8fc] p-5"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current status</p><p className="mt-2 text-lg font-extrabold">{labels[incident.status] ?? incident.status}</p><p className="mt-1 text-sm leading-6 text-slate-600">Your report status is updated by authorized barangay personnel as the response progresses.</p></div>

        {!isTerminal && <div className="mt-8"><h2 className="text-base font-bold">Response timeline</h2><ol className="mt-5 space-y-5">{stages.map(([status, label], index) => { const complete = currentStage >= index; const timestamp = status === 'submitted' ? incident.created_at : status === 'verified' ? incident.verified_at : status === 'assigned' ? incident.assigned_at : status === 'responding' ? incident.responding_at : status === 'on_site' ? incident.on_site_at : status === 'resolved' ? incident.resolved_at : status === 'closed' ? incident.closed_at : updates.find((item) => item.new_status === status)?.created_at; return <li key={status} className="flex gap-4"><div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete ? 'bg-[#0b66c3] text-white' : 'bg-slate-100 text-slate-400'}`}>{complete ? '✓' : index + 1}</div><div><p className={`text-sm font-bold ${complete ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p><p className="mt-1 text-xs text-slate-500">{formatDate(timestamp)}</p></div></li>; })}</ol></div>}

        <div className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-base font-bold">What you reported</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{incident.description}</p>{(incident.location_text || incident.landmark) && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-bold text-slate-800">Location</p><p className="mt-1">{incident.location_text || incident.landmark}</p></div>}</div>

        {updates.length > 0 && <div className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-base font-bold">Latest updates</h2><div className="mt-3 space-y-3">{updates.slice().reverse().map((update) => <div key={update.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold">{labels[update.new_status] ?? update.new_status}</p><p className="text-xs text-slate-500">{formatDate(update.created_at)}</p></div>{update.note && <p className="mt-2 text-sm leading-5 text-slate-600">{update.note}</p>}</div>)}</div></div>}

        <div className="mt-8 border-t border-slate-200 pt-6"><p className="text-sm font-bold">Safety reminder</p><p className="mt-1 text-sm leading-6 text-slate-600">BConnect supports reporting and coordination. For an immediate life-threatening emergency, call 911.</p></div>
      </section>
    </div></main>
  );
}
