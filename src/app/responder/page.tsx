'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Incident = {
  id: string;
  reference_number: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  location_text: string | null;
  priority: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
};

type Availability = 'available' | 'busy' | 'offline';

const priorityStyles: Record<string, string> = {
  critical: 'border border-red-300/20 bg-[#351c20] text-[#ff9c9c]',
  high: 'border border-red-200 bg-red-50 text-red-700',
  medium: 'border border-amber-300/20 bg-[#3b3019] text-amber-700',
  low: 'border border-white/10 bg-[#102f2a] text-[#c7ded7]',
};

const statusLabels: Record<string, string> = {
  assigned: 'Assigned',
  accepted: 'Accepted',
  responding: 'Responding',
  on_site: 'On site',
  resolved: 'Resolved',
};

const availabilityLabels: Record<Availability, string> = {
  available: 'Available',
  busy: 'Busy',
  offline: 'Offline',
};

function formatText(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatReported(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function ResponderPage() {
  const [assignments, setAssignments] = useState<Incident[]>([]);
  const [availability, setAvailability] = useState<Availability>('available');
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [availabilityError, setAvailabilityError] = useState('');

  async function loadAssignments() {
    try {
      setError('');
      const response = await fetch('/api/incidents', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load assignments.');
      const active = (data.incidents ?? []).filter(
        (incident: Incident) => incident.assigned_to && !['resolved', 'closed', 'cancelled', 'rejected', 'duplicate'].includes(incident.status),
      );
      setAssignments(active);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load assignments.');
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailability() {
    try {
      setAvailabilityError('');
      const response = await fetch('/api/responders/availability', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Unable to load availability.');
      if (data.availability === 'available' || data.availability === 'busy' || data.availability === 'offline') {
        setAvailability(data.availability);
      }
    } catch (err) {
      setAvailabilityError(err instanceof Error ? err.message : 'Unable to load availability.');
    } finally {
      setAvailabilityLoading(false);
    }
  }

  async function changeAvailability(next: Availability) {
    if (availabilitySaving || next === availability) return;
    const previous = availability;
    setAvailability(next);
    setAvailabilitySaving(true);
    setAvailabilityError('');
    try {
      const response = await fetch('/api/responders/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: next }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Unable to update availability.');
      if (data.availability === 'available' || data.availability === 'busy' || data.availability === 'offline') {
        setAvailability(data.availability);
      }
    } catch (err) {
      setAvailability(previous);
      setAvailabilityError(err instanceof Error ? err.message : 'Unable to update availability.');
    } finally {
      setAvailabilitySaving(false);
    }
  }

  useEffect(() => {
    loadAssignments();
    loadAvailability();
    const interval = window.setInterval(() => {
      loadAssignments();
      loadAvailability();
    }, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <Link href="/" className="rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            <p className="text-base font-bold tracking-tight text-white">BConnect</p>
            <p className="text-xs font-medium text-[#8fb3a9]">Responder workspace</p>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7fa99e]">Duty status</p>
              <p className="text-xs text-slate-500">{availabilitySaving ? 'Saving status…' : 'Visible to operations'}</p>
            </div>
            <label htmlFor="availability" className="sr-only">Responder availability</label>
            <select
              id="availability"
              value={availability}
              onChange={(event) => changeAvailability(event.target.value as Availability)}
              disabled={availabilityLoading || availabilitySaving}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60"
            >
              {(Object.keys(availabilityLabels) as Availability[]).map((item) => <option key={item} value={item}>{availabilityLabels[item]}</option>)}
            </select>
          </div>
        </header>

        {availabilityError && <div role="alert" className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-[#f4d38a]">{availabilityError}</div>}

        <section className="mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#041c1a] via-[#075346] to-[#0b66c3] p-6 text-white shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c1ddd5]">Live operations</div>
              <p className="mt-4 text-sm font-medium text-slate-400">Assigned to you</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{assignments.length} active incidents</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Review verified information, acknowledge assignments, and keep the barangay team updated with timely status changes.</p>
            </div>
            <Link href="/official" className="rounded-xl bc-green-action px-4 py-3 text-center text-sm font-black transition hover:bg-[#123d35] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950">Official dashboard</Link>
          </div>
        </section>

        <section className="mt-7" aria-labelledby="active-assignments-heading">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="active-assignments-heading" className="text-lg font-semibold tracking-tight text-white">Active assignments</h2>
              <p className="mt-1 text-xs text-slate-500">Automatically refreshed every 30 seconds.</p>
            </div>
            <button type="button" onClick={loadAssignments} disabled={loading} className="rounded-lg px-2 py-2 text-xs font-semibold text-[#7ec8ff] transition hover:bg-[#e8f3ff] focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-wait disabled:opacity-50">Refresh</button>
          </div>

          {error && <div role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-5 text-red-700">{error}</div>}
          {loading ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-[#0b2924] border-white/10 p-6 text-sm text-slate-500 shadow-sm">Loading live assignments…</div>
          ) : assignments.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white bc-panel p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-700">No active assignments</p>
              <p className="mt-1 text-xs text-slate-500">New assignments will appear here when they are linked to your responder account.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {assignments.map((incident) => {
                const priority = incident.priority?.toLowerCase() || 'low';
                const status = statusLabels[incident.status] ?? formatText(incident.status);
                const location = incident.location_text || (incident.latitude != null && incident.longitude != null ? `${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}` : 'Location not provided');
                return (
                  <article key={incident.id} className="rounded-2xl border border-slate-200 bg-white bc-panel p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-950">{formatText(incident.category)}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[priority] ?? priorityStyles.low}`}>{formatText(priority)}</span>
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-500">{incident.reference_number} · {formatReported(incident.created_at)}</p>
                        <p className="mt-3 break-words text-sm text-slate-700">{location}</p>
                      </div>
                      <span className="w-fit rounded-full border border-slate-200 bg-[#e8f3ff] px-3 py-1 text-xs font-semibold text-slate-700">{status}</span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      <Link href={`/responder/incidents/${incident.id}`} className="rounded-xl bc-green-action px-4 py-2.5 text-xs font-black transition hover:bg-[#102f2a] focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">Open incident</Link>
                      <Link href={`/responder/incidents/${incident.id}`} className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-[#f0f7ff] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">Update status</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <p className="mt-8 pb-8 text-xs leading-5 text-slate-500">BConnect is a coordination aid. Responders and authorized officials retain responsibility for operational decisions and emergency dispatch.</p>
      </div>
    </main>
  );
}
