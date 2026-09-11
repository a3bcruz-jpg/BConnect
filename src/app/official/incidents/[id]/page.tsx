'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Incident = { id: string; reference_number: string; category: string; description: string; latitude?: number | null; longitude?: number | null; location_text?: string | null; landmark?: string | null; priority?: string | null; ai_priority?: string | null; status: string; created_at: string; updated_at: string; verified_at?: string | null; assigned_at?: string | null; responding_at?: string | null; on_site_at?: string | null; resolved_at?: string | null; assigned_to?: string | null };
type Update = { id: string; previous_status: string | null; new_status: string; note: string | null; created_at: string };
type Responder = { id: string; full_name: string; phone?: string | null; responder_availability: 'available' | 'busy' | 'offline'; is_active: boolean };

const labels: Record<string, string> = { submitted: 'Submitted', ai_processing: 'AI processing', pending_verification: 'Pending verification', verified: 'Verified', assigned: 'Responder assigned', accepted: 'Accepted', responding: 'Responding', on_site: 'On site', resolved: 'Resolved', closed: 'Closed', rejected: 'Rejected', duplicate: 'Duplicate', cancelled: 'Cancelled' };
const categoryLabels: Record<string, string> = { fire: 'Fire', medical: 'Medical', accident: 'Accident', crime_safety: 'Crime / Safety', flood: 'Flood', landslide: 'Landslide', earthquake: 'Earthquake', missing_person: 'Missing Person', road_hazard: 'Road Hazard', infrastructure_damage: 'Infrastructure Damage', electrical_hazard: 'Electrical Hazard', environmental: 'Environmental', other: 'Other' };
const transitions: Record<string, string[]> = { submitted: ['pending_verification', 'rejected', 'duplicate', 'cancelled'], pending_verification: ['verified', 'rejected', 'duplicate', 'cancelled'], verified: ['assigned', 'cancelled'], assigned: ['accepted', 'cancelled'], accepted: ['responding', 'cancelled'], responding: ['on_site', 'cancelled'], on_site: ['resolved'], resolved: ['closed'] };

