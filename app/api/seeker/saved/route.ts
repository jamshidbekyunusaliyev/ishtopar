import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const savedSchema = z.object({ jobId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SEEKER") return NextResponse.json({ error: "Seeker access required." }, { status: 403 });
  const parsed = savedSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid job." }, { status: 400 });
  try {
    await prisma.savedJob.create({ data: { userId: session.user.id, jobId: parsed.data.jobId } });
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "P2002")) return NextResponse.json({ error: "Unable to save this job." }, { status: 500 });
  }
  return NextResponse.json({ saved: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SEEKER") return NextResponse.json({ error: "Seeker access required." }, { status: 403 });
  const parsed = savedSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid job." }, { status: 400 });
  await prisma.savedJob.deleteMany({ where: { userId: session.user.id, jobId: parsed.data.jobId } });
  return NextResponse.json({ saved: false });
}