import Link from 'next/link';

export function BrandWordmark({ href = '/', compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} aria-label="BConnect home" className="inline-flex items-center gap-3">
      <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] text-base font-black text-white shadow-sm">
        B
      </span>
      <span className="leading-none">
        <span className="block text-base font-extrabold tracking-tight text-[var(--foreground)]">BConnect</span>
        {!compact && <span className="mt-1 block text-[11px] font-medium text-[var(--text-secondary)]">Connect. Report. Respond.</span>}
      </span>
    </Link>
  );
}
