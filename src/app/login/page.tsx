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
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active || !data.user) {
        if (active) setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', data.user.id)
        .maybeSingle();
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_active, barangay_id')
        .eq('id', data.user.id)
        .maybeSingle();
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

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4 text-sm text-slate-500">Checking your BConnect session…</main>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b66c3] text-2xl font-black text-white shadow-sm">B</div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#10233f]">BConnect</p>
          <p className="mt-1 text-sm text-slate-500">Connect. Report. Respond.</p>
        </div>

        <section className="rounded-3xl border border-[#dce6f0] bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-extrabold text-[#10233f]">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Use your BConnect account to continue.</p>

          {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-slate-700">Email address</label>
              <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold text-slate-700">Password</label>
              <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" />
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white shadow-sm hover:bg-[#084d91] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'SIGNING IN…' : 'SIGN IN'}</button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">For life-threatening emergencies, call 911 immediately. BConnect is not a replacement for emergency services.</p>
      </div>
    </main>
  );
}
