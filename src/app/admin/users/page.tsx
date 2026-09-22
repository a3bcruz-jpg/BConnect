'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BCONNECT_ROLES, ROLE_LABELS, ROLE_SCOPE, type BConnectRole } from '@/lib/access/roles';

const sampleUsers = [
  { name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'resident' as BConnectRole, scope: 'Barangay San Isidro', status: 'Active' },
  { name: 'Maria Santos', email: 'maria@example.com', role: 'official' as BConnectRole, scope: 'Barangay San Isidro', status: 'Active' },
  { name: 'Pedro Reyes', email: 'pedro@example.com', role: 'responder' as BConnectRole, scope: 'Barangay San Isidro', status: 'Active' },
  { name: 'Ana Garcia', email: 'ana@example.com', role: 'barangay_admin' as BConnectRole, scope: 'Barangay San Isidro', status: 'Active' },
];

export default function UsersPage() {
  const [role, setRole] = useState<'all' | BConnectRole>('all');
  const filtered = useMemo(() => role === 'all' ? sampleUsers : sampleUsers.filter((user) => user.role === role), [role]);

  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><Link href="/admin" className="text-sm font-bold text-[#7ec8ff]">← Administration</Link><h1 className="mt-3 text-3xl font-extrabold">Users & Roles</h1><p className="mt-1 text-sm text-[#a9c9c0]">Role-aware community access structure.</p></div>
          <button className="rounded-xl bg-[#31d477] px-4 py-2.5 text-sm font-extrabold text-[#04251c]">Add user</button>
        </div>
        <section className="mt-6 rounded-3xl border border-white/10 bg-[#0b2924] p-5">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setRole('all')} className={`rounded-xl px-3 py-2 text-xs font-bold ${role === 'all' ? 'bg-[#0b7bd4] text-white' : 'bg-[#071f1d] text-[#a9c9c0]'}`}>All</button>
            {BCONNECT_ROLES.map((item) => <button key={item} onClick={() => setRole(item)} className={`rounded-xl px-3 py-2 text-xs font-bold ${role === item ? 'bg-[#0b7bd4] text-white' : 'bg-[#071f1d] text-[#a9c9c0]'}`}>{ROLE_LABELS[item]}</button>)}
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-[#7ec8ff]"><th className="px-3 py-3">User</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Scope</th><th className="px-3 py-3">Status</th></tr></thead>
              <tbody>{filtered.map((user) => <tr key={user.email} className="border-b border-white/5"><td className="px-3 py-4"><p className="font-bold">{user.name}</p><p className="text-xs text-[#a9c9c0]">{user.email}</p></td><td className="px-3 py-4"><span className="rounded-full bg-[#dff5ea] px-3 py-1 text-xs font-bold text-[#07563f]">{ROLE_LABELS[user.role]}</span></td><td className="px-3 py-4 text-[#c7ded7]">{user.scope}<span className="ml-2 text-xs text-[#7f9d96]">({ROLE_SCOPE[user.role]})</span></td><td className="px-3 py-4 text-[#31d477]">{user.status}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
        <p className="mt-4 text-xs text-[#7f9d96]">Demo records only. Production users must come from Supabase and be protected by server-side authorization and RLS.</p>
      </div>
    </main>
  );
}
