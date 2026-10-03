"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export type NavItem = { href: string; label: string };

export function AdminNav({ groups }: { groups: { title: string; items: NavItem[] }[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);

  const list = (
    <nav aria-label="Editor" className="space-y-6">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-mortar-grey">
            {g.title}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-1.5 text-[14px] transition ${
                    isActive(item.href)
                      ? "bg-primary font-semibold text-on-primary"
                      : "text-primary hover:bg-surface-container"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        className="rounded-md border border-outline-variant bg-white px-3 py-1.5 text-[13px] font-medium md:hidden"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Close menu" : "Menu"}
      </button>
      {open && <div className="fixed inset-x-0 top-14 z-30 max-h-[80vh] overflow-auto border-b border-outline-variant bg-white p-4 shadow-lg md:hidden">{list}</div>}
      <div className="hidden md:block">{list}</div>
    </>
  );
}
