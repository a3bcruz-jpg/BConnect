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
    setError('');
    setMessage('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) setError(updateError.message);
    else setMessage('Password updated successfully. You can now sign in.');
    setSaving(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-[#dce6f0] bg-white p-6 shadow-[0_20px_60px_rgba(16,35,63,0.08)] sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4ff] text-sm font-black text-[#0b66c3]" aria-hidden="true">BC</div>
          <div>
            <p className="text-base font-extrabold tracking-tight text-[#10233f]">BConnect</p>
            <p className="text-xs font-medium text-[#718096]">Connect. Report. Respond.</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b66c3]">Account security</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#10233f]">Create a new password</h1>
          <p className="mt-2 text-sm leading-6 text-[#53657a]">Choose a strong password to keep your BConnect account secure.</p>
        </div>

        {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-800">{error}</div>}
        {message && <div role="status" className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-5 text-green-800">{message}</div>}

        {ready && !message && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-bold text-[#10233f]">New password</label>
              <input id="new-password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-bold text-[#10233f]">Confirm new password</label>
              <input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
            </div>
            <p className="text-xs leading-5 text-[#718096]">Use at least 8 characters. Avoid passwords you use on other websites.</p>
            <button type="submit" disabled={saving} className="w-full rounded-2xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#084d91] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'UPDATING…' : 'UPDATE PASSWORD'}</button>
          </form>
        )}

        {message && <button onClick={() => router.replace('/login')} className="mt-5 w-full rounded-2xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#084d91] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20">BACK TO SIGN IN</button>}
        {!ready && !message && <button onClick={() => router.replace('/login')} className="mt-5 w-full rounded-2xl border border-[#c4d2e0] bg-white px-5 py-3.5 text-sm font-extrabold text-[#10233f] transition hover:bg-[#f5f8fc] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20">RETURN TO SIGN IN</button>}
      </section>
    </main>
  );
}