function formatDate(value?: string | null) { return value ? new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Pending'; }
function titleCase(value: string) { return value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()); }

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('');
  const [incident, setIncident] = useState<Incident | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [responders, setResponders] = useState<Responder[]>([]);
  const [selectedResponder, setSelectedResponder] = useState('');
  const [loading, setLoading] = useState(true);
  const [respondersLoading, setRespondersLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  async function load(routeId: string) {
    const response = await fetch(`/api/incidents/${encodeURIComponent(routeId)}`, { cache: 'no-store' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error ?? 'Unable to load incident.');
    setIncident(payload.incident); setUpdates(payload.updates ?? []);
    if (payload.incident?.assigned_to) setSelectedResponder(payload.incident.assigned_to);
  }

  async function loadResponders() {
    setRespondersLoading(true);
    try {
      const response = await fetch('/api/responders', { cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? 'Unable to load responders.');
      setResponders(payload.responders ?? []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load responders.'); }
    finally { setRespondersLoading(false); }
  }

  useEffect(() => {
    let active = true;
    params.then(({ id: routeId }) => { if (!active) return; setId(routeId); Promise.all([load(routeId), loadResponders()]).catch((e) => { if (active) setError(e instanceof Error ? e.message : 'Unable to load incident.'); }).finally(() => { if (active) setLoading(false); }); });
    return () => { active = false; };
  }, [params]);

  const nextActions = useMemo(() => incident ? transitions[incident.status] ?? [] : [], [incident?.status]);

  async function transition(status: string, note?: string, assignedTo?: string) {
    if (!incident || busy) return;
    setBusy(status); setError('');
    try {
      const response = await fetch(`/api/incidents/${encodeURIComponent(incident.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status, ...(assignedTo ? { assigned_to: assignedTo } : {}), ...(note ? { note } : {}) }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? `Unable to change status to ${labels[status] ?? status}.`);
      await load(incident.id); await loadResponders();
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to update incident.'); }
    finally { setBusy(''); }
  }

  if (loading) return <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6"><div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"><div className="h-4 w-40 animate-pulse rounded bg-slate-200" /><div className="mt-4 h-9 w-72 animate-pulse rounded bg-slate-200" /><div className="mt-8 h-48 animate-pulse rounded-2xl bg-slate-100" /></div></main>;
  if (error || !incident) return <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6"><div className="mx-auto max-w-5xl"><Link href="/official" className="text-sm font-bold text-slate-600">← Back to dashboard</Link><div className="mt-6 rounded-3xl border border-red-200 bg-white p-7 shadow-sm"><p className="font-bold text-red-700">Unable to load incident</p><p className="mt-2 text-sm text-slate-600">{error || `No incident was found for ${id}.`}</p></div></div></main>;

  const priority = incident.priority ?? incident.ai_priority ?? 'unassigned';
  const locationText = incident.location_text || incident.landmark || 'No location text provided';
  const terminal = ['rejected', 'duplicate', 'cancelled', 'closed'].includes(incident.status);
  const assignedResponder = responders.find((responder) => responder.id === incident.assigned_to);

  return <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between gap-4"><Link href="/official" className="text-sm font-bold text-slate-600 hover:text-slate-950">← Back to dashboard</Link><span className="font-mono text-xs text-slate-500">{incident.reference_number}</span></div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]"><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Incident detail</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">{categoryLabels[incident.category] ?? titleCase(incident.category)}</h1><p className="mt-2 text-sm text-slate-500">Reported {formatDate(incident.created_at)}</p></div><div className="flex gap-2"><span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">{priority.toUpperCase()}</span><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0b66c3]">{labels[incident.status] ?? titleCase(incident.status)}</span></div></div><div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#0b66c3]">AI decision support</p><p className="mt-2 text-sm font-bold">{(incident.ai_priority ?? 'Not assessed').toUpperCase()}</p><p className="mt-1 text-sm leading-5 text-slate-600">AI output is advisory. Authorized officials retain final verification and priority control.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</p><p className="mt-2 text-sm font-bold">{locationText}</p>{incident.latitude != null && incident.longitude != null && <p className="mt-1 font-mono text-xs text-slate-500">{incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}</p>}</div></div><div className="mt-8"><h2 className="text-base font-bold">Resident report</h2><blockquote className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">{incident.description}</blockquote></div><div className="mt-8"><h2 className="text-base font-bold">Responder</h2><div className="mt-3 rounded-2xl border border-slate-200 p-4"><p className="text-sm font-bold">{assignedResponder?.full_name ?? (incident.assigned_to ? 'Assigned responder' : 'Not assigned')}</p>{assignedResponder?.phone && <p className="mt-1 text-xs text-slate-500">{assignedResponder.phone}</p>}{assignedResponder && <p className="mt-2 text-xs font-semibold capitalize text-slate-500">Status: {assignedResponder.responder_availability}</p>}</div></div><div className="mt-8"><h2 className="text-base font-bold">Workflow history</h2>{updates.length ? <ol className="mt-4 space-y-3">{updates.slice().reverse().map((update) => <li key={update.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap justify-between gap-2"><p className="text-sm font-bold">{labels[update.new_status] ?? titleCase(update.new_status)}</p><p className="text-xs text-slate-500">{formatDate(update.created_at)}</p></div>{update.note && <p className="mt-2 text-sm text-slate-600">{update.note}</p>}</li>)}</ol> : <p className="mt-3 text-sm text-slate-500">No workflow updates have been recorded yet.</p>}</div></section><aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Official actions</h2><p className="mt-1 text-xs leading-5 text-slate-500">Actions are permission checked by the API.</p>{error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">{error}</div>}<div className="mt-4 space-y-3">{nextActions.includes('pending_verification') && <button disabled={!!busy} onClick={() => transition('pending_verification')} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Start verification</button>}{nextActions.includes('verified') && <button disabled={!!busy} onClick={() => transition('verified')} className="w-full rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Verify incident</button>}{nextActions.includes('assigned') && <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#0b66c3]">Dispatch</p><label className="mt-3 block text-sm font-bold text-slate-800" htmlFor="responder">Select authorized responder</label><select id="responder" value={selectedResponder} onChange={(event) => setSelectedResponder(event.target.value)} disabled={!!busy || respondersLoading} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0b66c3]"> <option value="">{respondersLoading ? 'Loading responders…' : 'Choose responder'}</option>{responders.map((responder) => <option key={responder.id} value={responder.id} disabled={responder.responder_availability === 'offline'}>{responder.full_name} • {titleCase(responder.responder_availability)}</option>)}</select><button disabled={!!busy || !selectedResponder || respondersLoading} onClick={() => transition('assigned', 'Assigned by authorized official.', selectedResponder)} className="mt-3 w-full rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Assign & dispatch</button><p className="mt-2 text-[11px] leading-4 text-slate-500">Only active responders from this barangay are listed. Offline responders cannot be assigned.</p></div>}{nextActions.includes('accepted') && <button disabled={!!busy} onClick={() => transition('accepted')} className="w-full rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Mark accepted</button>}{nextActions.includes('responding') && <button disabled={!!busy} onClick={() => transition('responding')} className="w-full rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Mark responding</button>}{nextActions.includes('on_site') && <button disabled={!!busy} onClick={() => transition('on_site')} className="w-full rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Mark on site</button>}{nextActions.includes('resolved') && <button disabled={!!busy} onClick={() => transition('resolved')} className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Mark resolved</button>}{nextActions.includes('closed') && <button disabled={!!busy} onClick={() => transition('closed')} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">Close incident</button>}{nextActions.includes('rejected') && <button disabled={!!busy} onClick={() => transition('rejected', 'Rejected during official review.')} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50">Reject</button>}{nextActions.includes('duplicate') && <button disabled={!!busy} onClick={() => transition('duplicate', 'Marked as duplicate during official review.')} className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 disabled:opacity-50">Mark duplicate</button>}{nextActions.includes('cancelled') && <button disabled={!!busy} onClick={() => transition('cancelled', 'Cancelled by authorized official.')} className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 disabled:opacity-50">Cancel incident</button>}{terminal && <div className="rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-500">This incident is in a terminal workflow state.</div>}</div><div className="mt-5 rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Last updated</p><p className="mt-1 text-sm font-semibold">{formatDate(incident.updated_at)}</p></div></aside></div></div></main>;
}
