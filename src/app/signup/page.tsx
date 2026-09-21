'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!fullName.trim()) return setError('Please enter your full name.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');

    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (signupError) throw signupError;

      if (data.session) {
        router.replace('/login');
        return;
      }

      setMessage('Account created. Check your email to confirm your account, then sign in.');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Unable to create your account.');
    } finally {
      setSubmitting(false);
    }
  }

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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b66c3]">Join your community</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#10233f]">Create your account</h1>
            <p className="mt-2 text-sm leading-6 text-[#53657a]">Register for BConnect to report incidents and stay connected with your community.</p>
          </div>

          {error && <div role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-800">{error}</div>}
          {message && <div role="status" className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold leading-5 text-green-800">{message}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="full-name" className="mb-2 block text-sm font-bold text-[#10233f]">Full name</label>
              <input id="full-name" type="text" required autoComplete="name" placeholder="Juan Dela Cruz" value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition placeholder:text-[#9aaabd] focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
            </div>
            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-bold text-[#10233f]">Email address</label>
              <input id="signup-email" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition placeholder:text-[#9aaabd] focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
            </div>
            <div>
              <label htmlFor="signup-password" className="mb-2 block text-sm font-bold text-[#10233f]">Password</label>
              <input id="signup-password" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition placeholder:text-[#9aaabd] focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-sm font-bold text-[#10233f]">Confirm password</label>
              <input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-4 py-3.5 text-sm text-[#10233f] outline-none transition placeholder:text-[#9aaabd] focus:border-[#0b66c3] focus:ring-4 focus:ring-[#0b66c3]/10" />
            </div>
            <p className="text-xs leading-5 text-[#718096]">Use at least 8 characters and avoid reusing a password from another service.</p>
            <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#084d91] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}</button>
          </form>

          <div className="my-6 flex items-center gap-3" aria-hidden="true"><div className="h-px flex-1 bg-[#dce6f0]" /><span className="text-xs font-semibold uppercase tracking-wider text-[#9aaabd]">Already registered?</span><div className="h-px flex-1 bg-[#dce6f0]" /></div>
          <button type="button" onClick={() => router.push('/login')} className="w-full rounded-2xl border border-[#c4d2e0] bg-white px-5 py-3.5 text-sm font-extrabold text-[#10233f] transition hover:bg-[#f5f8fc] focus:outline-none focus:ring-4 focus:ring-[#0b66c3]/20">BACK TO SIGN IN</button>
        </section>
      </div>
    </main>
  );
}
