'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const categories = [
  ['fire', 'Fire'], ['medical', 'Medical'], ['accident', 'Accident'], ['crime_safety', 'Crime / Safety'],
  ['flood', 'Flood'], ['landslide', 'Landslide'], ['earthquake', 'Earthquake'], ['missing_person', 'Missing Person'],
  ['road_hazard', 'Road Hazard'], ['infrastructure_damage', 'Infrastructure Damage'], ['electrical_hazard', 'Electrical Hazard'],
  ['environmental', 'Environmental'], ['other', 'Other'],
] as const;

type LocationState = { latitude: number; longitude: number; accuracyMeters?: number };
type CreatedIncident = { id: string; reference_number: string; status: string; created_at: string };

export default function ReportIncidentPage() {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<LocationState | null>(null);
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [locationMessage, setLocationMessage] = useState('No location captured yet.');
  const [step, setStep] = useState<'report' | 'review'>('report');
  const [submitted, setSubmitted] = useState<CreatedIncident | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationState('error');
      setLocationMessage('GPS is not supported by this browser. You can continue without GPS.');
      return;
    }
    setLocationState('loading');
    setLocationMessage('Requesting your current location…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: Number(position.coords.latitude.toFixed(7)),
          longitude: Number(position.coords.longitude.toFixed(7)),
          accuracyMeters: Math.round(position.coords.accuracy),
        };
        setLocation(nextLocation);
        setLocationState('ready');
        setLocationMessage(`Location captured with approximately ${nextLocation.accuracyMeters} m accuracy.`);
      },
      (positionError) => {
        setLocationState('error');
        setLocationMessage(positionError.code === positionError.PERMISSION_DENIED ? 'Location permission was denied. You can continue without GPS.' : 'We could not get your location. You can continue without GPS.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }

  function handleReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (description.trim().length < 5) return;
    setError('');
    setStep('review');
  }

  async function submitReport() {
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim(), ...(category ? { category } : {}), ...(location ? { location } : {}) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = Array.isArray(payload.details) ? ` ${payload.details.join(' ')}` : '';
        throw new Error((payload.error ?? 'Unable to submit your report.') + detail);
      }
      setSubmitted(payload.incident);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-8 sm:px-6"><div className="mx-auto max-w-lg pt-8"><div className="rounded-3xl border border-[#dce6f0] bg-white p-7 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl font-bold text-emerald-600">✓</div>
      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#0b66c3]">BConnect</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight">Report submitted</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Your report has been received and is now available for barangay verification.</p>
      <div className="mt-6 rounded-2xl bg-[#f5f8fc] p-4 text-left"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Incident reference</p><p className="mt-1 font-mono text-sm font-bold text-[#10233f]">{submitted.reference_number}</p><p className="mt-2 text-xs text-slate-500">Status: {submitted.status.replaceAll('_', ' ')}</p></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href={`/resident/reports/${submitted.id}`} className="rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white">Track report</Link><Link href="/resident" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">Back home</Link></div>
    </div></div></main>
  );

  if (step === 'review') return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-5 sm:px-6"><div className="mx-auto max-w-xl">
      <button onClick={() => setStep('report')} className="text-sm font-bold text-slate-600 hover:text-[#0b66c3]">← Edit report</button>
      <div className="mt-5"><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">Step 2 of 2</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight">Review report</h1><p className="mt-1 text-sm text-slate-600">Check the details before sending them to your barangay.</p></div>
      <section className="mt-6 space-y-3 rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm">
        <div><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Incident</p><p className="mt-1 text-sm font-bold">{category ? categories.find(([value]) => value === category)?.[1] : 'To be classified by BConnect'}</p></div>
        <div className="border-t border-slate-100 pt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Description</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{description}</p></div>
        <div className="border-t border-slate-100 pt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Location</p><p className="mt-1 text-sm font-semibold">{location ? `GPS captured · ±${location.accuracyMeters ?? 'unknown'} m accuracy` : 'Location not captured'}</p></div>
        <div className="border-t border-slate-100 pt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">AI decision support</p><div className="mt-2 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-900">BConnect can assist with classification and priority assessment. An authorized barangay official makes the final decision.</div></div>
      </section>
      {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
      <button onClick={submitReport} disabled={submitting} className="mt-5 w-full rounded-2xl bg-[#0b66c3] px-5 py-4 text-sm font-extrabold text-white shadow-sm hover:bg-[#084d91] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'SUBMITTING…' : 'SUBMIT REPORT'}</button>
    </div></main>
  );

  return (
    <main className="min-h-screen bg-[#f5f8fc] px-4 py-5 sm:px-6"><div className="mx-auto max-w-xl">
      <Link href="/resident" className="text-sm font-bold text-slate-600 hover:text-[#0b66c3]">← Back to home</Link>
      <div className="mt-5"><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">Step 1 of 2</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight">Report an incident</h1><p className="mt-1 text-sm leading-6 text-slate-600">Tell us what happened. BConnect will help organize the important details.</p></div>
      <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4"><p className="text-sm font-bold text-red-900">Life-threatening emergency?</p><p className="mt-1 text-xs leading-5 text-red-800">Call 911 immediately. BConnect should not replace emergency services.</p><a href="tel:911" className="mt-3 inline-flex rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white">Call 911</a></div>
      <form onSubmit={handleReview} className="mt-5 space-y-4">
        <section className="rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><label htmlFor="description" className="text-sm font-extrabold">What happened?</label><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#0b66c3]">AI assisted</span></div><textarea id="description" required minLength={5} maxLength={4000} value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Example: May aksidente sa highway malapit sa palengke. Mukhang may nasaktan." className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#0b66c3] focus:bg-white focus:ring-4 focus:ring-blue-50" /><div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>Write naturally in Filipino, English, or Taglish.</span><span>{description.length}/4000</span></div></section>
        <section className="rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm"><label htmlFor="category" className="text-sm font-extrabold">Incident category <span className="font-normal text-slate-400">(optional)</span></label><select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0b66c3]"><option value="">Let BConnect classify it</option>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></section>
        <section className="rounded-3xl border border-[#dce6f0] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-extrabold">Incident location</p><p className="mt-1 text-xs leading-5 text-slate-500">Use GPS when possible. Only share your location when safe.</p></div><button type="button" onClick={captureLocation} disabled={locationState === 'loading'} className="shrink-0 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-[#0b66c3] disabled:opacity-50">{locationState === 'loading' ? 'Locating…' : locationState === 'ready' ? 'Refresh GPS' : 'Use GPS'}</button></div><div className={`mt-3 rounded-2xl p-4 text-xs font-medium ${locationState === 'ready' ? 'bg-emerald-50 text-emerald-800' : locationState === 'error' ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-600'}`}>{locationMessage}</div></section>
        <button type="submit" disabled={description.trim().length < 5} className="w-full rounded-2xl bg-[#0b66c3] px-5 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#084d91] disabled:cursor-not-allowed disabled:opacity-40">CONTINUE TO REVIEW</button>
      </form>
    </div></main>
  );
}
