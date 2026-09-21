'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setError('This reset link is invalid or expired. Request a new link.');
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setSaving(true);
    setError('');
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError(updateError.message);
    else setMessage('Password updated successfully. You can now sign in.');
    setSaving(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-[#dce6f0] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-extrabold text-[#10233f]">Create a new password</h1>
        <p className="mt-1 text-sm text-slate-500">Choose a new password for your BConnect account.</p>
        {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
        {message && <div role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{message}</div>}
        {ready && !message && <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input aria-label="New password" type="password" required minLength={8} autoComplete="new-password" placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3]" />
          <input aria-label="Confirm new password" type="password" required minLength={8} autoComplete="new-password" placeholder="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3]" />
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white disabled:opacity-50">{saving ? 'UPDATING…' : 'UPDATE PASSWORD'}</button>
        </form>}
        {message && <button onClick={() => router.replace('/login')} className="mt-5 w-full rounded-xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white">BACK TO SIGN IN</button>}
      </section>
    </main>
  );
}
