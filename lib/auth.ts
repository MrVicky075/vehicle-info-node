import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { authConfig } from "@/lib/auth.config";

const credentialsSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        await connectDB();
        const admin = await Admin.findOne({ email: parsed.data.email }).lean();
        if (!admin) {
          return null;
        }

        const valid = await bcrypt.compare(
          parsed.data.password,
          admin.passwordHash
        );
        if (!valid) {
          return null;
        }

        return {
          id: String(admin._id),
          email: admin.email,
          role: "admin",
        };
      },
    }),
  ],
});

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if ((session.user as { role?: string }).role !== "admin") {
    throw new Error("Forbidden");
  }
  return session;
}
