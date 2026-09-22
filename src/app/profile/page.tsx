'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, LogOut, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Profile = { full_name: string; email: string | null; phone: string | null; role: string; is_active: boolean; barangays?: { name?: string; municipality?: string; province?: string } | null };

export default function ProfilePage() {
  const router=useRouter();
  const [profile,setProfile]=useState<Profile|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{ const load=async()=>{const supabase=createSupabaseBrowserClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user){router.replace('/login');return;} const {data,error:profileError}=await supabase.from('profiles').select('full_name,email,phone,role,is_active,barangays(name,municipality,province)').eq('id',user.id).maybeSingle(); if(profileError) throw profileError; setProfile(data as Profile); setLoading(false);}; load().catch(e=>{setError(e instanceof Error?e.message:'Unable to load profile.');setLoading(false);});},[router]);
  async function signOut(){const supabase=createSupabaseBrowserClient();await supabase.auth.signOut();router.replace('/login');}
  return <main className="min-h-screen bg-[#f5f8fc] px-4 py-6 text-[#10233f] sm:px-6"><div className="mx-auto max-w-2xl"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft className="h-4 w-4"/>Back</Link><section className="mt-6 rounded-3xl border border-[#dce6f0] bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-4"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#e8f3ff] text-[#0b66c3]"><UserRound className="h-7 w-7"/></span><div><p className="text-xs font-bold uppercase tracking-widest text-[#0b66c3]">BConnect Profile</p><h1 className="mt-1 text-2xl font-black">{profile?.full_name??'Your profile'}</h1></div></div>{loading?<p className="mt-8 text-sm text-slate-500">Loading profile...</p>:error?<p className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>:profile&&<div className="mt-8 grid gap-3 sm:grid-cols-2">{[['Email',profile.email??'Not provided'],['Phone',profile.phone??'Not provided'],['Role',profile.role.replaceAll('_',' ')],['Status',profile.is_active?'Active':'Inactive'],['Barangay',profile.barangays?.name??'Not assigned'],['Municipality',profile.barangays?.municipality??'Not assigned']].map(([label,value])=><div key={label} className="rounded-2xl bg-[#f5f8fc] p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-sm font-bold capitalize">{value}</p></div>)}</div>}<button onClick={signOut} className="mt-8 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"><LogOut className="h-4 w-4"/>Sign out</button></section></div></main>;
}
