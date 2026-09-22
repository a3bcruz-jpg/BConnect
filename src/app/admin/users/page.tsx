import Link from 'next/link';

export default function AdminModulePage() {
  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Link href="/admin" className="text-sm font-bold text-[#7ec8ff]">← Administration</Link>
        <section className="mt-5 rounded-3xl border border-white/10 bg-[#0b2924] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#31d477]">BConnect Admin</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Users & Roles</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a9c9c0]">Manage the people who participate in BConnect and keep permissions aligned with operational responsibilities.</p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#071f1d] p-5">
            <p className="text-sm font-bold">Production structure</p>
            <p className="mt-2 text-sm leading-6 text-[#a9c9c0]">Access is organized by role and organization scope. Production enforcement should be backed by server-side authorization and reviewed RLS policies.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
