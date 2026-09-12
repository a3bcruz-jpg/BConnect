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

const priorityStyles: Record<string, string> = {
  critical: 'bg-red-50 text-red-700',
  high: 'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-slate-100 text-slate-700',
};

const statusLabels: Record<string, string> = {
  assigned: 'Assigned',
  accepted: 'Accepted',
  responding: 'Responding',
  on_site: 'On site',
  resolved: 'Resolved',
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    loadAssignments();
    const interval = window.setInterval(loadAssignments, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-semibold text-slate-900">BConnect</p><p className="text-xs text-slate-500">Responder workspace</p></div>
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700">On duty</div>
        </header>

        <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
          <p className="text-sm text-slate-400">Assigned to you</p>
          <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-2xl font-semibold">{assignments.length} active incidents</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Review the latest verified information, acknowledge assignments, and keep the barangay team updated.</p>
            </div>
            <Link href="/official" className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-slate-100">Official dashboard</Link>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Active assignments</h2>
            <button type="button" onClick={loadAssignments} className="text-xs font-medium text-blue-700 hover:underline">Refresh</button>
          </div>

          {error && <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {loading ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading live assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No active incidents are assigned to you.</div>
          ) : (
            <div className="mt-3 space-y-3">
              {assignments.map((incident) => {
                const priority = incident.priority?.toLowerCase() || 'low';
                const status = statusLabels[incident.status] ?? formatText(incident.status);
                const location = incident.location_text || (incident.latitude != null && incident.longitude != null ? `${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}` : 'Location not provided');
                return (
                  <article key={incident.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">{formatText(incident.category)}</h3>
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[priority] ?? priorityStyles.low}`}>{formatText(priority)}</span>
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-500">{incident.reference_number} · {formatReported(incident.created_at)}</p>
                        <p className="mt-3 text-sm text-slate-700">{location}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{status}</span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link href={`/responder/incidents/${incident.id}`} className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">Open incident</Link>
                      <Link href={`/responder/incidents/${incident.id}`} className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:border-slate-400">Update status</Link>
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
