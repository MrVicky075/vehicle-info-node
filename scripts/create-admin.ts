import { config } from "dotenv";
import { resolve } from "path";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!uri) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }
  if (!email || !password) {
    console.error("Missing ADMIN_EMAIL or ADMIN_PASSWORD");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "vehicle_information" });

  const Admin =
    mongoose.models.Admin ||
    mongoose.model(
      "Admin",
      new mongoose.Schema(
        {
          email: { type: String, required: true, unique: true },
          passwordHash: { type: String, required: true },
        },
        { timestamps: true }
      ),
      "admins"
    );

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash });
  console.log("Admin created successfully.");
  await mongoose.disconnect();
}

createAdmin().catch(async (error) => {
  console.error("Failed to create admin:", error instanceof Error ? error.message : "unknown");
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
