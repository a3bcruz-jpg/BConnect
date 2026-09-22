'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, ChevronRight, FileText, Home, MapPin, Menu, Phone, Settings, ShieldCheck, UserRound, Users } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Report = { id: string; reference_number: string; category: string; status: string; created_at: string };

const categoryLabels: Record<string, string> = {
  fire: 'Fire', medical: 'Medical', accident: 'Accident', crime_safety: 'Crime / Safety', flood: 'Flood',
  landslide: 'Landslide', earthquake: 'Earthquake', missing_person: 'Missing Person', road_hazard: 'Road Hazard',
  infrastructure_damage: 'Infrastructure Damage', electrical_hazard: 'Electrical Hazard', environmental: 'Environmental', other: 'Other',
};

const navigation = [
  ['Dashboard', '/resident', Home], ['My Reports', '/resident/reports', FileText], ['Map', '#map', MapPin],
  ['Notifications', '/notifications', Bell], ['Community', '#community', Users], ['Profile', '/profile', UserRound], ['Settings', '/profile', Settings],
] as const;

function Brand() {
  return <Link href="/" aria-label="BConnect home" className="flex items-center gap-3">
    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#31d477] to-[#0b7bd4] text-sm font-black text-white shadow-lg shadow-black/20">BC</span>
    <span><span className="block text-xl font-black tracking-tight">B<span className="text-[#31d477]">Connect</span></span><span className="block text-[10px] font-medium text-[#9bc0b6]">Connect. Report. Respond.</span></span>
  </Link>;
}

