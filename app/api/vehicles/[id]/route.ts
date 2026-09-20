import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { Vehicle } from "@/models/Vehicle";
import { vehicleSchema } from "@/lib/validation";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api";

type RouteContext = { params: Promise<{ id: string }> };

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;
    if (!isValidObjectId(id)) {
      return errorResponse("Invalid vehicle ID.", 400);
    }

    const vehicle = await Vehicle.findById(id).lean();
    if (!vehicle) {
      return errorResponse("Vehicle not found.", 404);
    }

    return successResponse(vehicle);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;
    if (!isValidObjectId(id)) {
      return errorResponse("Invalid vehicle ID.", 400);
    }

    const body = await request.json();
    const parsed = vehicleSchema.parse(body);

    const duplicate = await Vehicle.findOne({
      vehicleNumber: parsed.vehicleNumber,
      _id: { $ne: id },
    }).lean();
    if (duplicate) {
      return errorResponse("Vehicle number already exists.", 409);
    }

    const vehicle = await Vehicle.findByIdAndUpdate(id, parsed, {
      new: true,
      runValidators: true,
    }).lean();

    if (!vehicle) {
      return errorResponse("Vehicle not found.", 404);
    }

    return successResponse(vehicle);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await context.params;
    if (!isValidObjectId(id)) {
      return errorResponse("Invalid vehicle ID.", 400);
    }

    const vehicle = await Vehicle.findByIdAndDelete(id).lean();
    if (!vehicle) {
      return errorResponse("Vehicle not found.", 404);
    }

    return successResponse({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
