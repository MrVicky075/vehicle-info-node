import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Vehicle, ensureVehicleSearchFields } from "@/models/Vehicle";
import {
  successResponse,
  errorResponse,
  handleApiError,
  maskMobile,
  shouldShowPublicMobile,
} from "@/lib/api";

const MAX_INPUT = 30;
const MAX_RESULTS = 50;

let searchFieldsReady: Promise<void> | null = null;

async function readySearchFields() {
  if (!searchFieldsReady) {
    searchFieldsReady = ensureVehicleSearchFields().catch((error) => {
      searchFieldsReady = null;
      throw error;
    });
  }
  await searchFieldsReady;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await readySearchFields();

    const { searchParams } = request.nextUrl;
    const vehicleNumberRaw = searchParams.get("vehicleNumber");
    const houseNoRaw = searchParams.get("houseNo");

    if (!vehicleNumberRaw && !houseNoRaw) {
      return errorResponse(
        "Provide either vehicleNumber or houseNo search parameter.",
        400
      );
    }

    if (vehicleNumberRaw && houseNoRaw) {
      return errorResponse(
        "Search using either vehicle number or house number, not both.",
        400
      );
    }

    let filter: Record<string, string | RegExp>;

    if (vehicleNumberRaw !== null) {
      // Normalize plate input (spaces/dashes) so index equality still hits
      const vehicleNumber = vehicleNumberRaw
        .trim()
        .toUpperCase()
        .replace(/[\s-]+/g, "");
      if (!vehicleNumber) {
        return errorResponse("Vehicle number is required.", 400);
      }
      if (vehicleNumber.length > MAX_INPUT) {
        return errorResponse("Vehicle number is too long.", 400);
      }

      // Last 1–4 digits → indexed vehicleNumberLast4 (no collection-scan regex)
      // Full plate → exact unique index lookup
      if (/^\d{1,4}$/.test(vehicleNumber)) {
        if (vehicleNumber.length === 4) {
          filter = { vehicleNumberLast4: vehicleNumber };
        } else {
          const escaped = vehicleNumber.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          filter = { vehicleNumberLast4: new RegExp(`${escaped}$`) };
        }
      } else {
        filter = { vehicleNumber };
      }
    } else {
      const houseNo = (houseNoRaw ?? "").trim();
      if (!houseNo) {
        return errorResponse("House number is required.", 400);
      }
      if (houseNo.length > MAX_INPUT) {
        return errorResponse("House number is too long.", 400);
      }
      filter = { houseNo };
    }

    const vehicles = await Vehicle.find(filter)
      .select("vehicleType vehicleNumber blockNo houseNo name mobileNumber -_id")
      .limit(MAX_RESULTS)
      .lean();

    const showMobile = shouldShowPublicMobile();
    const data = vehicles.map((v) => ({
      vehicleType: v.vehicleType,
      vehicleNumber: v.vehicleNumber,
      blockNo: v.blockNo,
      houseNo: v.houseNo,
      name: v.name,
      mobileNumber: showMobile ? v.mobileNumber : maskMobile(v.mobileNumber),
    }));

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
