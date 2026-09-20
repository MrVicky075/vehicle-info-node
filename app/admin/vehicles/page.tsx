"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import VehicleTable, { type AdminVehicle } from "@/components/VehicleTable";
import VehicleForm, { type VehicleFormData } from "@/components/VehicleForm";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import Loading from "@/components/Loading";
import ToastMessage from "@/components/ToastMessage";
import { ALLOWED_SORT_FIELDS, type SortField } from "@/lib/validation";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function AdminVehiclesPage() {
  const { data: session, status } = useSession();
  const [vehicles, setVehicles] = useState<AdminVehicle[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("vehicleNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editing, setEditing] = useState<AdminVehicle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminVehicle | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        sortBy,
        sortOrder,
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/vehicles?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setToast({
          message: json.message || "Failed to load vehicles.",
          type: "error",
        });
        return;
      }
      setVehicles(json.data);
      setPagination(json.pagination);
    } catch {
      setToast({ message: "Network error loading vehicles.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    if (status !== "authenticated") return;
    // Server fetch for admin listing; loading state is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data load
    void loadVehicles();
  }, [status, loadVehicles]);

  async function handleSave(data: VehicleFormData) {
    setFormLoading(true);
    try {
      const isEdit = !!editing;
      const url = isEdit ? `/api/vehicles/${editing!._id}` : "/api/vehicles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setToast({
          message: json.message || "Save failed.",
          type: "error",
        });
        return;
      }
      setToast({
        message: isEdit
          ? "Vehicle information updated successfully."
          : "Vehicle added successfully.",
        type: "success",
      });
      setFormOpen(false);
      setEditing(null);
      await loadVehicles();
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/vehicles/${deleteTarget._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setToast({
          message: json.message || "Delete failed.",
          type: "error",
        });
        return;
      }
      setToast({
        message: "Vehicle information deleted successfully.",
        type: "success",
      });
      setDeleteTarget(null);
      await loadVehicles();
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setDeleteLoading(false);
    }
  }

  if (status === "loading") {
    return <Loading label="Loading session..." />;
  }

  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1
  ).slice(
    Math.max(0, page - 3),
    Math.max(0, page - 3) + 5
  );

  return (
    <>
      <Navbar adminEmail={session?.user?.email} showAdminLinks />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-slate-900">
            Vehicle Management
          </h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              + Add Vehicle
            </button>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search vehicle, house, block, name, mobile..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortField);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {ALLOWED_SORT_FIELDS.map((field) => (
              <option key={field} value={field}>
                Sort: {field}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as "asc" | "desc");
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Search
          </button>
        </div>

        {loading ? (
          <Loading label="Loading vehicles..." />
        ) : (
          <>
            <VehicleTable
              vehicles={vehicles}
              showDates
              showActions
              onEdit={(v) => {
                setEditing(v);
                setFormOpen(true);
              }}
              onDelete={(v) => setDeleteTarget(v)}
            />

            {pagination.totalPages > 1 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`rounded-md px-3 py-1.5 text-sm ${
                      n === page
                        ? "bg-teal-700 text-white"
                        : "border border-slate-300 bg-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
            <p className="mt-3 text-center text-sm text-slate-500">
              Showing page {pagination.page} of {pagination.totalPages || 1} (
              {pagination.total} total)
            </p>
          </>
        )}
      </main>

      <VehicleForm
        open={formOpen}
        title={editing ? "Edit Vehicle" : "Add Vehicle"}
        initial={editing}
        loading={formLoading}
        onClose={() => {
          if (!formLoading) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
        onSubmit={handleSave}
      />

      <DeleteConfirmModal
        open={!!deleteTarget}
        loading={deleteLoading}
        vehicleNumber={deleteTarget?.vehicleNumber}
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

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
