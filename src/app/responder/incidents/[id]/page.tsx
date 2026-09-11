'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Incident = { id: string; reference_number: string; category: string; description: string; location_text?: string | null; landmark?: string | null; priority?: string | null; ai_priority?: string | null; status: string; latitude?: number | null; longitude?: number | null };
const statuses = ['assigned', 'accepted', 'responding', 'on_site', 'resolved'] as const;
const labels: Record<string, string> = { assigned: 'Assigned', accepted: 'Accepted', responding: 'Responding', on_site: 'On site', resolved: 'Resolved' };
const categories: Record<string, string> = { fire: 'Fire', medical: 'Medical', accident: 'Accident', crime_safety: 'Crime / Safety', flood: 'Flood', landslide: 'Landslide', earthquake: 'Earthquake', missing_person: 'Missing Person', road_hazard: 'Road Hazard', infrastructure_damage: 'Infrastructure Damage', electrical_hazard: 'Electrical Hazard', environmental: 'Environmental', other: 'Other' };

export default function ResponderIncidentPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    params.then(({ id: routeId }) => {
      if (!active) return;
      setId(routeId);
      fetch(`/api/incidents/${encodeURIComponent(routeId)}`)
        .then(async (response) => { const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || 'Unable to load incident.'); return data; })
        .then((data) => { if (active) setIncident(data.incident); })
        .catch((error) => { if (active) setMessage(error instanceof Error ? error.message : 'Unable to load incident.'); })
        .finally(() => { if (active) setLoading(false); });
    });
    return () => { active = false; };
  }, [params]);

  const currentStatus = incident?.status ?? 'assigned';
  const currentIndex = useMemo(() => statuses.indexOf(currentStatus as (typeof statuses)[number]), [currentStatus]);

  async function updateStatus(nextStatus: string) {
    if (!incident || busy) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/incidents/${encodeURIComponent(incident.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to update incident.');
      setIncident(data.incident);
      setMessage(`Incident updated to ${labels[nextStatus] ?? nextStatus}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update incident.'); } finally { setBusy(false); }
  }

  if (loading) return <main className="min-h-screen bg-slate-50 px-4 py-6"><div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm"><div className="h-5 w-32 animate-pulse rounded bg-slate-200" /><div className="mt-5 h-8 w-72 animate-pulse rounded bg-slate-200" /><div className="mt-8 h-32 animate-pulse rounded-2xl bg-slate-100" /></div></main>;
  if (!incident) return <main className="min-h-screen bg-slate-50 px-4 py-6"><div className="mx-auto max-w-4xl"><Link href="/responder" className="text-sm font-semibold text-slate-600">← Back to assignments</Link><div className="mt-6 rounded-3xl border border-red-200 bg-white p-7"><p className="font-bold text-red-700">Unable to load incident</p><p className="mt-2 text-sm text-slate-600">{message || `No incident found for ${id}.`}</p></div></div></main>;

  return (
    <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/responder" className="text-sm font-semibold text-slate-600 hover:text-slate-950">← Back to assignments</Link>
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Incident {incident.reference_number}</p><h1 className="mt-2 text-2xl font-extrabold text-slate-950">{categories[incident.category] ?? incident.category}</h1><p className="mt-2 text-sm text-slate-600">{incident.location_text || incident.landmark || 'Location not provided'}</p></div><span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">{(incident.priority ?? incident.ai_priority ?? 'unassigned').toUpperCase()}</span></div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resident report</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-800">{incident.description}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</p><p className="mt-2 text-sm font-semibold">{incident.location_text || incident.landmark || 'Not provided'}</p>{incident.latitude != null && incident.longitude != null && <p className="mt-2 font-mono text-xs text-slate-500">{incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}</p>}</div></div>
        <div className="mt-8"><p className="text-sm font-semibold text-slate-900">Response status</p><div className="mt-4 grid gap-2 sm:grid-cols-5">{statuses.map((item, index) => { const active = item === currentStatus; const complete = currentIndex > index; const enabled = !busy && (index === currentIndex || index === currentIndex + 1); return <button key={item} type="button" disabled={!enabled} onClick={() => updateStatus(item)} className={`rounded-xl border px-3 py-3 text-left text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'border-slate-950 bg-slate-950 text-white' : complete ? 'border-slate-300 bg-slate-100 text-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>{labels[item]}{active && <span className="mt-1 block text-[10px] font-normal opacity-70">Current</span>}</button>; })}</div></div>
        {message && <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p>}
        <div className="mt-8 border-t border-slate-200 pt-6"><p className="text-xs leading-5 text-slate-500">Operational status changes are permission checked by BConnect. AI recommendations are decision support and do not authorize dispatch.</p></div>
      </section>
    </div></main>
  );
}
