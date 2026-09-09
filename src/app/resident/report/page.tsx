'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

const categories = ['Fire', 'Accident', 'Medical', 'Flood', 'Landslide', 'Earthquake', 'Crime / Safety', 'Missing Person', 'Road Hazard', 'Infrastructure', 'Other'];

export default function ReportIncidentPage() {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [locationReady, setLocationReady] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">✓</div>
            <p className="mt-6 text-sm font-semibold text-slate-500">BConnect</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Report submitted</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Your report has been prepared for barangay review. AI analysis and official verification will happen in the connected backend.</p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reference</p>
              <p className="mt-1 font-mono text-sm text-slate-900">BC-DEMO-00124</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/resident" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Back home</Link>
              <Link href="/resident/reports/BC-DEMO-00124" className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800">Track report</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Link href="/resident" className="text-sm font-medium text-slate-600 hover:text-slate-900">← Back</Link>
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-500">BConnect</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Report an incident</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Tell us what happened. Keep it simple. BConnect is designed to help structure the important details.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label htmlFor="description" className="text-sm font-semibold text-slate-900">What happened?</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Example: May aksidente sa highway malapit sa palengke. Mukhang may nasaktan."
              rows={6}
              className="mt-3 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Type naturally in English, Filipino, or Taglish.</span>
              <button type="button" className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-700">Voice</button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label htmlFor="category" className="text-sm font-semibold text-slate-900">Incident category</label>
            <select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-950">
              <option value="">Let BConnect help classify it</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-500">AI classification will be added in the backend phase.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">Incident location</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Location can be captured by GPS or entered manually.</p>
              </div>
              <button type="button" onClick={() => setLocationReady((value) => !value)} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800">{locationReady ? 'Location ready' : 'Use my location'}</button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-700">{locationReady ? 'Demo location captured. Real GPS integration will be connected to the backend.' : 'No location captured yet.'}</div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Evidence</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Photos can help responders, but only collect evidence if it is safe to do so.</p>
            <button type="button" className="mt-4 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800">Add photo</button>
          </section>

          <button type="submit" disabled={!description.trim()} className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40">
            Continue to review
          </button>
        </form>
      </div>
    </main>
  );
}
