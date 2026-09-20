import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

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

vehicleSchema.index({ vehicleNumber: 1 }, { unique: true });
vehicleSchema.index({ houseNo: 1 });
vehicleSchema.index({ blockNo: 1 });

export type VehicleDocument = InferSchemaType<typeof vehicleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Vehicle =
  models.Vehicle || model("Vehicle", vehicleSchema, "vehicles");
