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
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

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
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b66c3] text-2xl font-black text-white shadow-sm">B</div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#10233f]">BConnect</p>
          <p className="mt-1 text-sm text-slate-500">Create your account</p>
        </div>

        <section className="rounded-3xl border border-[#dce6f0] bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-extrabold text-[#10233f]">Sign up</h1>
          <p className="mt-1 text-sm text-slate-500">Register for a BConnect account.</p>

          {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
          {message && <div role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">{message}</div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div><label htmlFor="full-name" className="text-sm font-bold text-slate-700">Full name</label><input id="full-name" type="text" required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" /></div>
            <div><label htmlFor="signup-email" className="text-sm font-bold text-slate-700">Email address</label><input id="signup-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" /></div>
            <div><label htmlFor="signup-password" className="text-sm font-bold text-slate-700">Password</label><input id="signup-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" /></div>
            <div><label htmlFor="confirm-password" className="text-sm font-bold text-slate-700">Confirm password</label><input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" /></div>
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#0b66c3] px-5 py-3.5 text-sm font-extrabold text-white shadow-sm hover:bg-[#084d91] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT'}</button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <button type="button" onClick={() => router.push('/login')} className="font-bold text-[#0b66c3] hover:underline">Sign in</button></p>
        </section>
      </div>
    </main>
  );
}
