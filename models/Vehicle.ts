import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

function last4FromVehicleNumber(vehicleNumber: string): string {
  return vehicleNumber.trim().toUpperCase().slice(-4);
}

const vehicleSchema = new Schema(
  {
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["Car", "Bike", "Scooter", "Auto", "Other"],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    // Indexed suffix for fast "last 4 digits" public search (avoids collection-scan regex)
    vehicleNumberLast4: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    blockNo: {
      type: String,
      required: [true, "Block number is required"],
      trim: true,
      index: true,
    },
    houseNo: {
      type: String,
      required: [true, "House number is required"],
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [100, "Name must be at most 100 characters"],
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
      trim: true,
    },
  },
  { timestamps: true }
);

vehicleSchema.pre("validate", function (next) {
  if (this.vehicleNumber) {
    this.vehicleNumberLast4 = last4FromVehicleNumber(this.vehicleNumber);
  }
  next();
});

vehicleSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (!update || Array.isArray(update)) {
    next();
    return;
  }

  const direct = update as Record<string, unknown>;
  const set = (direct.$set ?? {}) as Record<string, unknown>;
  const vehicleNumber =
    (typeof set.vehicleNumber === "string" ? set.vehicleNumber : null) ??
    (typeof direct.vehicleNumber === "string" ? direct.vehicleNumber : null);

  if (vehicleNumber) {
    const last4 = last4FromVehicleNumber(vehicleNumber);
    if (direct.$set && typeof direct.$set === "object") {
      (direct.$set as Record<string, unknown>).vehicleNumberLast4 = last4;
    } else {
      direct.vehicleNumberLast4 = last4;
    }
  }

  next();
});

vehicleSchema.index({ vehicleNumber: 1 }, { unique: true });
vehicleSchema.index({ vehicleNumberLast4: 1 });
vehicleSchema.index({ houseNo: 1 });
vehicleSchema.index({ blockNo: 1 });

export type VehicleDocument = InferSchemaType<typeof vehicleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Vehicle =
  models.Vehicle || model("Vehicle", vehicleSchema, "vehicles");

/** One-time backfill so existing rows get vehicleNumberLast4 for indexed search. */
export async function ensureVehicleSearchFields(): Promise<void> {
  await Vehicle.collection.updateMany(
    {
      $or: [
        { vehicleNumberLast4: { $exists: false } },
        { vehicleNumberLast4: null },
        { vehicleNumberLast4: "" },
      ],
    },
    [
      {
        $set: {
          vehicleNumberLast4: {
            $toUpper: {
              $substrCP: [
                "$vehicleNumber",
                {
                  $max: [
                    0,
                    { $subtract: [{ $strLenCP: "$vehicleNumber" }, 4] },
                  ],
                },
                4,
              ],
            },
          },
        },
      },
    ]
  );
}