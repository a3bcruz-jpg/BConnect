import Link from 'next/link';
import { ROLE_LABELS, BCONNECT_ROLES } from '@/lib/access/roles';

const modules = [
  { title: 'Users & Roles', description: 'Manage residents, responders, officials, and administrators.', href: '/admin/users', tone: 'bg-[#dff5ea]', value: '7 roles' },
  { title: 'Barangays', description: 'Organize users, responders, and incidents by barangay.', href: '/admin/barangays', tone: 'bg-[#dceeff]', value: 'Local scope' },
  { title: 'Incident Operations', description: 'Review the complete verification and response pipeline.', href: '/official', tone: 'bg-[#e9f5ff]', value: 'Live queue' },
  { title: 'Audit & Compliance', description: 'Review operational activity and accountability records.', href: '/admin/audit', tone: 'bg-[#e8f7f1]', value: 'Audit trail' },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#061b19] text-white bc-page-enter">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#0b2924] px-5 py-5 shadow-xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7ec8ff]">BConnect Administration</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Platform Control Center</h1>
            <p className="mt-1 text-sm text-[#a9c9c0]">Manage community structure, access, operations, and accountability.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-[#c7ded7] hover:bg-white/5">Public site</Link>
            <Link href="/official" className="rounded-xl bg-[#0b7bd4] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#086bb9]">Operations</Link>
          </div>
        </header>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Organization', 'Barangay → LGU', 'Scope hierarchy'],
            ['Roles', String(BCONNECT_ROLES.length), 'Access levels'],
            ['Incidents', 'Live', 'Operational queue'],
            ['Accountability', 'Enabled', 'Audit-ready design'],
          ].map(([value, label, caption]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#0b2924] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7ec8ff]">{caption}</p>
              <p className="mt-2 text-2xl font-extrabold">{value}</p>
              <p className="mt-1 text-sm text-[#a9c9c0]">{label}</p>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <div className="mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#31d477]">Administration modules</p>
            <h2 className="mt-1 text-xl font-extrabold">Core platform structure</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <Link key={module.title} href={module.href} className="group rounded-3xl border border-white/10 bg-[#0b2924] p-6 transition hover:-translate-y-0.5 hover:border-[#31d477]/40 hover:bg-[#0e322c]">
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-2xl px-3 py-2 text-xs font-extrabold text-[#07362b] ${module.tone}`}>{module.value}</div>
                  <span className="text-[#7ec8ff] transition group-hover:translate-x-1">→</span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold">{module.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#a9c9c0]">{module.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#0b2924] p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-[#31d477]">Role model</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {BCONNECT_ROLES.map((role) => (
              <div key={role} className="rounded-2xl border border-white/10 bg-[#071f1d] px-4 py-3">
                <p className="text-sm font-bold">{ROLE_LABELS[role]}</p>
                <p className="mt-1 text-xs text-[#a9c9c0]">{role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
