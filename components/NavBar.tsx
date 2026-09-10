"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PEOPLE_BY_ORDER } from "@/lib/config";

export function NavBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const weekQuery = searchParams.get("week");
  const suffix = weekQuery ? `?week=${weekQuery}` : "";

  const isMelissa = pathname === "/";

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-3 py-2 sm:px-6">
        <Link
          href={`/${suffix}`}
          className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            isMelissa
              ? "bg-[var(--color-accent)] text-white"
              : "text-[var(--color-text)] hover:bg-[var(--color-accent-tint)]"
          }`}
        >
          Melissa&rsquo;s View
        </Link>
        <div className="mx-1 h-6 w-px shrink-0 bg-[var(--color-border)]" aria-hidden />
        <nav className="flex items-center gap-1" aria-label="Department tabs">
          {PEOPLE_BY_ORDER.map((p) => {
            const href = `/tabs/${p.slug}${suffix}`;
            const active = pathname === `/tabs/${p.slug}`;
            return (
              <Link
                key={p.slug}
                href={href}
                className={`shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-accent-tint)] hover:text-[var(--color-text)]"
                }`}
                title={p.title}
              >
                {p.name.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
