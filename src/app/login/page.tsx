'use client';

import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
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
      if (!active || !data.user) { if (active) setLoading(false); return; }
      const { data: profile } = await supabase.from('profiles').select('role, is_active').eq('id', data.user.id).maybeSingle();
      if (!active) return;
      if (!profile?.is_active) { await supabase.auth.signOut(); setError('This BConnect account is inactive.'); setLoading(false); return; }
      router.replace(profile.role === 'resident' ? '/resident' : profile.role === 'responder' ? '/responder' : '/official');
    });
    return () => { active = false; };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError('');
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError || !data.user) throw new Error(signInError?.message ?? 'Unable to sign in.');
      const { data: profile, error: profileError } = await supabase.from('profiles').select('role, is_active, barangay_id').eq('id', data.user.id).maybeSingle();
      if (profileError) throw new Error('Unable to verify your BConnect profile.');
      if (!profile?.is_active || !profile.barangay_id) throw new Error('Your account is not linked to an active barangay profile.');
      if (profile.role === 'resident') router.replace('/resident'); else if (profile.role === 'responder') router.replace('/responder'); else router.replace('/official');
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Unable to sign in.'); setSubmitting(false); }
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError(''); setResetSent(false);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/auth/reset-password` });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (resetError) { setError(resetError instanceof Error ? resetError.message : 'Unable to send password reset email.'); }
    finally { setSubmitting(false); }
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#061b19] px-4 text-sm text-[#a9c9c0] bc-page-enter">Checking your BConnect session…</main>;

  return (
    <main className="min-h-screen bg-[#061b19] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-[#041c1a] via-[#075346] to-[#0b66c3] p-10 lg:flex lg:flex-col lg:justify-between lg:p-14">
          <div aria-hidden="true" className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-emerald-300/15 blur-3xl" />
          <div aria-hidden="true" className="absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="relative"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#31d477] to-[#0b7bd4] text-sm font-black">BC</span><div><p className="text-xl font-black">B<span className="text-[#31d477]">Connect</span></p><p className="text-xs text-[#9ec2b7]">Connect. Report. Respond.</p></div></div><div className="mt-20 max-w-xl"><p className="text-xs font-black uppercase tracking-[.18em] text-[#82eeb5]">Community safety platform</p><h1 className="mt-5 text-6xl font-black leading-[.95] tracking-[-.04em]">A safer<br/><span className="text-[#31d477]">stronger</span><br/>community.</h1><p className="mt-7 text-lg leading-8 text-[#b8d4cc]">One connected space for residents, responders, and barangay officials to report, coordinate, and respond.</p></div></div>
          <div className="relative grid grid-cols-3 gap-3 text-xs font-bold text-[#c4ded6]"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck className="h-5 w-5 text-[#31d477]"/><p className="mt-3">Safety first</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><CheckCircle2 className="h-5 w-5 text-[#7ec8ff]"/><p className="mt-3">Verified flow</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ArrowRight className="h-5 w-5 text-[#31d477]"/><p className="mt-3">Fast response</p></div></div>
        </section>

        <section className="flex items-center justify-center bg-[#f2fff9] px-4 py-10 text-[#10233f] sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-7 lg:hidden"><p className="text-2xl font-black">B<span className="text-[#1d9b68]">Connect</span></p><p className="text-sm text-[#53657a]">Connect. Report. Respond.</p></div>
            <div className="rounded-[2rem] border border-[#cfe9dd] bg-white p-6 shadow-[0_24px_80px_rgba(16,35,63,.10)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#0b66c3]">Community safety platform</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">{resetMode ? 'Reset your password' : 'Welcome back'}</h1>
              <p className="mt-2 text-sm leading-6 text-[#53657a]">{resetMode ? 'Enter your email and we will send a secure password reset link.' : 'Sign in to report incidents, coordinate response, and help keep your community safe.'}</p>
              {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-800">{error}</div>}
              {resetSent && <div role="status" className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-5 text-green-800">If an account exists for this email, a reset link has been sent. Check your inbox and spam folder.</div>}
              {resetMode ? (
                <form onSubmit={handlePasswordReset} className="mt-6 space-y-5">
                  <div><label htmlFor="reset-email" className="mb-2 block text-sm font-bold">Email address</label><input id="reset-email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(event)=>setEmail(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10"/></div>
                  <button type="submit" disabled={submitting} className="bc-blue-action w-full rounded-full px-5 py-3.5 text-sm font-black transition disabled:opacity-50">{submitting ? 'SENDING…' : 'SEND RESET LINK'}</button>
                  <button type="button" onClick={()=>{setResetMode(false);setError('');setResetSent(false)}} className="w-full rounded-full px-4 py-2 text-sm font-bold text-[#0b66c3] hover:bg-[#e8f3ff]">Back to sign in</button>
                </form>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div><label htmlFor="email" className="mb-2 block text-sm font-bold">Email address</label><input id="email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(event)=>setEmail(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10"/></div>
                    <div><label htmlFor="password" className="mb-2 block text-sm font-bold">Password</label><input id="password" type="password" required autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event)=>setPassword(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10"/></div>
                    <div className="text-right"><button type="button" onClick={()=>{setResetMode(true);setError('')}} className="text-sm font-bold text-[#0b66c3] hover:underline">Forgot password?</button></div>
                    <button type="submit" disabled={submitting} className="bc-blue-action w-full rounded-full px-5 py-3.5 text-sm font-black shadow-sm disabled:opacity-50">{submitting ? 'SIGNING IN…' : 'SIGN IN'}</button>
                  </form>
                  <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-[#dce6f0]"/><span className="text-[10px] font-black uppercase tracking-wider text-[#9aaabd]">New to BConnect?</span><div className="h-px flex-1 bg-[#dce6f0]"/></div>
                  <button type="button" onClick={()=>router.push('/signup')} className="w-full rounded-full border border-[#b9d9f7] bg-[#e8f3ff] px-5 py-3.5 text-sm font-black text-[#0b66c3] transition hover:bg-[#dceeff]">CREATE ACCOUNT</button>
                </>
              )}
            </div>
            <p className="mx-auto mt-5 max-w-sm text-center text-xs leading-5 text-[#718096]">For life-threatening emergencies, call 911 immediately. BConnect is not a replacement for emergency services.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
