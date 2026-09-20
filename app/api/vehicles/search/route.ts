import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Vehicle } from "@/models/Vehicle";
import {
  successResponse,
  errorResponse,
  handleApiError,
  maskMobile,
  shouldShowPublicMobile,
} from "@/lib/api";

const MAX_INPUT = 30;

export async function GET(request: NextRequest) {
  try {
    await connectDB();

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

    let filter: Record<string, string>;

    if (vehicleNumberRaw !== null) {
      const vehicleNumber = vehicleNumberRaw.trim().toUpperCase();
      if (!vehicleNumber) {
        return errorResponse("Vehicle number is required.", 400);
      }
      if (vehicleNumber.length > MAX_INPUT) {
        return errorResponse("Vehicle number is too long.", 400);
      }
      filter = { vehicleNumber };
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
