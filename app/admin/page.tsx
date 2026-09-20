"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import ToastMessage from "@/components/ToastMessage";

type Stats = {
  total: number;
  cars: number;
  bikes: number;
  other: number;
};

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const json = await res.json();
        if (!res.ok || !json.success) {
          setToast({
            message: json.message || "Failed to load dashboard stats.",
            type: "error",
          });
          return;
        }
        setStats(json.data);
      } catch {
        setToast({ message: "Network error loading stats.", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    if (status === "authenticated") {
      loadStats();
    }
  }, [status]);

  async function handleLogout() {
    await signOut({ callbackUrl: "/" });
  }

  if (status === "loading") {
    return <Loading label="Loading session..." />;
  }

  const cards = [
    { label: "Total Vehicles", value: stats?.total ?? 0 },
    { label: "Cars", value: stats?.cars ?? 0 },
    { label: "Bikes", value: stats?.bikes ?? 0 },
    { label: "Other", value: stats?.other ?? 0 },
  ];

  return (
    <>
      <Navbar adminEmail={session?.user?.email} showAdminLinks />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Vehicle Information - Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Admin Email: {session?.user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/vehicles"
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              Manage Vehicles
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <Loading label="Loading dashboard..." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