export default function ResidentPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [name, setName] = useState('Resident');
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const supabase = createSupabaseBrowserClient();
      const [{ data: incidentData }, { data: notificationData }, { data: userData }] = await Promise.all([
        fetch('/api/incidents', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/notifications?unread=true', { cache: 'no-store' }).then((r) => r.json()),
        supabase.auth.getUser(),
      ]);
      if (!active) return;
      setReports(incidentData?.incidents ?? []);
      setUnread((notificationData?.notifications ?? []).length);
      if (userData.user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', userData.user.id).maybeSingle();
        if (profile?.full_name) setName(profile.full_name);
      }
      setLoading(false);
    };
    load().catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const firstName = name.split(' ')[0] || 'Resident';
  const formatStatus = (status: string) => status.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  const formatDate = (value: string) => new Date(value).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

  return <main className="min-h-screen bg-[#031c19] text-white bc-page-enter">
    <div className="flex min-h-screen">
      <aside className="hidden w-[278px] shrink-0 border-r border-white/10 bg-[#05251f] px-5 py-7 lg:flex lg:flex-col">
        <Brand />
        <nav className="mt-12 space-y-2" aria-label="Resident navigation">
          {navigation.map(([label, href, Icon]) => <Link key={label} href={href} className={`group flex min-h-12 items-center gap-4 rounded-2xl px-4 text-sm font-semibold transition ${label === 'Dashboard' ? 'bg-[#075f58] text-white ring-1 ring-[#13cbb1]/70' : 'text-[#b2cec6] hover:bg-white/5 hover:text-white'}`}>
            <Icon className={`h-5 w-5 ${label === 'Dashboard' ? 'text-[#68e9d2]' : 'text-[#c7ded7]'}`} aria-hidden="true" /><span>{label}</span>
            {label === 'Notifications' && unread > 0 && <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-[#31d477] px-1.5 text-[11px] font-black text-[#06251d]">{unread}</span>}
          </Link>)}
        </nav>
        <div className="mt-auto space-y-6">
          <a href="tel:911" className="flex items-center gap-3 rounded-2xl border border-emerald-300/10 bg-[#0a352d] p-4 transition hover:bg-[#0e4238]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#31d477] text-[#06251d]"><Phone className="h-5 w-5" /></span><span><span className="block text-sm font-black">Need help?</span><span className="block text-xs text-[#8fb3a9]">Emergency Hotlines</span></span><ChevronRight className="ml-auto h-4 w-4 text-[#8fb3a9]" /></a>
          <div className="flex items-center gap-3 border-t border-white/10 pt-5"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e9d8bd] to-[#6b9a8d] text-sm font-black text-[#08231f]">{firstName.slice(0,2).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-black">{name}</p><p className="text-xs text-[#8fb3a9]">Resident</p></div></div>
          <p className="px-1 text-[11px] text-[#5e8c81]">BConnect v1.0.0</p>
        </div>
      </aside>

      <section className="min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_70%_0%,rgba(30,173,149,.24),transparent_32rem),linear-gradient(145deg,#06382f_0%,#064d42_42%,#04261f_100%)]">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><div className="lg:hidden"><Brand /></div><button className="ml-auto rounded-xl p-2.5 text-[#b9d7ce] hover:bg-white/10 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button><div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-[#d3e8e1] backdrop-blur lg:flex lg:ml-auto"><span className="h-2 w-2 rounded-full bg-[#31d477]" />{new Date().toLocaleString('en-PH', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</div></header>
        <div className="mx-auto max-w-[1180px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-12">
          <section className="relative overflow-hidden rounded-[2rem] px-2 py-8 sm:px-3 lg:py-12"><div className="pointer-events-none absolute inset-x-0 -top-32 h-72 bg-[radial-gradient(ellipse_at_center,rgba(61,211,177,.25),transparent_68%)]" /><div className="relative"><p className="text-xs font-black uppercase tracking-[.18em] text-[#78d9c2]">Resident dashboard</p><h1 className="mt-3 text-4xl font-black tracking-[-.035em] sm:text-5xl lg:text-6xl">Good morning, {firstName}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#c2ddd6] sm:text-lg">Together for a safer, stronger community.</p><p className="mt-3 max-w-xl text-sm leading-6 text-[#91b8ad]">Report incidents, follow updates, and stay connected with your barangay.</p></div></section>

          <section className="grid gap-4 md:grid-cols-2" aria-label="Primary actions">
            <Link href="/resident/report" className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0877df] to-[#10a7df] p-6 shadow-[0_20px_50px_rgba(0,123,220,.22)] transition hover:-translate-y-1 sm:p-7"><div className="flex items-start justify-between gap-5"><div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><ShieldCheck className="h-6 w-6" /></span><h2 className="mt-8 text-2xl font-black">Report an Incident</h2><p className="mt-2 text-sm text-blue-50">Help keep your community safe.</p></div><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl">→</span></div></Link>
            <a href="tel:911" className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#20d675] to-[#16bd85] p-6 text-[#05251f] shadow-[0_20px_50px_rgba(22,214,117,.18)] transition hover:-translate-y-1 sm:p-7"><div className="flex items-start justify-between gap-5"><div><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#06251d]/10"><Phone className="h-6 w-6" /></span><h2 className="mt-8 text-2xl font-black">Emergency Help</h2><p className="mt-2 text-sm font-medium text-[#07382c]">Quick access to emergency services.</p></div><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#06251d]/10 text-xl">→</span></div></a>
          </section>

          <section className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#062a24]/70 p-4 shadow-2xl backdrop-blur sm:p-6" aria-labelledby="recent-reports-heading">
            <div className="flex items-center justify-between gap-4 px-2 pb-4"><div><h2 id="recent-reports-heading" className="text-xl font-black">Recent Reports</h2><p className="mt-1 text-xs text-[#82aa9f]">Track the latest incidents you submitted.</p></div><Link href="/resident/reports" className="shrink-0 text-sm font-black text-[#31d477] hover:underline">See all →</Link></div>
            {loading ? <div className="space-y-2"><div className="h-20 animate-pulse rounded-2xl bg-white/5" /><div className="h-20 animate-pulse rounded-2xl bg-white/5" /></div> : reports.length === 0 ? <div className="rounded-2xl border border-white/10 bg-[#06251f]/75 p-8 text-center"><p className="text-sm font-bold">No reports yet</p><p className="mt-1 text-xs text-[#91b8ad]">Your submitted incidents will appear here.</p></div> : <div className="space-y-2">{reports.slice(0,4).map((report) => <Link key={report.id} href={`/resident/reports/${report.id}`} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#06251f]/75 p-3.5 transition hover:bg-[#0a342c] sm:gap-4 sm:p-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b7bd4]/20 text-lg font-black text-[#7ec8ff]">!</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-black sm:text-base">{categoryLabels[report.category] ?? report.category}</span><span className="mt-1 block truncate text-xs text-[#91b8ad] sm:text-sm">{report.reference_number} · {formatDate(report.created_at)}</span></span><span className="shrink-0 rounded-full border border-[#167b67] bg-[#0b5a4b] px-3 py-1.5 text-[10px] font-black text-[#55e3a0] sm:text-xs">{formatStatus(report.status)}</span><ChevronRight className="hidden h-5 w-5 shrink-0 text-[#6d9b91] sm:block" /></Link>)}</div>}
          </section>
        </div>
      </section>
    </div>
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#041f1b]/95 px-2 py-2 backdrop-blur lg:hidden"><div className="mx-auto grid max-w-md grid-cols-4 text-center text-[10px] font-bold text-[#7fa99e]"><Link href="/resident" className="rounded-xl py-2 text-[#31d477]"><Home className="mx-auto h-4 w-4" /><span>Home</span></Link><Link href="/resident/reports" className="rounded-xl py-2"><FileText className="mx-auto h-4 w-4" /><span>Reports</span></Link><Link href="/notifications" className="rounded-xl py-2"><Bell className="mx-auto h-4 w-4" /><span>Updates</span></Link><Link href="/profile" className="rounded-xl py-2"><UserRound className="mx-auto h-4 w-4" /><span>Profile</span></Link></div></nav>
  </main>;
}
