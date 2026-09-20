"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavbarProps = {
  adminEmail?: string | null;
  showAdminLinks?: boolean;
};

export default function Navbar({
  adminEmail,
  showAdminLinks = false,
}: NavbarProps) {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      pathname === href
        ? "bg-slate-800 text-white"
        : "text-slate-200 hover:bg-slate-700"
    }`;

  return (
    <nav className="bg-slate-900 text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Vehicle Information
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          {showAdminLinks ? (
            <>
              <Link href="/admin" className={linkClass("/admin")}>
                Dashboard
              </Link>
              <Link
                href="/admin/vehicles"
                className={linkClass("/admin/vehicles")}
              >
                Vehicles
              </Link>
              {adminEmail && (
                <span className="hidden text-sm text-slate-300 sm:inline">
                  {adminEmail}
                </span>
              )}
            </>
          ) : (
            <Link href="/login" className={linkClass("/login")}>
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
