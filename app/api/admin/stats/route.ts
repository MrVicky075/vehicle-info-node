import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { Vehicle } from "@/models/Vehicle";
import { successResponse, handleApiError } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const [total, cars, bikes, other] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ vehicleType: "Car" }),
      Vehicle.countDocuments({ vehicleType: "Bike" }),
      Vehicle.countDocuments({
        vehicleType: { $in: ["Scooter", "Auto", "Other"] },
      }),
    ]);

    return successResponse({ total, cars, bikes, other });
  } catch (error) {
    return handleApiError(error);
  }
}
