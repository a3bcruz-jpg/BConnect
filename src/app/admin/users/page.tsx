'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BCONNECT_ROLES, ROLE_LABELS, ROLE_SCOPE, type BConnectRole } from '@/lib/access/roles';

type UserRecord = {
  id: string;
  full_name: string;
  email: string | null;
  role: BConnectRole;
  is_active: boolean;
  barangays?: { name?: string; municipality?: string } | null;
};

export default function UsersPage() {
  const [role, setRole] = useState<'all' | BConnectRole>('all');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? 'Unable to load users.');
        setUsers(body.users ?? []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => role === 'all' ? users : users.filter((user) => user.role === role),
    [role, users],
  );

  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm font-bold text-[#7ec8ff]">← Administration</Link>
            <h1 className="mt-3 text-3xl font-extrabold">Users & Roles</h1>
            <p className="mt-1 text-sm text-[#a9c9c0]">Authenticated users and organization-scoped roles.</p>
          </div>
          <button className="rounded-xl bg-[#31d477] px-4 py-2.5 text-sm font-extrabold text-[#04251c]">Add user</button>
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#0b2924] p-5">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setRole('all')} className={`rounded-xl px-3 py-2 text-xs font-bold ${role === 'all' ? 'bg-[#0b7bd4] text-white' : 'bg-[#071f1d] text-[#a9c9c0]'}`}>All</button>
            {BCONNECT_ROLES.map((item) => (
              <button key={item} onClick={() => setRole(item)} className={`rounded-xl px-3 py-2 text-xs font-bold ${role === item ? 'bg-[#0b7bd4] text-white' : 'bg-[#071f1d] text-[#a9c9c0]'}`}>
                {ROLE_LABELS[item]}
              </button>
            ))}
          </div>

          {loading && <div className="mt-6 rounded-2xl bg-[#071f1d] p-6 text-sm text-[#a9c9c0]">Loading users...</div>}
          {error && <div className="mt-6 rounded-2xl border border-[#ff8c8c]/20 bg-[#401b1b] p-6 text-sm text-[#ffc1c1]">{error}</div>}
          {!loading && !error && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead><tr className="border-b border-white/10 text-xs uppercase tracking-wider text-[#7ec8ff]"><th className="px-3 py-3">User</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Scope</th><th className="px-3 py-3">Status</th></tr></thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="px-3 py-4"><p className="font-bold">{user.full_name}</p><p className="text-xs text-[#a9c9c0]">{user.email ?? 'No email on profile'}</p></td>
                      <td className="px-3 py-4"><span className="rounded-full bg-[#dff5ea] px-3 py-1 text-xs font-bold text-[#07563f]">{ROLE_LABELS[user.role]}</span></td>
                      <td className="px-3 py-4 text-[#c7ded7]">{user.barangays?.name ?? 'System scope'}{user.barangays?.municipality ? ` · ${user.barangays.municipality}` : ''}<span className="ml-2 text-xs text-[#7f9d96]">({ROLE_SCOPE[user.role]})</span></td>
                      <td className={`px-3 py-4 ${user.is_active ? 'text-[#31d477]' : 'text-[#a9c9c0]'}`}>{user.is_active ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length && <p className="p-6 text-sm text-[#a9c9c0]">No users match this role.</p>}
            </div>
          )}
        </section>
        <p className="mt-4 text-xs text-[#7f9d96]">Production data is loaded through the authenticated admin API and Supabase RLS.</p>
      </div>
    </main>
  );
}
