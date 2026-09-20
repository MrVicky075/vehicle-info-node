import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { Vehicle } from "@/models/Vehicle";
import {
  vehicleSchema,
  parseSortField,
  parseSortOrder,
} from "@/lib/validation";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
    const limit = 20;
    const search = (searchParams.get("search") ?? "").trim();
    const sortField = parseSortField(searchParams.get("sortBy"));
    const sortOrder = parseSortOrder(searchParams.get("sortOrder"));

    const filter: Record<string, unknown> = {};
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [
        { vehicleNumber: regex },
        { houseNo: regex },
        { blockNo: regex },
        { name: regex },
        { mobileNumber: regex },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Vehicle.find(filter)
        .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Vehicle.countDocuments(filter),
    ]);

    return successResponse(data, 200, {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const parsed = vehicleSchema.parse(body);

    const existing = await Vehicle.findOne({
      vehicleNumber: parsed.vehicleNumber,
    }).lean();
    if (existing) {
      return errorResponse("Vehicle number already exists.", 409);
    }

    const vehicle = await Vehicle.create(parsed);
    return successResponse(vehicle, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
