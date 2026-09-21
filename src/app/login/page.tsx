'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active || !data.user) {
        if (active) setLoading(false);
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('role, is_active').eq('id', data.user.id).maybeSingle();
      if (!active) return;
      if (!profile?.is_active) {
        await supabase.auth.signOut();
        setError('This BConnect account is inactive.');
        setLoading(false);
        return;
      }
      router.replace(profile.role === 'resident' ? '/resident' : profile.role === 'responder' ? '/responder' : '/official');
    });
    return () => { active = false; };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError || !data.user) throw new Error(signInError?.message ?? 'Unable to sign in.');
      const { data: profile, error: profileError } = await supabase.from('profiles').select('role, is_active, barangay_id').eq('id', data.user.id).maybeSingle();
      if (profileError) throw new Error('Unable to verify your BConnect profile.');
      if (!profile?.is_active || !profile.barangay_id) throw new Error('Your account is not linked to an active barangay profile.');
      if (profile.role === 'resident') router.replace('/resident');
      else if (profile.role === 'responder') router.replace('/responder');
      else router.replace('/official');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.');
      setSubmitting(false);
    }
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    setResetSent(false);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'Unable to send password reset email.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4 text-sm text-[#53657a]">Checking your BConnect session…</main>;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8fc] px-4 py-10 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,#dceeff,transparent_68%)]" />
      <div className="relative w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b9d9f7] bg-[#eaf4ff] text-sm font-black tracking-tight text-[#0b66c3] shadow-sm" aria-hidden="true">BC</div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#10233f]">BConnect</p>
          <p className="mt-1 text-sm font-medium text-[#53657a]">Connect. Report. Respond.</p>
        </header>

        <section className="rounded-[1.75rem] border border-[#dce6f0] bg-white p-6 shadow-[0_24px_70px_rgba(16,35,63,0.09)] sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b66c3]">Community safety platform</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#10233f]">{resetMode ? 'Reset your password' : 'Welcome back'}</h1>
            <p className="mt-2 text-sm leading-6 text-[#53657a]">{resetMode ? 'Enter your email and we will send a secure password reset link.' : 'Sign in to report incidents, coordinate response, and help keep your community safe.'}</p>
          </div>

          {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-800">{error}</div>}
          {resetSent && <div role="status" className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-5 text-green-800">If an account exists for this email, a reset link has been sent. Check your inbox and spam folder.</div>}

          {resetMode ? (
            <form onSubmit={handlePasswordReset} className="mt-6 space-y-5">
              <div>
                <label htmlFor="reset-email" className="mb-2 block text-sm font-bold text-[#10233f]">Email address</label>
                <input id="reset-email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition placeholder:text-[#9aaabd] focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
              </div>
              <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#084d91] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'SENDING…' : 'SEND RESET LINK'}</button>
              <button type="button" onClick={() => { setResetMode(false); setError(''); setResetSent(false); }} className="w-full rounded-2xl px-4 py-2 text-sm font-bold text-[#0b66c3] transition hover:bg-[#eaf4ff] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/10">Back to sign in</button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-bold text-[#10233f]">Email address</label>
                  <input id="email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition placeholder:text-[#9aaabd] focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
                </div>
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#10233f]">Password</label>
                  <input id="password" type="password" required autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition placeholder:text-[#9aaabd] focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
                </div>
                <div className="text-right"><button type="button" onClick={() => { setResetMode(true); setError(''); }} className="rounded-lg text-sm font-bold text-[#0b66c3] hover:underline focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/10">Forgot password?</button></div>
                <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#084d91] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'SIGNING IN…' : 'SIGN IN'}</button>
              </form>
              <div className="my-6 flex items-center gap-3" aria-hidden="true"><div className="h-px flex-1 bg-[#dce6f0]" /><span className="text-xs font-semibold uppercase tracking-wider text-[#9aaabd]">New to BConnect?</span><div className="h-px flex-1 bg-[#dce6f0]" /></div>
              <button type="button" onClick={() => router.push('/signup')} className="w-full rounded-2xl border border-[#b9d9f7] bg-[#eaf4ff] px-5 py-3.5 text-sm font-extrabold text-[#0b66c3] transition hover:bg-[#dceeff] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20">CREATE ACCOUNT</button>
            </>
          )}
        </section>
        <p className="mx-auto mt-6 max-w-sm text-center text-xs leading-5 text-[#718096]">For life-threatening emergencies, call 911 immediately. BConnect is not a replacement for emergency services.</p>
      </div>
    </main>
  );
}
