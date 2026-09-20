"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchForm from "@/components/SearchForm";
import VehicleTable, { type PublicVehicle } from "@/components/VehicleTable";
import Loading from "@/components/Loading";
import ToastMessage from "@/components/ToastMessage";

export default function HomePage() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [results, setResults] = useState<PublicVehicle[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  async function handleSearch() {
    const vn = vehicleNumber.trim();
    const hn = houseNo.trim();

    if (!vn && !hn) {
      setToast({
        message: "Enter a vehicle number or house number to search.",
        type: "error",
      });
      return;
    }

    if (vn && hn) {
      setToast({
        message: "Search using either vehicle number or house number.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    setResults(null);
    try {
      const params = new URLSearchParams();
      if (vn) params.set("vehicleNumber", vn);
      if (hn) params.set("houseNo", hn);

      const res = await fetch(`/api/vehicles/search?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setToast({
          message: json.message || "Search failed.",
          type: "error",
        });
        setResults([]);
        return;
      }
      setResults(json.data);
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setVehicleNumber("");
    setHouseNo("");
    setResults(null);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900">
            Vehicle Information Search
          </h1>
          <p className="mt-2 text-slate-600">
            Search residential vehicle records by vehicle number or house number.
          </p>
        </div>

        <SearchForm
          vehicleNumber={vehicleNumber}
          houseNo={houseNo}
          loading={loading}
          onVehicleNumberChange={setVehicleNumber}
          onHouseNoChange={setHouseNo}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <div className="mt-6">
          {loading && <Loading label="Searching vehicles..." />}
          {!loading && results !== null && <VehicleTable vehicles={results} />}
        </div>
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
