import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(100),
  role: z.enum(["SEEKER", "EMPLOYER"]),
  companyName: z.string().trim().min(2).max(100).optional(),
}).refine((data) => data.role !== "EMPLOYER" || Boolean(data.companyName), {
  path: ["companyName"],
  message: "Company name is required for employer accounts.",
});

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your details." }, { status: 400 });
  const { name, email, password, role, companyName } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        ...(role === "SEEKER" ? { profile: { create: {} } } : {}),
        ...(role === "EMPLOYER" ? { companies: { create: { name: companyName! } } } : {}),
      },
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create your account." }, { status: 500 });
  }
}