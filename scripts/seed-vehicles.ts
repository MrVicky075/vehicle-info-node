import { config } from "dotenv";
import { resolve } from "path";
import mongoose from "mongoose";

config({ path: resolve(process.cwd(), ".env.local") });

const sampleVehicles = [
  { vehicleType: "Car", vehicleNumber: "GJ01FA0123", blockNo: "F", houseNo: "101", name: "User1", mobileNumber: "9876543210" },
  { vehicleType: "Bike", vehicleNumber: "GJ01AB4567", blockNo: "F", houseNo: "101", name: "User1", mobileNumber: "9876543210" },
  { vehicleType: "Scooter", vehicleNumber: "GJ01SC1001", blockNo: "A", houseNo: "12", name: "Ravi Patel", mobileNumber: "9123456780" },
  { vehicleType: "Car", vehicleNumber: "GJ01CD2345", blockNo: "A", houseNo: "15", name: "Meera Shah", mobileNumber: "9988776655" },
  { vehicleType: "Bike", vehicleNumber: "GJ01BK7788", blockNo: "B", houseNo: "22", name: "Amit Joshi", mobileNumber: "9090909090" },
  { vehicleType: "Auto", vehicleNumber: "GJ01AT3344", blockNo: "B", houseNo: "25", name: "Kiran Desai", mobileNumber: "9812345678" },
  { vehicleType: "Car", vehicleNumber: "GJ01XY9876", blockNo: "C", houseNo: "301", name: "Neha Trivedi", mobileNumber: "9765432109" },
  { vehicleType: "Bike", vehicleNumber: "GJ01MN1122", blockNo: "C", houseNo: "301", name: "Neha Trivedi", mobileNumber: "9765432109" },
  { vehicleType: "Other", vehicleNumber: "GJ01OT5566", blockNo: "D", houseNo: "40", name: "Suresh Rana", mobileNumber: "9654321098" },
  { vehicleType: "Car", vehicleNumber: "GJ05PQ7788", blockNo: "D", houseNo: "42", name: "Pooja Mehta", mobileNumber: "9543210987" },
  { vehicleType: "Scooter", vehicleNumber: "GJ05SC8899", blockNo: "E", houseNo: "7", name: "Harsh Vora", mobileNumber: "9432109876" },
  { vehicleType: "Bike", vehicleNumber: "GJ05BK9900", blockNo: "E", houseNo: "9", name: "Anjali Dave", mobileNumber: "9321098765" },
  { vehicleType: "Car", vehicleNumber: "GJ27AA1111", blockNo: "F", houseNo: "202", name: "Vikram Solanki", mobileNumber: "9210987654" },
  { vehicleType: "Bike", vehicleNumber: "GJ27BB2222", blockNo: "F", houseNo: "202", name: "Vikram Solanki", mobileNumber: "9210987654" },
  { vehicleType: "Car", vehicleNumber: "GJ27CC3333", blockNo: "G", houseNo: "55", name: "Divya Chauhan", mobileNumber: "9109876543" },
  { vehicleType: "Auto", vehicleNumber: "GJ27DD4444", blockNo: "G", houseNo: "58", name: "Nilesh Parmar", mobileNumber: "9008765432" },
  { vehicleType: "Scooter", vehicleNumber: "GJ01EE5555", blockNo: "H", houseNo: "16", name: "Kavita Bhatt", mobileNumber: "8899776655" },
  { vehicleType: "Bike", vehicleNumber: "GJ01FF6666", blockNo: "H", houseNo: "18", name: "Rohan Gajjar", mobileNumber: "8788665544" },
  { vehicleType: "Car", vehicleNumber: "GJ01GG7777", blockNo: "I", houseNo: "90", name: "Sneha Kapadia", mobileNumber: "8677554433" },
  { vehicleType: "Other", vehicleNumber: "GJ01HH8888", blockNo: "I", houseNo: "95", name: "Manish Pandya", mobileNumber: "8566443322" },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: "vehicle_information" });

  const Vehicle =
    mongoose.models.Vehicle ||
    mongoose.model(
      "Vehicle",
      new mongoose.Schema(
        {
          vehicleType: String,
          vehicleNumber: { type: String, unique: true },
          vehicleNumberLast4: String,
          blockNo: String,
          houseNo: String,
          name: String,
          mobileNumber: String,
        },
        { timestamps: true }
      ),
      "vehicles"
    );

  let inserted = 0;
  for (const item of sampleVehicles) {
    const exists = await Vehicle.findOne({ vehicleNumber: item.vehicleNumber });
    if (exists) continue;
    await Vehicle.create({
      ...item,
      vehicleNumberLast4: item.vehicleNumber.slice(-4),
    });
    inserted += 1;
  }

  console.log(`Seed complete. Inserted ${inserted} vehicles.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error instanceof Error ? error.message : "unknown");
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
