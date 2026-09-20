"use client";

export type PublicVehicle = {
  vehicleType: string;
  vehicleNumber: string;
  blockNo: string;
  houseNo: string;
  name: string;
  mobileNumber: string;
};

export type AdminVehicle = PublicVehicle & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

type VehicleTableProps = {
  vehicles: Array<PublicVehicle | AdminVehicle>;
  showDates?: boolean;
  showActions?: boolean;
  onEdit?: (vehicle: AdminVehicle) => void;
  onDelete?: (vehicle: AdminVehicle) => void;
};

export default function VehicleTable({
  vehicles,
  showDates = false,
  showActions = false,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-slate-600">
        No vehicle information found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Vehicle Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Vehicle Number
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Block No
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              House No
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Mobile Number
            </th>
            {showDates && (
              <>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Created Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Updated Date
                </th>
              </>
            )}
            {showActions && (
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {vehicles.map((vehicle) => {
            const adminVehicle = vehicle as AdminVehicle;
            const key =
              "_id" in vehicle ? adminVehicle._id : vehicle.vehicleNumber;
            return (
              <tr key={key} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                  {vehicle.vehicleType}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                  {vehicle.vehicleNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                  {vehicle.blockNo}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                  {vehicle.houseNo}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                  {vehicle.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-800">
                  {vehicle.mobileNumber}
                </td>
                {showDates && (
                  <>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {adminVehicle.createdAt
                        ? new Date(adminVehicle.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {adminVehicle.updatedAt
                        ? new Date(adminVehicle.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </>
                )}
                {showActions && (
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(adminVehicle)}
                        className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(adminVehicle)}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
