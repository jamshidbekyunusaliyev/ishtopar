import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const conversationSchema = z.object({ jobId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SEEKER") return NextResponse.json({ error: "Seeker access required." }, { status: 403 });
  const parsed = conversationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid job." }, { status: 400 });
  const job = await prisma.job.findUnique({ where: { id: parsed.data.jobId }, select: { id: true, company: { select: { ownerId: true } } } });
  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });
  const conversation = await prisma.conversation.upsert({
    where: { jobId_seekerId_employerId: { jobId: job.id, seekerId: session.user.id, employerId: job.company.ownerId } },
    create: { jobId: job.id, seekerId: session.user.id, employerId: job.company.ownerId },
    update: {},
  });
  return NextResponse.json({ conversation });
}