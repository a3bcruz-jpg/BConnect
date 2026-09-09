'use client';

import { useState } from 'react';
import Link from 'next/link';

const statuses = ['assigned', 'responding', 'on_site', 'resolved'] as const;

export default function ResponderIncidentPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState('assigned');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function updateStatus(nextStatus: string) {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/incidents/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Unable to update incident.');
      setStatus(nextStatus);
      setMessage(`Incident updated to ${nextStatus.replace('_', ' ')}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update incident.');
    } finally {
      setBusy(false);
    }
  }

  const currentIndex = statuses.indexOf(status as (typeof statuses)[number]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/responder" className="text-sm font-semibold text-slate-600 hover:text-slate-950">← Back to assignments</Link>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Incident</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950">{params.id}</h1>
              <p className="mt-2 text-sm text-slate-600">Vehicular Accident · National Road, Zone 2</p>
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">High priority</span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Report summary</p>
              <p className="mt-2 text-sm leading-6 text-slate-800">Two vehicles reported involved. Resident requested immediate assistance. Details must be verified on site.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Safety reminder</p>
              <p className="mt-2 text-sm leading-6 text-slate-800">Use this workflow to communicate operational status. Do not treat AI recommendations as dispatch authorization.</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-slate-900">Response status</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {statuses.map((item, index) => {
                const active = item === status;
                const complete = index < currentIndex;
                return (
                  <button
                    key={item}
                    type="button"
                    disabled={busy || index > currentIndex + 1}
                    onClick={() => updateStatus(item)}
                    className={`rounded-xl border px-3 py-3 text-left text-xs font-semibold capitalize transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'border-slate-950 bg-slate-950 text-white' : complete ? 'border-slate-300 bg-slate-100 text-slate-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    {item.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {message && <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p>}
        </section>
      </div>
    </main>
  );
}
