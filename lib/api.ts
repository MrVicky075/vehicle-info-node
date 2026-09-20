import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(
  data: T,
  status = 200,
  extra?: Record<string, unknown>
) {
  return NextResponse.json({ success: true, data, ...extra }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const message = error.issues[0]?.message ?? "Validation error";
    return errorResponse(message, 400);
  }

  if (isDuplicateKeyError(error)) {
    return errorResponse("Vehicle number already exists.", 409);
  }

  if (error instanceof Error && error.message === "Unauthorized") {
    return errorResponse("Unauthorized", 401);
  }

  if (error instanceof Error && error.message === "Forbidden") {
    return errorResponse("Forbidden", 403);
  }

  console.error("API error:", error instanceof Error ? error.message : "unknown");
  return errorResponse("An unexpected server error occurred.", 500);
}

export function maskMobile(mobile: string): string {
  if (mobile.length < 5) return "*****";
  return `${mobile.slice(0, 5)}*****`;
}

export function shouldShowPublicMobile(): boolean {
  return process.env.SHOW_PUBLIC_MOBILE !== "false";
}
