'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, FileText } from 'lucide-react';

type Report = { id: string; reference_number: string; category: string; status: string; description: string; location_text?: string | null; created_at: string };
const labels: Record<string,string> = { fire:'Fire', medical:'Medical', accident:'Accident', crime_safety:'Crime / Safety', flood:'Flood', landslide:'Landslide', earthquake:'Earthquake', missing_person:'Missing Person', road_hazard:'Road Hazard', infrastructure_damage:'Infrastructure Damage', electrical_hazard:'Electrical Hazard', environmental:'Environmental', other:'Other' };

export default function ResidentReportsPage() {
  const [reports,setReports]=useState<Report[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{ fetch('/api/incidents',{cache:'no-store'}).then(async r=>{const d=await r.json(); if(!r.ok) throw new Error(d.error??'Unable to load reports.'); setReports(d.incidents??[]);}).catch(e=>setError(e instanceof Error?e.message:'Unable to load reports.')).finally(()=>setLoading(false)); },[]);
  const status=(v:string)=>v.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase());
  return <main className="min-h-screen bg-[#f5f8fc] px-4 py-6 text-[#10233f] sm:px-6">
    <div className="mx-auto max-w-3xl">
      <Link href="/resident" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft className="h-4 w-4"/>Back to home</Link>
      <header className="mt-6 rounded-3xl border border-[#dce6f0] bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">BConnect</p><h1 className="mt-2 text-3xl font-black">My Reports</h1><p className="mt-2 text-sm text-slate-500">Track every incident you submitted to your barangay.</p></header>
      {error&&<div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      {loading?<div className="mt-5 rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">Loading your reports...</div>:!reports.length?<div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><FileText className="mx-auto h-8 w-8 text-slate-400"/><p className="mt-3 font-bold">No reports yet</p><Link href="/resident/report" className="mt-4 inline-flex rounded-xl bg-[#0b66c3] px-4 py-3 text-sm font-bold text-white">Report an incident</Link></div>:<div className="mt-5 space-y-3">{reports.map(r=><Link key={r.id} href={`/resident/reports/${r.id}`} className="flex items-center gap-4 rounded-2xl border border-[#dce6f0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e8f3ff] text-[#0b66c3]"><FileText className="h-5 w-5"/></span><span className="min-w-0 flex-1"><span className="block text-sm font-black">{labels[r.category]??r.category}</span><span className="mt-1 block truncate font-mono text-xs text-slate-500">{r.reference_number}</span><span className="mt-1 block truncate text-xs text-slate-500">{r.location_text??'Location not provided'}</span></span><span className="hidden rounded-full bg-[#e8f3ff] px-3 py-1.5 text-xs font-bold text-[#0b66c3] sm:inline-flex">{status(r.status)}</span><ChevronRight className="h-5 w-5 text-slate-400"/></Link>)}</div>}
    </div>
  </main>;
}
