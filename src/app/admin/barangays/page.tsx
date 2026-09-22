'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Building2, ChevronRight, MapPin, Users, ShieldCheck, Radio } from 'lucide-react';

type Barangay = {
  id: string;
  name: string;
  municipality: string;
  residents: number;
  officials: number;
  responders: number;
  incidents: number;
};

export default function BarangaysAdminPage() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/barangays')
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? 'Unable to load barangays.');
        const rows = body.barangays ?? [];
        setBarangays(rows);
        if (rows[0]) setSelected(rows[0].id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load barangays.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => barangays.filter((item) => `${item.name} ${item.municipality}`.toLowerCase().includes(query.toLowerCase())),
    [query, barangays],
  );
  const active = barangays.find((item) => item.id === selected) ?? barangays[0];

  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm font-bold text-[#7ec8ff]">← Administration</Link>

        <header className="mt-4 rounded-3xl border border-white/10 bg-[#0b2924] p-6 shadow-xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#31d477]">Organization management</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Barangays</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#a9c9c0]">Manage operational community boundaries and their residents, officials, responders, and incidents.</p>
            </div>
            <button className="rounded-xl bg-[#31d477] px-4 py-2.5 text-sm font-extrabold text-[#04251c]">+ Add barangay</button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { label: 'Barangays', value: barangays.length, Icon: Building2 },
              { label: 'Residents', value: barangays.reduce((n, b) => n + b.residents, 0).toLocaleString(), Icon: Users },
              { label: 'Responders', value: barangays.reduce((n, b) => n + b.responders, 0), Icon: Radio },
              { label: 'Active incidents', value: barangays.reduce((n, b) => n + b.incidents, 0), Icon: ShieldCheck },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#071f1d] p-4">
                <Icon className="h-5 w-5 text-[#7ec8ff]" />
                <p className="mt-3 text-2xl font-extrabold">{value}</p>
                <p className="mt-1 text-xs text-[#a9c9c0]">{label}</p>
              </div>
            ))}
          </div>
        </header>

        {loading && <div className="mt-5 rounded-2xl bg-[#0b2924] p-6 text-sm text-[#a9c9c0]">Loading barangay data...</div>}
        {error && <div className="mt-5 rounded-2xl border border-[#ff8c8c]/20 bg-[#401b1b] p-6 text-sm text-[#ffc1c1]">{error}</div>}

        {!loading && !error && active && (
          <section className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.45fr]">
            <div className="rounded-3xl border border-white/10 bg-[#0b2924] p-5">
              <h2 className="font-extrabold">Community scopes</h2>
              <p className="mt-1 text-xs text-[#a9c9c0]">Select a barangay to inspect its operational structure.</p>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search barangay..." className="mt-4 w-full rounded-xl border border-white/10 bg-[#071f1d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#71958c] focus:border-[#31d477]/50" />
              <div className="mt-3 space-y-2">
                {filtered.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item.id)} className={`w-full rounded-2xl border px-4 py-4 text-left transition ${selected === item.id ? 'border-[#31d477]/50 bg-[#0e3a30]' : 'border-white/10 bg-[#071f1d] hover:bg-[#0e322c]'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold">{item.name}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-[#a9c9c0]"><MapPin className="h-3.5 w-3.5" />{item.municipality}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#7ec8ff]" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#a9c9c0]">
                      <span>{item.residents.toLocaleString()} residents</span><span>•</span><span>{item.responders} responders</span><span>•</span><span>{item.incidents} incidents</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b2924] p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#31d477]">Selected scope</p>
                  <h2 className="mt-1 text-2xl font-extrabold">{active.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-[#a9c9c0]"><MapPin className="h-4 w-4" />{active.municipality}</p>
                </div>
                <span className="rounded-full bg-[#31d477]/15 px-3 py-1.5 text-xs font-bold text-[#62e49b]">Active</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ['Residents', active.residents.toLocaleString(), 'registered community members'],
                  ['Officials', active.officials, 'verification and oversight'],
                  ['Responders', active.responders, 'response personnel'],
                  ['Incidents', active.incidents, 'current operational records'],
                ].map(([label, value, caption]) => (
                  <div key={String(label)} className="rounded-2xl border border-white/10 bg-[#071f1d] p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7ec8ff]">{label}</p>
                    <p className="mt-2 text-2xl font-extrabold">{value}</p>
                    <p className="mt-1 text-xs text-[#a9c9c0]">{caption}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#071f1d] p-5">
                <p className="text-sm font-extrabold">Operational relationship</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-4">
                  {[
                    ['Residents', 'Create reports'], ['Officials', 'Verify incidents'], ['Responders', 'Handle response'], ['Incidents', 'Track lifecycle'],
                  ].map(([role, action]) => <div key={role} className="rounded-xl border border-white/10 bg-[#0b2924] p-3"><p className="text-xs font-bold">{role}</p><p className="mt-1 text-[11px] leading-5 text-[#a9c9c0]">{action}</p></div>)}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link href="/admin/users" className="rounded-xl bg-[#0b7bd4] px-4 py-2.5 text-sm font-bold text-white">Manage users</Link>
                <Link href="/official" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-[#c7ded7] hover:bg-white/5">Open operations</Link>
              </div>
              <p className="mt-5 text-xs leading-5 text-[#71958c]">Production data is loaded through the authenticated admin API and Supabase RLS.</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
