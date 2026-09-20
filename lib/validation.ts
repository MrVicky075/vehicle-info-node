import { z } from "zod";

export const VEHICLE_TYPES = [
  "Car",
  "Bike",
  "Scooter",
  "Auto",
  "Other",
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const vehicleSchema = z.object({
  vehicleType: z.enum(VEHICLE_TYPES, {
    error: "Vehicle type is required",
  }),
  vehicleNumber: z
    .string()
    .trim()
    .min(1, "Vehicle number is required")
    .max(20, "Vehicle number is too long")
    .transform((value) => value.toUpperCase()),
  blockNo: z
    .string()
    .trim()
    .min(1, "Block number is required")
    .max(20, "Block number is too long"),
  houseNo: z
    .string()
    .trim()
    .min(1, "House number is required")
    .max(20, "House number is too long"),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;

export const ALLOWED_SORT_FIELDS = [
  "vehicleNumber",
  "blockNo",
  "houseNo",
  "name",
  "createdAt",
] as const;

export type SortField = (typeof ALLOWED_SORT_FIELDS)[number];

export function parseSortField(value: string | null): SortField {
  if (value && (ALLOWED_SORT_FIELDS as readonly string[]).includes(value)) {
    return value as SortField;
  }
  return "vehicleNumber";
}

export function parseSortOrder(value: string | null): "asc" | "desc" {
  return value === "desc" ? "desc" : "asc";
}
