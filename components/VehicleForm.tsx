"use client";

import { useState } from "react";
import { VEHICLE_TYPES, type VehicleType } from "@/lib/validation";
import type { AdminVehicle } from "@/components/VehicleTable";

export type VehicleFormData = {
  vehicleType: VehicleType;
  vehicleNumber: string;
  blockNo: string;
  houseNo: string;
  name: string;
  mobileNumber: string;
};

type VehicleFormProps = {
  open: boolean;
  title: string;
  initial?: AdminVehicle | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: VehicleFormData) => Promise<void>;
};

const emptyForm: VehicleFormData = {
  vehicleType: "Car",
  vehicleNumber: "",
  blockNo: "",
  houseNo: "",
  name: "",
  mobileNumber: "",
};

function toFormData(initial?: AdminVehicle | null): VehicleFormData {
  if (!initial) return emptyForm;
  return {
    vehicleType: initial.vehicleType as VehicleType,
    vehicleNumber: initial.vehicleNumber,
    blockNo: initial.blockNo,
    houseNo: initial.houseNo,
    name: initial.name,
    mobileNumber: initial.mobileNumber,
  };
}

function VehicleFormBody({
  title,
  initial,
  loading,
  onClose,
  onSubmit,
}: Omit<VehicleFormProps, "open">) {
  const [form, setForm] = useState<VehicleFormData>(() => toFormData(initial));
  const [error, setError] = useState("");

  function validateClient(data: VehicleFormData): string | null {
    if (!data.vehicleType) return "Vehicle type is required";
    if (!data.vehicleNumber.trim()) return "Vehicle number is required";
    if (!data.blockNo.trim()) return "Block number is required";
    if (!data.houseNo.trim()) return "House number is required";
    if (!data.name.trim()) return "Name is required";
    if (data.name.trim().length > 100) return "Name must be at most 100 characters";
    if (!/^\d{10}$/.test(data.mobileNumber.trim())) {
      return "Mobile number must be exactly 10 digits";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clientError = validateClient(form);
    if (clientError) {
      setError(clientError);
      return;
    }
    setError("");
    await onSubmit({
      ...form,
      vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
      blockNo: form.blockNo.trim(),
      houseNo: form.houseNo.trim(),
      name: form.name.trim(),
      mobileNumber: form.mobileNumber.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-500 hover:text-slate-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 px-5 py-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Vehicle Type
            </label>
            <select
              value={form.vehicleType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  vehicleType: e.target.value as VehicleType,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              disabled={loading}
            >
              {VEHICLE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Vehicle Number
            </label>
            <input
              value={form.vehicleNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, vehicleNumber: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              disabled={loading}
              maxLength={20}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Block Number
              </label>
              <input
                value={form.blockNo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, blockNo: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                disabled={loading}
                maxLength={20}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                House Number
              </label>
              <input
                value={form.houseNo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, houseNo: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                disabled={loading}
                maxLength={20}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              disabled={loading}
              maxLength={100}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Mobile Number
            </label>
            <input
              value={form.mobileNumber}
              onChange={(e) =>
                setForm((f) => ({ ...f, mobileNumber: e.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              disabled={loading}
              maxLength={10}
              inputMode="numeric"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VehicleForm({
  open,
  title,
  initial,
  loading,
  onClose,
  onSubmit,
}: VehicleFormProps) {
  if (!open) return null;

  return (
    <VehicleFormBody
      key={initial?._id ?? "new"}
      title={title}
      initial={initial}
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
