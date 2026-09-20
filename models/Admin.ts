import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
  },
  { timestamps: true }
);

export type AdminDocument = InferSchemaType<typeof adminSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Admin = models.Admin || model("Admin", adminSchema, "admins");
