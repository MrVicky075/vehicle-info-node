"use client";

type SearchFormProps = {
  vehicleNumber: string;
  houseNo: string;
  loading: boolean;
  onVehicleNumberChange: (value: string) => void;
  onHouseNoChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export default function SearchForm({
  vehicleNumber,
  houseNo,
  loading,
  onVehicleNumberChange,
  onHouseNoChange,
  onSearch,
  onClear,
}: SearchFormProps) {
  return (
    <form
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="vehicleNumber"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Enter Vehicle Number
          </label>
          <input
            id="vehicleNumber"
            type="text"
            placeholder="GJ01FA0123 or last 4 digits"
            value={vehicleNumber}
            onChange={(e) => onVehicleNumberChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            maxLength={30}
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="houseNo"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Enter House Number
          </label>
          <input
            id="houseNo"
            type="text"
            placeholder="101"
            value={houseNo}
            onChange={(e) => onHouseNoChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            maxLength={30}
            disabled={loading}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
