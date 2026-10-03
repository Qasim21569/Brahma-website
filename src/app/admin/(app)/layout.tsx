import Link from "next/link";
import { requireEditor } from "@/lib/admin/auth";
import { pages } from "@/content/registry";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "../actions";

/** Every admin screen behind sign-in. `requireEditor()` is the real gate. */
export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const { editor } = await requireEditor();

  const groups = [
    {
      title: "Overview",
      items: [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/properties", label: "Properties" },
      ],
    },
    {
      title: "Pages",
      items: pages
        .filter((p) => !["company", "global"].includes(p.key))
        .map((p) => ({ href: `/admin/pages/${p.key}`, label: p.label })),
    },
    {
      title: "Shared",
      items: [
        { href: "/admin/pages/company", label: "Company" },
        { href: "/admin/pages/global", label: "Site settings" },
      ],
    },
    {
      title: "Account",
      items: [
        { href: "/admin/history", label: "History" },
        { href: "/admin/account", label: "Your account" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-outline-variant bg-white/95 px-4 backdrop-blur sm:px-6">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="font-serif text-[20px] leading-none tracking-tight">BRAHMAS</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-azure-dim">
            Editor
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-[13px] font-medium text-muted-azure-dim hover:underline sm:inline"
          >
            View website ↗
          </a>
          <span className="hidden text-[13px] text-mortar-grey lg:inline">{editor.email}</span>
          <form action={signOut}>
            <button className="rounded-md border border-outline-variant px-3 py-1.5 text-[13px] font-medium hover:bg-surface-container-low">
              Sign out
            </button>
          </form>
          <AdminNavMobileSlot groups={groups} />
        </div>
      </header>
      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-6 sm:px-6 md:py-8">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20">
            <AdminNav groups={groups} />
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-24">{children}</main>
      </div>
    </div>
  );
}

function AdminNavMobileSlot({ groups }: { groups: Parameters<typeof AdminNav>[0]["groups"] }) {
  return (
    <div className="md:hidden">
      <AdminNav groups={groups} />
    </div>
  );
}
