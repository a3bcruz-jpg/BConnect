import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Siren, Users, Zap } from 'lucide-react';

const features = [
  { icon: Siren, title: 'Report in seconds', description: 'Submit clear incident details and location information without navigating a complicated process.' },
  { icon: ShieldCheck, title: 'Verified response', description: 'Authorized barangay teams can verify, assign, respond, and keep residents informed.' },
  { icon: MapPin, title: 'Connected operations', description: 'Bring incidents, locations, responders, and status updates into one coordinated workspace.' },
];

const workflow = ['Report', 'Verify', 'Assign', 'Respond', 'Resolve'];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061b19] text-white bc-page-enter">
      <section className="relative bc-brand-shell">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
          <header className="flex items-center justify-between gap-6">
            <Link href="/" aria-label="BConnect home" className="flex items-center gap-3">
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d9b68] to-[#0b7bd4] text-sm font-black text-white shadow-lg shadow-emerald-950/30">BC</span>
              <span><span className="block text-lg font-black tracking-tight">B<span className="text-[#31d477]">Connect</span></span><span className="block text-[11px] font-medium text-[#a9c9c0]">Connect. Report. Respond.</span></span>
            </Link>
            <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/20">Sign in</Link>
          </header>

          <div className="grid gap-12 pt-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:pt-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#8ff0bc]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#31d477]" /> Community safety platform
              </div>
              <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl">A safer<br /><span className="text-[#31d477]">stronger</span><br />community.</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#b8d1ca] sm:text-lg">Report incidents. Get help. Build a safer community together with a connected barangay response workflow.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="bc-green-action inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-black shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-300/30">Get started <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <a href="#features" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm font-bold text-white transition hover:bg-white/10">Explore BConnect</a>
              </div>
              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                {[['People', Users], ['Safety', ShieldCheck], ['Response', Zap]].map(([label, Icon]) => { const I = Icon as typeof Users; return <div key={label as string} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-bold text-[#c8e2d9]"><I className="h-4 w-4 text-[#31d477]" aria-hidden="true" />{label as string}</div>; })}
              </div>
              <p className="mt-5 max-w-lg text-xs leading-5 text-[#7fa99e]">For life-threatening emergencies, contact your local emergency services directly.</p>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-emerald-400/10 blur-3xl" aria-hidden="true" />
              <div className="relative grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#08231f] p-4 shadow-2xl shadow-black/30">
                  <div className="rounded-[1.5rem] bg-[#0c332c] p-4">
                    <div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#77a99b]">Resident dashboard</p><p className="mt-1 text-lg font-black">Good morning, Juan</p></div><div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#31d477] to-[#0b7bd4]" /></div>
                    <div className="mt-4 rounded-2xl bg-[#102f2a] p-3"><div className="h-2 w-24 rounded-full bg-white/10" /><div className="mt-2 h-2 w-36 rounded-full bg-white/5" /><div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#0b7bd4] p-3"><Siren className="h-4 w-4" /><p className="mt-4 text-xs font-bold">Report incident</p></div><div className="rounded-xl bg-[#31d477] p-3 text-[#06251d]"><ShieldCheck className="h-4 w-4" /><p className="mt-4 text-xs font-bold">Emergency help</p></div></div></div>
                    <div className="mt-3 space-y-2">{['Road obstruction','Streetlight not working','Flooded road'].map((item, i) => <div key={item} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[.03] px-3 py-3"><span className="text-xs font-semibold text-[#d2e6df]">{item}</span><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${i === 0 ? 'bg-emerald-400/15 text-[#72e7aa]' : 'bg-blue-400/15 text-[#7ec8ff]'}`}>{i === 0 ? 'In progress' : 'Received'}</span></div>)}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="rounded-[2rem] border border-white/10 bg-[#effff8] p-4 text-[#10233f] shadow-2xl">
                    <div className="flex items-center justify-between"><span className="rounded-full bg-[#d9f8e7] px-3 py-1 text-[10px] font-extrabold text-[#13734d]">Live response</span><span className="text-[10px] font-bold text-[#718096]">10:24 AM</span></div>
                    <div className="mt-5 flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_center,#4ac8ff_0_4%,transparent_5%),linear-gradient(145deg,#123d43,#1a5f4f)]"><div className="h-20 w-20 rounded-full border-8 border-blue-300/30 bg-blue-400/30 p-5 shadow-[0_0_60px_rgba(74,200,255,.35)]"><MapPin className="h-full w-full text-white" /></div></div>
                    <p className="mt-4 text-sm font-black">Road Obstruction</p><p className="mt-1 text-xs text-[#53657a]">Brgy. Dela Paz · High priority</p>
                    <button className="mt-4 w-full rounded-full bg-[#0b7bd4] py-3 text-xs font-black text-white">View details →</button>
                  </div>
                  <div className="rounded-[2rem] border border-emerald-200/20 bg-[#0d3b31] p-5"><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#74e5aa]">Response workflow</p><div className="mt-4 flex items-center justify-between gap-1">{workflow.map((step,i)=><div key={step} className="flex flex-1 flex-col items-center gap-2"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black ${i < 3 ? 'bg-[#31d477] text-[#06251d]' : 'bg-white/10 text-white'}`}>{i+1}</span><span className="text-[9px] font-bold text-[#c0dcd4]">{step}</span></div>)}</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-[#f2fff9] px-5 py-16 text-[#10233f] sm:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[.16em] text-[#0b66c3]">Built for coordinated response</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Simple for residents. Structured for response teams.</h2></div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">{features.map(({icon:Icon,title,description})=><article key={title} className="rounded-[1.5rem] border border-[#cfe9dd] bg-white p-6 shadow-[0_14px_36px_rgba(16,35,63,.06)]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f8eb] text-[#1d9b68]"><Icon className="h-5 w-5" aria-hidden="true"/></div><h3 className="mt-5 text-base font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[#53657a]">{description}</p></article>)}</div>
        </div>
      </section>
    </main>
  );
}
