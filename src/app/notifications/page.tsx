'use client';

import { useEffect, useMemo, useState } from 'react';

type NotificationItem = {
  id: string;
  type: string;
  priority: 'critical' | 'high' | 'normal';
  title: string;
  message: string;
  incident_id?: string | null;
  read_at?: string | null;
  created_at: string;
};

const priorityClass: Record<NotificationItem['priority'], string> = {
  critical: 'border-red-200 bg-red-50',
  high: 'border-orange-200 bg-orange-50',
  normal: 'border-slate-200 bg-white',
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const unread = useMemo(() => items.filter((item) => !item.read_at).length, [items]);

  async function loadNotifications() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/notifications?limit=100', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to load notifications.');
      setItems(payload.notifications ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    });
    if (response.ok) setItems((current) => current.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item));
  }

  async function markAllRead() {
    const response = await fetch('/api/notifications/read-all', { method: 'PATCH' });
    if (response.ok) {
      const now = new Date().toISOString();
      setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at ?? now })));
    }
  }

  useEffect(() => { void loadNotifications(); }, []);

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#10233f]">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b66c3]">BConnect</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Notifications</h1>
              <p className="mt-1 text-sm text-slate-500" aria-live="polite">{unread} unread notification{unread === 1 ? '' : 's'}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => void loadNotifications()} disabled={loading} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0b66c3] disabled:cursor-not-allowed disabled:opacity-50">Refresh</button>
              <button type="button" onClick={() => void markAllRead()} disabled={!unread || loading} className="rounded-xl bg-[#0b66c3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#075aa9] focus:outline-none focus:ring-2 focus:ring-[#0b66c3] disabled:cursor-not-allowed disabled:opacity-40">Mark all read</button>
            </div>
          </div>
        </header>

        {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
        {loading ? <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">Loading notifications...</div> : (
          <section aria-label="Notification list" className="mt-5 space-y-3">
            {!items.length && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">No notifications yet.</div>}
            {items.map((item) => (
              <article key={item.id} className={`rounded-2xl border p-5 shadow-sm transition ${priorityClass[item.priority]} ${item.read_at ? 'opacity-70' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{item.title}</h2>
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">{item.priority}</span>
                      {!item.read_at && <span className="rounded-full bg-[#0b66c3] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Unread</span>}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{item.message}</p>
                    {item.incident_id && <p className="mt-2 text-xs font-medium text-slate-500">Incident: {item.incident_id}</p>}
                    <p className="mt-2 text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                  {!item.read_at && <button type="button" onClick={() => void markRead(item.id)} className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0b66c3]">Mark read</button>}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
