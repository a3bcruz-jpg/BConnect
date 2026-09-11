'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const categories = ['Accident', 'Fire', 'Medical', 'Crime / Safety', 'Flood', 'Landslide', 'Earthquake', 'Missing Person', 'Hazard', 'Infrastructure', 'Other'];

export default function ReportIncidentPage() {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [locationReady, setLocationReady] = useState(false);
  const [step, setStep] = useState<'report' | 'review' | 'submitted'>('report');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description.trim()) return;
    setStep('review');
  }

  if (step === 'submitted') return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg pt-8">
        <div className="rounded-3xl border border-[#dce6f0] bg-white p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl font-bold text-emerald-600">✓</div>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0b66c3]">BConnect</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Report submitted</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Your report has been received and is ready for barangay verification.</p>
          <div className="mt-6 rounded-2xl bg-[#f5f8fc] p-4 text-left"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Incident reference</p><p className="mt-1 font-mono text-sm font-bold text-[#10233f]">BC-2026-000125</p></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/resident/reports/BC-2026-000125" className="rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white">Track report</Link><Link href="/resident" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Back home</Link></div>
        </div>
      </div>
    </main>
  );

  if (step === 'review') return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-xl">
        <button onClick={() => setStep('report')} className="text-sm font-bold text-slate-600 hover:text-[#0b66c3]">← Edit report</button>
        <div className="mt-5"><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">Step 2 of 2</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight">Review report</h1><p className="mt-1 text-sm text-slate-600">Check the details before sending them to your barangay.</p></div>
        <section className="mt-6 space-y-3 rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm">
          <div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Incident</p><p className="mt-1 text-sm font-bold">{category || 'To be classified by BConnect'}</p></div>
          <div className="border-t border-slate-100 pt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Description</p><p className="mt-1 text-sm leading-6 text-slate-700">{description}</p></div>
          <div className="border-t border-slate-100 pt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Location</p><p className="mt-1 text-sm font-semibold">{locationReady ? 'Current location captured' : 'Location not captured'}</p></div>
          <div className="border-t border-slate-100 pt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">AI recommendation</p><div className="mt-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Potential priority will be assessed from the incident details. A barangay official makes the final priority decision.</div></div>
        </section>
        <button onClick={() => setStep('submitted')} className="mt-5 w-full rounded-2xl bg-[#0b66c3] px-5 py-4 text-sm font-extrabold text-white shadow-sm hover:bg-[#084d91]">SUBMIT REPORT</button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Link href="/resident" className="text-sm font-bold text-slate-600 hover:text-[#0b66c3]">← Back to home</Link>
        <div className="mt-5"><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">Step 1 of 2</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight">Report an incident</h1><p className="mt-1 text-sm leading-6 text-slate-600">Tell us what happened. BConnect will help organize the important details.</p></div>

        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4"><p className="text-sm font-bold text-red-900">Life-threatening emergency?</p><p className="mt-1 text-xs leading-5 text-red-800">Call 911 immediately. BConnect should not replace emergency services.</p><a href="tel:911" className="mt-3 inline-flex rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Call 911</a></div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <section className="rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><label htmlFor="description" className="text-sm font-extrabold">What happened?</label><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#0b66c3]">AI assisted</span></div>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Example: May aksidente sa highway malapit sa palengke. Mukhang may nasaktan." className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" />
            <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-200">Speak / Voice</button><button type="button" className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 hover:border-blue-200">Take / Add Photo</button></div>
            <p className="mt-3 text-[11px] leading-5 text-slate-500">You can write naturally in Filipino, English, or Taglish. Only collect evidence if it is safe.</p>
          </section>

          <section className="rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm"><label htmlFor="category" className="text-sm font-extrabold">Incident category <span className="font-normal text-slate-400">(optional)</span></label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b66c3]"><option value="">Let BConnect classify it</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></section>

          <section className="rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold">Incident location</p><p className="mt-1 text-xs leading-5 text-slate-500">Use GPS when possible, or describe a nearby landmark.</p></div><button type="button" onClick={() => setLocationReady(true)} className="shrink-0 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-[#0b66c3]">{locationReady ? 'Location ready' : 'Use GPS'}</button></div><div className="mt-3 rounded-2xl bg-slate-50 p-4 text-xs font-medium text-slate-600">{locationReady ? 'Current location captured. You can review it before submitting.' : 'No location captured yet.'}</div></section>

          <button type="submit" disabled={!description.trim()} className="w-full rounded-2xl bg-[#0b66c3] px-5 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#084d91] disabled:cursor-not-allowed disabled:opacity-40">CONTINUE TO REVIEW</button>
        </form>
      </div>
    </main>
  );
}
